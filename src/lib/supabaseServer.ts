import { createClient } from "@supabase/supabase-js";

/**
 * Parse Supabase public URL to get bucket and file path.
 * URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 */
function parseSupabasePublicUrl(url: string): { bucket: string; path: string } | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (!match) return null;
    return { bucket: match[1], path: match[2] };
  } catch {
    return null;
  }
}

/**
 * Delete an image from Supabase Storage by its public URL.
 * Call from server only (e.g. in server actions).
 */
export async function deleteImageByUrl(publicUrl: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  const parsed = parseSupabasePublicUrl(publicUrl);
  if (!parsed) return;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await supabase.storage.from(parsed.bucket).remove([parsed.path]);
}
