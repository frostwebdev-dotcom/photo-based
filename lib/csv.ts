export type SubmissionRow = {
  id: string;
  created_at: string;
  status: string;
  item_description: string;
  pickup_location: string;
  contact_details: string;
  image_path: string;
};

export function buildCsv(rows: SubmissionRow[]): string {
  const header = [
    "id",
    "created_at",
    "status",
    "item_description",
    "pickup_location",
    "contact_details",
    "image_path",
  ].join(",");

  const escape = (val: string) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = rows.map(
    (r) =>
      [
        escape(r.id),
        escape(r.created_at),
        escape(r.status),
        escape(r.item_description),
        escape(r.pickup_location),
        escape(r.contact_details),
        escape(r.image_path),
      ].join(",")
  );

  return [header, ...lines].join("\n");
}
