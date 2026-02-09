"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteJob } from "./actions";

interface DeleteJobButtonProps {
  jobId: string;
  jobTitle: string;
}

export function DeleteJobButton({ jobId, jobTitle }: DeleteJobButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    setDeleting(true);
    const result = await deleteJob(jobId);
    setDeleting(false);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
