import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { getImagePaths, createSignedUrl } from "@/lib/signedUrl";

const PER_PAGE = 20;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const status = searchParams.get("status") ?? "";
  const search = (searchParams.get("search") ?? "").trim();
  const offset = (page - 1) * PER_PAGE;

  const serviceSupabase = (await import("@/lib/supabaseService")).createServiceClient();
  let query = serviceSupabase
    .from("submissions")
    .select("id, created_at, status, item_description, pickup_location, contact_details, image_path", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `item_description.ilike.%${search}%,pickup_location.ilike.%${search}%,contact_details.ilike.%${search}%`
    );
  }

  const { data: rows, error, count } = await query.range(offset, offset + PER_PAGE - 1);

  if (error) {
    console.error("Admin submissions fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }

  const items = rows ?? [];
  const rowsWithSignedUrls = await Promise.all(
    items.map(async (r) => {
      const paths = getImagePaths(r.image_path);
      const firstPath = paths[0];
      const signed_image_url = firstPath ? await createSignedUrl(firstPath) : "";
      return { ...r, signed_image_url, image_count: paths.length };
    })
  );

  return NextResponse.json({
    rows: rowsWithSignedUrls,
    total: count ?? 0,
    page,
    perPage: PER_PAGE,
  });
}
