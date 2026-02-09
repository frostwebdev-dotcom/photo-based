"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";

type Submission = {
  id: string;
  created_at: string;
  status: string;
  item_description: string;
  pickup_location: string;
  contact_details: string;
  image_path: string;
  signed_image_url?: string;
};

const STATUS_OPTIONS = ["", "New", "Quoted", "Scheduled", "Archived"];
const PER_PAGE = 20;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(status && { status }),
      ...(search && { search }),
    });
    const res = await fetch(`/api/admin/submissions?${params}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (data.rows) {
      setSubmissions(data.rows);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, status, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setToast({ message: "Status updated", type: "success" });
      fetchSubmissions();
    } else {
      setToast({ message: "Failed to update", type: "error" });
    }
  };

  const handleArchive = (id: string) => {
    handleStatusChange(id, "Archived");
  };

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    window.open(`/api/admin/export-csv?${params}`, "_blank");
  };

  const totalPages = Math.ceil(total / PER_PAGE);
  const shortDesc = (s: string) => (s.length > 50 ? s.slice(0, 50) + "…" : s);
  const shortLoc = (s: string) => (s.length > 30 ? s.slice(0, 30) + "…" : s);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-emerald-600">
            Admin Dashboard
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search description, location, contact…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="min-w-[200px]"
            />
            <Button type="submit">Search</Button>
          </form>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt || "all"} value={opt}>
                {opt || "All statuses"}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading…</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No submissions found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-[200px] truncate">
                      {shortDesc(s.item_description)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[120px] truncate">
                      {shortLoc(s.pickup_location)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[120px] truncate">
                      {shortLoc(s.contact_details)}
                    </td>
                    <td className="px-4 py-3">
                      <ThumbnailCell signedImageUrl={s.signed_image_url ?? null} />
                    </td>
                    <td className="px-4 py-3 flex flex-wrap gap-1">
                      <Link
                        href={`/admin/${s.id}`}
                        className="rounded px-2 py-1 text-sm text-emerald-600 hover:bg-emerald-50"
                      >
                        View
                      </Link>
                      {s.status !== "Archived" && (
                        <button
                          onClick={() => handleArchive(s.id)}
                          className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
                        >
                          Archive
                        </button>
                      )}
                      {s.status !== "Archived" && (
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          className="rounded border border-slate-300 text-xs py-1"
                        >
                          <option value="New">New</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Archived">Archived</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Page {page} of {totalPages} ({total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}

function ThumbnailCell({
  signedImageUrl,
}: {
  signedImageUrl: string | null;
}) {
  if (!signedImageUrl) return <span className="text-xs text-slate-400">—</span>;

  return (
    <a href={signedImageUrl} target="_blank" rel="noopener noreferrer" className="block">
      <img
        src={signedImageUrl}
        alt="Thumb"
        className="h-12 w-12 rounded object-cover"
      />
    </a>
  );
}
