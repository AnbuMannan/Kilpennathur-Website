import { auth } from "@/app/api/auth/[...nextauth]/route";
import { listSupabaseMedia } from "@/lib/listSupabaseFiles";
import { MediaGallery } from "./MediaGallery";
import { ImagePlus } from "lucide-react";

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) return null;

  const files = await listSupabaseMedia();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Media Library</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {files.length} file{files.length !== 1 ? "s" : ""} in storage
        </p>
      </div>

      <MediaGallery files={files} />
    </div>
  );
}
