import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (e.g., "kilpennathur_data")
 * @param folder - Optional folder path within the bucket (e.g., "news-images", "business-images")
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string,
  folder?: string
): Promise<string> {
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExt = file.name.split(".").pop();
  const fileName = `${timestamp}-${randomString}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}
