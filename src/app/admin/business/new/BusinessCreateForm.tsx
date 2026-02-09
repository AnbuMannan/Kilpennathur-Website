"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createBusiness } from "../actions";
import { uploadImage } from "@/lib/uploadImage";

type Category = { id: string; name: string };

export function BusinessCreateForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createBusiness, null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");

    // Upload immediately
    setUploading(true);
    try {
      const url = await uploadImage(file, "kilpennathur_data", "business-images");
      setImageUrl(url);
      setUploadError("");
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue=""
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.name && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="nameTamil" className="mb-1 block text-sm font-medium">
          Name (Tamil)
        </label>
        <input
          id="nameTamil"
          name="nameTamil"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.categoryId && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.categoryId}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="image" className="mb-1 block text-sm font-medium">
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
        />
        {uploading && (
          <p className="mt-1 text-sm text-muted-foreground">Uploading image...</p>
        )}
        {uploadError && (
          <p className="mt-1 text-sm text-destructive">{uploadError}</p>
        )}
        {imagePreview && !uploadError && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-auto rounded-md border border-border object-cover"
            />
          </div>
        )}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          Create Business
        </button>
        <Link
          href="/admin/business"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
