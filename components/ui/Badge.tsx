"use client";

type Status = "New" | "Quoted" | "Scheduled" | "Archived";

const statusColors: Record<Status, string> = {
  New: "bg-blue-100 text-blue-800",
  Quoted: "bg-amber-100 text-amber-800",
  Scheduled: "bg-emerald-100 text-emerald-800",
  Archived: "bg-slate-100 text-slate-600",
};

export function Badge({ status }: { status: string }) {
  const color = statusColors[status as Status] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
