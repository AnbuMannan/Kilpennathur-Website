"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createServicePost, updateServicePost } from "@/app/admin/services/actions";
import type { ServicePostActionState } from "@/app/admin/services/actions";
import { uploadImage } from "@/lib/uploadImage";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Zod ---------- */

const postSchema = z.object({
  title: z.string().min(1, "Title (English) is required").trim(),
  content: z.string().min(1, "Content is required").trim(),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

export type ServicePostForEdit = {
  id: string;
  serviceId: string;
  title: string;
  titleTamil: string | null;
  slug: string;
  content: string;
  contentTamil: string | null;
  image: string | null;
  status: string;
};

type ServicePostFormProps =
  | { mode: "create"; serviceId: string; serviceName: string }
  | { mode: "edit"; post: ServicePostForEdit; serviceName: string };

/* ---------- Component ---------- */

export function ServicePostForm(props: ServicePostFormProps) {
  const isEdit = props.mode === "edit";
  const post = isEdit ? props.post : null;
  const serviceId = isEdit ? post!.serviceId : props.serviceId;
  const serviceName = props.serviceName;

  const [state, formAction] = useActionState(
    isEdit ? updateServicePost : createServicePost,
    null as ServicePostActionState | null,
  );

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(post?.title ?? "");
  const [previewStatus, setPreviewStatus] = useState(post?.status ?? "draft");
  const [imagePreview, setImagePreview] = useState<string>(post?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(post?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewTitle(e.target.value);
    if (!slugTouched) setSlug(generateSlug(e.target.value));
  };

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
      const url = await uploadImage(file, "kilpennathur_data", "service-images");
      setImageUrl(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload image");
      setImageUrl(post?.image ?? "");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let slugVal = (formData.get("slug") as string)?.trim();
    if (!slugVal) {
      slugVal = generateSlug((formData.get("title") as string) ?? "");
      formData.set("slug", slugVal);
    }

    const result = postSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      content: (formData.get("content") as string)?.trim(),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg = flat.title?.[0] ?? flat.content?.[0] ?? "Please fix the errors";
      toast.error(msg);
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <AdminFormLayout
      preview={
        <FormPreviewCard
          title={previewTitle}
          subtitle={serviceName}
          image={imagePreview}
          statusLabel={previewStatus}
          statusColor={
            previewStatus === "published"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }
          fields={[{ label: "Slug", value: slug }]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {isEdit && post && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="serviceId" value={serviceId} />

        {state?.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        {/* ──────────── Post Details ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Post Details
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Title (English) *
              </label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={post?.title ?? ""}
                onChange={handleTitleChange}
              />
              {state?.fieldErrors?.title && (
                <p className="mt-1 text-sm text-destructive">{state.fieldErrors.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="titleTamil" className="mb-1 block text-sm font-medium">
                Title (Tamil)
              </label>
              <Input
                id="titleTamil"
                name="titleTamil"
                defaultValue={post?.titleTamil ?? ""}
                placeholder="தமிழ் தலைப்பு"
              />
            </div>
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium">
              Slug
            </label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => setSlugTouched(true)}
              placeholder="auto-generated-from-title"
              className="w-full font-mono text-sm"
            />
            {state?.fieldErrors?.slug && (
              <p className="mt-1 text-sm text-destructive">{state.fieldErrors.slug}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              onChange={(e) => setPreviewStatus(e.target.value)}
              className={selectCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </fieldset>

        {/* ──────────── Content ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Content
          </legend>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm font-medium">
              Content (English) *
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              required
              defaultValue={post?.content ?? ""}
              className={textareaCls}
              placeholder="Write the article content..."
            />
            {state?.fieldErrors?.content && (
              <p className="mt-1 text-sm text-destructive">{state.fieldErrors.content}</p>
            )}
          </div>

          <div>
            <label htmlFor="contentTamil" className="mb-1 block text-sm font-medium">
              Content (Tamil)
            </label>
            <textarea
              id="contentTamil"
              name="contentTamil"
              rows={6}
              defaultValue={post?.contentTamil ?? ""}
              className={textareaCls}
              placeholder="உள்ளடக்கம் (தமிழ்)..."
            />
          </div>
        </fieldset>

        {/* ──────────── Media ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Media
          </legend>

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
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
            />
            {uploading && <p className="mt-1 text-sm text-muted-foreground">Uploading...</p>}
            {uploadError && <p className="mt-1 text-sm text-destructive">{uploadError}</p>}
            {imagePreview && !uploadError && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded-md border object-cover" />
            )}
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>
        </fieldset>

        {/* ──────────── Actions ──────────── */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={uploading}>
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/services/${serviceId}/posts`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
