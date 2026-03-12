import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createSignedUrlsForPaths } from "@/lib/signedUrl";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const serviceSupabase = (await import("@/lib/supabaseService")).createServiceClient();
  const { data, error } = await serviceSupabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Submission not found" },
      { status: 404 }
    );
  }

  const signedUrls = await createSignedUrlsForPaths(data.image_path);

  return NextResponse.json({
    ...data,
    signed_image_url: signedUrls[0] ?? "",
    signed_image_urls: signedUrls,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.status === "string" && ["New", "Quoted", "Scheduled", "Archived"].includes(body.status)) {
    updates.status = body.status;
  }
  if (typeof body.admin_notes === "string") {
    updates.admin_notes = body.admin_notes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  const serviceSupabase = (await import("@/lib/supabaseService")).createServiceClient();
  const { data, error } = await serviceSupabase
    .from("submissions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { message: "Failed to update submission" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
