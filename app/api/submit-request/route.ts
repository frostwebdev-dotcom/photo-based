import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseService";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { validateImageFile, submissionSchema } from "@/lib/validators";
import { sendSubmissionEmail } from "@/lib/sendgrid";
import { createSignedUrl } from "@/lib/signedUrl";
import { checkRateLimit } from "@/lib/rateLimit";

const BUCKET = "junk-uploads";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  if (realIp) return realIp;
  return "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const itemDescription = formData.get("itemDescription") as string;
    const pickupLocation = formData.get("pickupLocation") as string;
    const contactDetails = formData.get("contactDetails") as string;
    const recaptchaToken = formData.get("recaptchaToken") as string;
    const fileList = formData.getAll("file") as File[];

    const parsed = submissionSchema.safeParse({
      itemDescription,
      pickupLocation,
      contactDetails,
      recaptchaToken,
    });

    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Validation failed";
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    const files = fileList.filter((f) => f && typeof f.size === "number" && f.size > 0);
    if (files.length === 0) {
      return NextResponse.json(
        { message: "Please upload at least one photo (JPG or PNG, max 10MB each)." },
        { status: 400 }
      );
    }
    if (files.length > 10) {
      return NextResponse.json(
        { message: "Maximum 10 photos allowed." },
        { status: 400 }
      );
    }

    for (const file of files) {
      const imgResult = validateImageFile(file);
      if (!imgResult.valid) {
        return NextResponse.json({ message: imgResult.error }, { status: 400 });
      }
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaEnabled =
      recaptchaSecret &&
      recaptchaSecret !== "your-recaptcha-secret-key" &&
      !recaptchaSecret.startsWith("your-");
    if (recaptchaEnabled) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken ?? "");
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { message: "Verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    const supabase = createServiceClient();
    const submissionId = crypto.randomUUID();
    const timestamp = Date.now();
    const uploadedPaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeExt = ext === "jpeg" ? "jpg" : ext;
      const random = Math.random().toString(36).slice(2, 10);
      const storagePath = `submissions/${submissionId}/${timestamp}-${i}-${random}.${safeExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        await supabase.storage.from(BUCKET).remove(uploadedPaths);
        return NextResponse.json(
          { message: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }
      uploadedPaths.push(storagePath);
    }

    const imagePathValue = uploadedPaths.length === 1 ? uploadedPaths[0] : JSON.stringify(uploadedPaths);
    const firstFile = files[0];

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        id: submissionId,
        item_description: itemDescription,
        pickup_location: pickupLocation,
        contact_details: contactDetails,
        image_path: imagePathValue,
        image_mime: firstFile.type,
        image_size: firstFile.size,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      await supabase.storage.from(BUCKET).remove(uploadedPaths);
      return NextResponse.json(
        { message: "Failed to save request. Please try again." },
        { status: 500 }
      );
    }

    const { createSignedUrlsForPaths } = await import("@/lib/signedUrl");
    const signedUrls = await createSignedUrlsForPaths(imagePathValue);

    try {
      await sendSubmissionEmail({
        submissionId,
        itemDescription,
        pickupLocation,
        contactDetails,
        signedImageUrls: signedUrls,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json({
      id: submissionId,
      message: "Request submitted successfully.",
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
