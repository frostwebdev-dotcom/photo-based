import { createServiceClient } from "./supabaseService";

const BUCKET = "junk-uploads";
const EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function createSignedUrl(path: string): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, EXPIRY_SECONDS);

  if (error) {
    console.error("Error creating signed URL:", error);
    return "";
  }

  return data?.signedUrl ?? "";
}
