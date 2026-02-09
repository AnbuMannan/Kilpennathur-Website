"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNews } from "./actions";

export function DeleteNewsButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this news item? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const result = await deleteNews(id);
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/admin/news");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete news.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-destructive hover:underline disabled:opacity-50 ml-3"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
