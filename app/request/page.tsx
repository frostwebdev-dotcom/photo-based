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

export default function RequestPage() {
  const router = useRouter();
  const [itemDescription, setItemDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setErrors((prev) => ({ ...prev, file: "" }));
      return;
    }

    const result = validateImageFile(f);
    if (!result.valid) {
      setFile(null);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setErrors((prev) => ({ ...prev, file: result.error }));
      return;
    }

    setFile(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setErrors((prev) => ({ ...prev, file: "" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const recaptchaToken =
      typeof window !== "undefined" &&
      typeof (window as unknown as { grecaptcha?: { execute: (siteKey: string, opts: { action: string }) => Promise<string> } }).grecaptcha?.execute === "function"
        ? await (window as unknown as { grecaptcha: { execute: (siteKey: string, opts: { action: string }) => Promise<string> } }).grecaptcha.execute(
            RECAPTCHA_SITE_KEY ?? "",
            { action: "submit" }
          )
        : "";

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

    if (!file) {
      setErrors((prev) => ({ ...prev, file: "Please upload a JPG or PNG image (max 10MB)." }));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("itemDescription", itemDescription);
      formData.append("pickupLocation", pickupLocation);
      formData.append("contactDetails", contactDetails);
      formData.append("file", file);
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
      {RECAPTCHA_SITE_KEY && (
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
          Fill in the form and upload a photo. We&apos;ll reply with a quote soon.
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
              Photo <span className="text-slate-500">(JPG or PNG, max 10MB)</span>
            </label>
            <input
              type="file"
              accept={ALLOWED_MIME_TYPES.join(",")}
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2.5 file:text-emerald-700 file:hover:file:bg-emerald-100"
            />
            {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-slate-200 object-contain"
                />
                {file && (
                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                )}
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
