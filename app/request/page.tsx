"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  validateImageFile,
  ALLOWED_MIME_TYPES,
  submissionSchema,
} from "@/lib/validators";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_ENABLED =
  RECAPTCHA_SITE_KEY &&
  RECAPTCHA_SITE_KEY !== "your-recaptcha-site-key" &&
  !RECAPTCHA_SITE_KEY.startsWith("your-");

export default function RequestPage() {
  const router = useRouter();
  const [itemDescription, setItemDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const MAX_PHOTOS = 10;
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) {
      setPreviewUrls((prev) => {
        prev.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
      setFiles([]);
      setErrors((prev) => ({ ...prev, file: "" }));
      return;
    }

    const next: File[] = [];
    let fileError = "";
    for (let i = 0; i < Math.min(selected.length, MAX_PHOTOS); i++) {
      const f = selected[i];
      const result = validateImageFile(f);
      if (!result.valid) {
        fileError = result.error;
        break;
      }
      next.push(f);
    }
    if (fileError) {
      setFiles([]);
      setPreviewUrls((prev) => {
        prev.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
      setErrors((prev) => ({ ...prev, file: fileError }));
      return;
    }

    setFiles(next);
    setPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return next.map((f) => URL.createObjectURL(f));
    });
    setErrors((prev) => ({ ...prev, file: "" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let recaptchaToken = "";
    if (RECAPTCHA_ENABLED && typeof window !== "undefined") {
      const grecaptcha = (window as unknown as { grecaptcha?: { execute: (siteKey: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
      if (typeof grecaptcha?.execute === "function") {
        recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY!, { action: "submit" });
      }
    }

    const payload = {
      itemDescription,
      pickupLocation,
      contactDetails,
      recaptchaToken,
    };

    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !fieldErrors[path]) fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (files.length === 0) {
      setErrors((prev) => ({ ...prev, file: "Please upload at least one photo (JPG or PNG, max 10MB each)." }));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("itemDescription", itemDescription);
      formData.append("pickupLocation", pickupLocation);
      formData.append("contactDetails", contactDetails);
      files.forEach((f) => formData.append("file", f));
      formData.append("recaptchaToken", recaptchaToken);

      const res = await fetch("/api/submit-request", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({
          form: data.message ?? "Something went wrong. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      router.push("/success");
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {RECAPTCHA_ENABLED && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="text-lg font-bold text-emerald-600 hover:text-emerald-700">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Request a junk quote
        </h1>
        <p className="mt-2 text-slate-600">
          Fill in the form and upload up to {MAX_PHOTOS} photos. We&apos;ll reply with a quote soon.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.form && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <Textarea
            label="Item description"
            placeholder="Describe what you want to remove (furniture, appliances, etc.)"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            error={errors.itemDescription}
            minLength={10}
            maxLength={500}
            rows={4}
          />
          <p className="-mt-2 text-xs text-slate-500">{itemDescription.length}/500 characters</p>

          <Input
            label="Pickup location"
            placeholder="Street address, city, zip"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            error={errors.pickupLocation}
          />

          <Input
            label="Contact details"
            placeholder="Phone number or email"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            error={errors.contactDetails}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Photos <span className="text-slate-500">(up to {MAX_PHOTOS}, JPG or PNG, max 10MB each)</span>
            </label>
            <input
              type="file"
              accept={ALLOWED_MIME_TYPES.join(",")}
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2.5 file:text-emerald-700 file:hover:file:bg-emerald-100"
            />
            {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewUrls.map((url, i) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="max-h-40 w-full rounded-lg border border-slate-200 object-cover"
                    />
                    {files[i] && (
                      <p className="mt-1 text-xs text-slate-500">
                        {(files[i].size / 1024).toFixed(0)} KB
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
            Submit request
          </Button>
        </form>
      </main>
    </div>
  );
}
