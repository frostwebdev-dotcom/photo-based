import { createServiceClient } from "./supabaseService";

const BUCKET = "junk-uploads";
const EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

/** Parse image_path from DB: can be a single path (legacy) or JSON array of paths. */
export function getImagePaths(imagePath: string): string[] {
  if (!imagePath) return [];
  try {
    if (imagePath.startsWith("[")) {
      const arr = JSON.parse(imagePath) as unknown;
      return Array.isArray(arr) ? (arr as string[]) : [imagePath];
    }
  } catch {
    // fallback
  }
  return [imagePath];
}

export async function createSignedUrl(path: string): Promise<string> {
  const trimmed = path?.trim?.() ?? "";
  if (!trimmed) {
    console.error("createSignedUrl: empty path");
    return "";
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(trimmed, EXPIRY_SECONDS);

  if (error) {
    console.error("Error creating signed URL for path:", trimmed, "error:", error.message, "code:", (error as { code?: string }).code);
    return "";
  }

  const url = data?.signedUrl ?? "";
  if (!url) console.error("createSignedUrl: no signedUrl in response for path:", trimmed);
  return url;
}

export async function createSignedUrlsForPaths(imagePath: string): Promise<string[]> {
  const paths = getImagePaths(imagePath);
  return Promise.all(paths.map((p) => createSignedUrl(p)));
}
