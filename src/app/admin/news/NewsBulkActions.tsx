"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { bulkDeleteNews, bulkPublishNews } from "./actions";

export function NewsBulkActions({
  selectedIds,
  onClear,
}: {
  selectedIds: string[];
  onClear: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"delete" | "publish" | "unpublish" | null>(null);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} item(s)? This cannot be undone.`)) return;
    setLoading("delete");
    try {
      const result = await bulkDeleteNews(selectedIds);
      if (result?.error) alert(result.error);
      else {
        onClear();
        router.refresh();
      }
    } catch {
      alert("Failed to delete.");
    } finally {
      setLoading(null);
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    setLoading(publish ? "publish" : "unpublish");
    try {
      const result = await bulkPublishNews(selectedIds, publish);
      if (result?.error) alert(result.error);
      else {
        onClear();
        router.refresh();
      }
    } catch {
      alert("Failed to update.");
    } finally {
      setLoading(null);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-4 bg-muted/50 border-b border-border">
      <span className="text-sm font-medium">{selectedIds.length} selected</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleBulkPublish(true)}
        disabled={!!loading}
      >
        {loading === "publish" ? "Publishing…" : "Publish"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleBulkPublish(false)}
        disabled={!!loading}
      >
        {loading === "unpublish" ? "Unpublishing…" : "Unpublish"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleBulkDelete}
        disabled={!!loading}
      >
        {loading === "delete" ? "Deleting…" : "Delete"}
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
