"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
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
  admin_notes: string | null;
  signed_image_url: string;
  signed_image_urls?: string[];
};

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/submissions/${id}`)
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.id) {
          setSubmission(data);
          setStatus(data.status);
          setAdminNotes(data.admin_notes ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ message: "Saved", type: "success" });
      const data = await res.json();
      setSubmission((prev) => (prev ? { ...prev, ...data } : null));
    } else {
      setToast({ message: "Failed to save", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600">Submission not found.</p>
        <Link href="/admin" className="text-emerald-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-emerald-600 hover:underline">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Submission #{submission.id.slice(0, 8)}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(submission.created_at).toLocaleString()}
              </p>
            </div>
            <Badge status={submission.status} />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Item description</h2>
              <p className="mt-1 whitespace-pre-wrap text-slate-900">{submission.item_description}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Pickup location</h2>
              <p className="mt-1 text-slate-900">{submission.pickup_location}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Contact details</h2>
              <p className="mt-1 text-slate-900">{submission.contact_details}</p>
            </div>
          </div>

          {(() => {
            const urls = submission.signed_image_urls?.length
              ? submission.signed_image_urls
              : submission.signed_image_url
                ? [submission.signed_image_url]
                : [];
            if (urls.length === 0) return null;
            return (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-700">
                  {urls.length === 1 ? "Image" : "Images"}
                </h2>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img
                        src={url}
                        alt={`Submission ${i + 1}`}
                        className="max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                      />
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold text-slate-700">Update</h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="New">New</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="flex-1">
                <Textarea
                  label="Admin notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Optional internal notes…"
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} isLoading={saving}>
                Save
              </Button>
            </div>
          </div>
        </div>
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
