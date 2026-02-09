import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { buildCsv, type SubmissionRow } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const search = (searchParams.get("search") ?? "").trim();

  const serviceSupabase = (await import("@/lib/supabaseService")).createServiceClient();
  let query = serviceSupabase
    .from("submissions")
    .select("id, created_at, status, item_description, pickup_location, contact_details, image_path");

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `item_description.ilike.%${search}%,pickup_location.ilike.%${search}%,contact_details.ilike.%${search}%`
    );
  }

  const { data: rows, error } = await query;

  if (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { message: "Failed to export" },
      { status: 500 }
    );
  }

  const csvRows: SubmissionRow[] = (rows ?? []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    status: r.status,
    item_description: r.item_description,
    pickup_location: r.pickup_location,
    contact_details: r.contact_details,
    image_path: r.image_path,
  }));

  const csv = buildCsv(csvRows);
  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
