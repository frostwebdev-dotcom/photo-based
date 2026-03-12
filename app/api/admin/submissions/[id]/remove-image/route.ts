import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { getImagePaths } from "@/lib/signedUrl";

const BUCKET = "junk-uploads";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: { index?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const index = typeof body.index === "number" ? body.index : parseInt(String(body.index), 10);
  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json(
      { message: "Invalid index: provide a non-negative integer" },
      { status: 400 }
    );
  }

  const serviceSupabase = (await import("@/lib/supabaseService")).createServiceClient();
  const { data: submission, error: fetchError } = await serviceSupabase
    .from("submissions")
    .select("image_path, image_mime, image_size")
    .eq("id", id)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json(
      { message: "Submission not found" },
      { status: 404 }
    );
  }

  const paths = getImagePaths(submission.image_path as string);
  if (index >= paths.length) {
    return NextResponse.json(
      { message: "Image index out of range" },
      { status: 400 }
    );
  }

  const pathToRemove = paths[index];
  const { error: removeError } = await serviceSupabase.storage
    .from(BUCKET)
    .remove([pathToRemove]);

  if (removeError) {
    console.error("Storage remove error:", removeError);
    return NextResponse.json(
      { message: "Failed to delete image from storage" },
      { status: 500 }
    );
  }

  const newPaths = paths.filter((_, i) => i !== index);
  const imagePathValue =
    newPaths.length === 0
      ? "[]"
      : newPaths.length === 1
        ? newPaths[0]
        : JSON.stringify(newPaths);
  const imageMime = newPaths.length > 0 ? (submission.image_mime as string) : "";
  const imageSize = newPaths.length > 0 ? (submission.image_size as number) : 0;

  const { data: updated, error: updateError } = await serviceSupabase
    .from("submissions")
    .update({
      image_path: imagePathValue,
      image_mime: imageMime,
      image_size: imageSize,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Update submission error:", updateError);
    return NextResponse.json(
      { message: "Failed to update submission" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Image removed",
    submission: updated,
  });
}
