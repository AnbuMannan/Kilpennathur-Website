"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateNews } from "../../actions";
import { uploadImage } from "@/lib/uploadImage";

type Category = { id: string; name: string };
type News = {
  id: string;
  title: string;
  titleTamil: string | null;
  content: string;
  category: string;
  image: string | null;
  status: string;
  excerpt: string | null;
};

export function NewsEditForm({
  news,
  categories,
}: {
  news: News;
  categories: Category[];
}) {
  const [state, formAction] = useActionState(updateNews, null);
  const [imagePreview, setImagePreview] = useState<string>(news.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(news.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, "kilpennathur_data", "news-images");
      setImageUrl(url);
      setUploadError("");
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImageUrl(news.image ?? "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" value={news.id} />
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={news.title}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.title && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="titleTamil" className="mb-1 block text-sm font-medium">
          Title (Tamil)
        </label>
        <input
          id="titleTamil"
          name="titleTamil"
          type="text"
          defaultValue={news.titleTamil ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={6}
          defaultValue={news.content}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.content && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.content}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={
            categories.find((c) => c.name === news.category)?.id ?? ""
          }
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
        <label htmlFor="image" className="mb-1 block text-sm font-medium">
          Image (optional – choose new to replace)
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

      <div className="flex items-center gap-2">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          defaultChecked={news.status === "published"}
          className="rounded border-input"
        />
        <label htmlFor="isPublished" className="text-sm">
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          Update News
        </button>
        <Link
          href="/admin/news"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
