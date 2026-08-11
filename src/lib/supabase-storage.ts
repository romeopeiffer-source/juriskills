import { createClient } from "@supabase/supabase-js";

export const BUCKET_PRODUCT_IMAGES = "product-images";
export const BUCKET_PRODUCT_FILES = "product-files";
export const BUCKET_INVOICES = "invoices";

/** Server-only client using the service role key — never expose this to the browser. */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis.");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export async function uploadPublicFile(bucket: string, path: string, file: Blob | Buffer, contentType: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPrivateFile(bucket: string, path: string, file: Blob | Buffer, contentType: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  return path;
}

export async function getSignedUrl(bucket: string, path: string, expiresInSeconds = 60 * 60) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
