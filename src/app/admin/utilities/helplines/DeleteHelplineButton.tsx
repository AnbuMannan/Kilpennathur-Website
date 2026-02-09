"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHelpline } from "./actions";

export function DeleteHelplineButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this helpline? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const result = await deleteHelpline(id);
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/admin/utilities/helplines");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete helpline.");
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
