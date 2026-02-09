"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  X,
  FileImage,
  Calendar,
  HardDrive,
  ExternalLink,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MediaFile = {
  name: string;
  path: string;
  publicUrl: string;
  size?: number;
  updatedAt?: string;
};

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

function getFolder(path: string): string {
  return path.split("/")[0] ?? "unknown";
}

export function MediaGallery({ files }: { files: MediaFile[] }) {
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const folders = [...new Set(files.map((f) => getFolder(f.path)))];

  const filtered = files.filter((f) => {
    const matchSearch =
      !search || f.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || getFolder(f.path) === filter;
    return matchSearch && matchFilter;
  });

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-0 h-[calc(100vh-180px)]">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 ${selected ? "mr-80" : ""} transition-all`}>
        {/* Upload hint + Search/Filter bar */}
        <div className="shrink-0 mb-4 space-y-3">
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 text-center">
            <FileImage className="h-8 w-8 mx-auto text-muted-foreground/50 mb-1" />
            <p className="text-xs text-muted-foreground">
              Upload images when creating News, Events, or Businesses. They appear here automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All folders ({files.length})</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f} ({files.filter((fi) => getFolder(fi.path) === f).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileImage className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No files found</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((file) => (
                <div
                  key={file.path}
                  onClick={() => setSelected(file)}
                  className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selected?.path === file.path
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square relative bg-muted">
                    <Image
                      src={file.publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(file.publicUrl);
                        }}
                        className="rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white shadow-lg transition-transform hover:scale-110"
                        title="Copy URL"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={file.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white shadow-lg transition-transform hover:scale-110"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Sidebar */}
      {selected && (
        <aside className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border p-5 overflow-auto z-40 shadow-xl animate-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">File Details</h3>
            <button
              onClick={() => setSelected(null)}
              className="rounded-md p-1 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Preview */}
          <div className="rounded-lg overflow-hidden border border-border mb-4">
            <div className="aspect-video relative bg-muted">
              <Image
                src={selected.publicUrl}
                alt={selected.name}
                fill
                className="object-contain"
                sizes="320px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                File Name
              </p>
              <p className="text-sm font-medium break-all">{selected.name}</p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Path
              </p>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {selected.path}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> Size
                </p>
                <p className="text-sm">{formatSize(selected.size)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Uploaded
                </p>
                <p className="text-sm">{formatDate(selected.updatedAt)}</p>
              </div>
            </div>

            {/* Copy URL */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Public URL
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={selected.publicUrl}
                  className="flex-1 text-xs p-2 bg-muted rounded-md border-0 truncate font-mono"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(selected.publicUrl)}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2"
              asChild
            >
              <a href={selected.publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Size
              </a>
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
}
