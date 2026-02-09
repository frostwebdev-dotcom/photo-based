import { z } from "zod";

export const submissionSchema = z.object({
  itemDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  pickupLocation: z
    .string()
    .min(5, "Pickup location must be at least 5 characters")
    .max(200, "Pickup location must be at most 200 characters"),
  contactDetails: z
    .string()
    .min(5, "Contact details must be at least 5 characters")
    .max(200, "Contact details must be at most 200 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export function validateImageFile(
  file: File
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPG and PNG images are allowed." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File must be under 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    };
  }
  return { valid: true };
}
