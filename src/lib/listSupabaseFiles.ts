import { createClient } from "@supabase/supabase-js";

const BUCKET = "kilpennathur_data";
const FOLDERS = ["news-images", "event-images", "business-images"] as const;

export type MediaFile = {
  name: string;
  path: string;
  publicUrl: string;
  size?: number;
  updatedAt?: string;
};

export async function listSupabaseMedia(): Promise<MediaFile[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return [];

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const all: MediaFile[] = [];

  for (const folder of FOLDERS) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit: 100 });

    if (error) continue;

    for (const file of data ?? []) {
      // Include files (have metadata); skip folder placeholders
      if (file.name && file.metadata) {
        const path = `${folder}/${file.name}`;
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(path);
        all.push({
          name: file.name,
          path,
          publicUrl,
          size: file.metadata?.size,
          updatedAt: file.updated_at ?? undefined,
        });
      }
    }
  }

  all.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  return all;
}
