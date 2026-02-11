import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function saveFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 1. Create organized path: public/uploads/[folder]/[year]
  const year = new Date().getFullYear().toString();
  const relativeUploadDir = `/uploads/${folder}/${year}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Error creating upload directory:", e);
  }

  // 2. Generate safe filename
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  // Remove special chars and spaces
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "-").toLowerCase();
  const filename = `${uniqueSuffix}-${safeName}`;

  // 3. Write file
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  // 4. Return the public URL
  return `${relativeUploadDir}/${filename}`;
}
