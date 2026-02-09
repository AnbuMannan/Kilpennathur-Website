import { auth } from "@/app/api/auth/[...nextauth]/route";
import { listSupabaseMedia } from "@/lib/listSupabaseFiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyUrlInput } from "@/components/admin/CopyUrlInput";
import { ImagePlus, FileImage } from "lucide-react";
import Image from "next/image";

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(s));
}

function formatSize(bytes: number | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) return null;

  const files = await listSupabaseMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage images uploaded to Supabase Storage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5" />
            Images ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No media files found</p>
              <p className="text-sm mt-1">
                Upload images when creating news, events, or businesses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file) => (
                <div
                  key={file.path}
                  className="group rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square relative bg-muted">
                    <Image
                      src={file.publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                  <div className="p-2">
                    <p
                      className="text-xs font-medium truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.path}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatSize(file.size)} · {formatDate(file.updatedAt)}
                    </p>
                    <CopyUrlInput value={file.publicUrl} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
