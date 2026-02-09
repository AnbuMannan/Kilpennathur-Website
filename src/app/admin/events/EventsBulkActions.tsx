"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { bulkDeleteEvents } from "./actions";

export function EventsBulkActions({
  selectedIds,
  onClear,
}: {
  selectedIds: string[];
  onClear: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} event(s)? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const result = await bulkDeleteEvents(selectedIds);
      if (result?.error) alert(result.error);
      else {
        onClear();
        router.refresh();
      }
    } catch {
      alert("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-4 bg-muted/50 border-b border-border">
      <span className="text-sm font-medium">{selectedIds.length} selected</span>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleBulkDelete}
        disabled={loading}
      >
        {loading ? "Deleting…" : "Delete"}
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
