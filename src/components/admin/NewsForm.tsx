"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createNews, updateNews } from "@/app/admin/news/actions";
import type { CreateNewsState, UpdateNewsState } from "@/app/admin/news/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

/* ---------- Zod schema ---------- */

const newsSchema = z.object({
  title: z.string().min(1, "Title (English) is required").trim(),
  titleTamil: z.string().optional(),
  content: z.string().min(1, "Content is required").trim(),
  categoryId: z.string().min(1, "Category is required"),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

type Category = { id: string; name: string };

export type NewsForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  slug: string;
  content: string;
  contentTamil: string | null;
  excerpt: string | null;
  image: string | null;
  category: string;
  tags: string;
  status: string;
  whatsappLink: string | null;
  referenceUrl: string | null;
};

type NewsFormProps =
  | { mode: "create"; categories: Category[] }
  | { mode: "edit"; news: NewsForEdit; categories: Category[] };

/* ---------- Component ---------- */

export function NewsForm(props: NewsFormProps) {
  const isEdit = props.mode === "edit";
  const news = isEdit ? props.news : null;
  const { categories } = props;

  const [state, formAction] = useActionState(
    isEdit ? updateNews : createNews,
    null as CreateNewsState | UpdateNewsState | null,
  );

  /* Preview state */
  const [previewTitle, setPreviewTitle] = useState(news?.title ?? "");
  const [previewCategory, setPreviewCategory] = useState(() => {
    if (!news) return "";
    return categories.find((c) => c.name === news.category)?.name ?? news.category;
  });
  const [previewStatus, setPreviewStatus] = useState(news?.status ?? "draft");
  const [imagePreview, setImagePreview] = useState<string>(news?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(news?.image ?? "");
  const [slug, setSlug] = useState(news?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewTitle(e.target.value);
    if (!slugTouched) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = categories.find((c) => c.id === e.target.value);
    setPreviewCategory(cat?.name ?? "");
  };

  /* Submit with client-side validation */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let slugVal = (formData.get("slug") as string)?.trim();
    if (!slugVal) {
      slugVal = generateSlug((formData.get("title") as string) ?? "");
      formData.set("slug", slugVal);
    }

    const result = newsSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      titleTamil: (formData.get("titleTamil") as string)?.trim(),
      content: (formData.get("content") as string)?.trim(),
      categoryId: formData.get("categoryId"),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.title?.[0] ??
        flat.content?.[0] ??
        flat.categoryId?.[0] ??
        "Please fix the errors";
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
          image={imagePreview}
          statusLabel="News"
          statusColor="bg-blue-100 text-blue-700"
          fields={[
            { label: "Category", value: previewCategory },
            { label: "Status", value: previewStatus },
            { label: "Slug", value: slug },
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {isEdit && news && <input type="hidden" name="id" value={news.id} />}

        {state?.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        {/* ──────────── Group 1: Headlines ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Headlines
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
                defaultValue={news?.title ?? ""}
                onChange={handleTitleChange}
              />
              {state?.fieldErrors?.title && (
                <p className="mt-1 text-sm text-destructive">
                  {state.fieldErrors.title}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="titleTamil"
                className="mb-1 block text-sm font-medium"
              >
                Title (Tamil)
              </label>
              <Input
                id="titleTamil"
                name="titleTamil"
                defaultValue={news?.titleTamil ?? ""}
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
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-generated from English title. Use lowercase letters, numbers,
              and hyphens.
            </p>
            {state?.fieldErrors?.slug && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.slug}
              </p>
            )}
          </div>
        </fieldset>

        {/* ──────────── Group 2: Media & Classification ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Media &amp; Classification
          </legend>

          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium">
              Image
            </label>
            <ImageUpload
              module="news"
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url);
                setImagePreview(url);
              }}
              onRemove={() => {
                setImageUrl("");
                setImagePreview("");
              }}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="categoryId"
                className="mb-1 block text-sm font-medium"
              >
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={
                  isEdit && news
                    ? categories.find((c) => c.name === news.category)?.id ?? ""
                    : ""
                }
                onChange={handleCategoryChange}
                className={selectCls}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {state?.fieldErrors?.categoryId && (
                <p className="mt-1 text-sm text-destructive">
                  {state.fieldErrors.categoryId}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={news?.status ?? "draft"}
                onChange={(e) => setPreviewStatus(e.target.value)}
                className={selectCls}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* ──────────── Group 3: Content ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Content
          </legend>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium"
            >
              Content (English) *
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              required
              defaultValue={news?.content ?? ""}
              className={textareaCls}
              placeholder="Write the full article content..."
            />
            {state?.fieldErrors?.content && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.content}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contentTamil"
              className="mb-1 block text-sm font-medium"
            >
              Content (Tamil)
            </label>
            <textarea
              id="contentTamil"
              name="contentTamil"
              rows={6}
              defaultValue={news?.contentTamil ?? ""}
              className={textareaCls}
              placeholder="முழு செய்தி உள்ளடக்கம் (தமிழ்)..."
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-1 block text-sm font-medium"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={news?.excerpt ?? ""}
              className={textareaCls}
              placeholder="A short summary shown on cards and previews..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Brief summary displayed on news cards. If empty, content will be auto-truncated.
            </p>
          </div>
        </fieldset>

        {/* ──────────── Group 4: Settings ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Settings
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="whatsappLink"
                className="mb-1 block text-sm font-medium"
              >
                WhatsApp Link
              </label>
              <Input
                id="whatsappLink"
                name="whatsappLink"
                type="url"
                defaultValue={news?.whatsappLink ?? ""}
                placeholder="https://chat.whatsapp.com/..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Link for WhatsApp share button on the article.
              </p>
            </div>
            <div>
              <label
                htmlFor="referenceUrl"
                className="mb-1 block text-sm font-medium"
              >
                Reference URL
              </label>
              <Input
                id="referenceUrl"
                name="referenceUrl"
                type="url"
                defaultValue={news?.referenceUrl ?? ""}
                placeholder="https://..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                External source or reference link for the article.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium">
              Tags
            </label>
            <Input
              id="tags"
              name="tags"
              defaultValue={news?.tags ?? ""}
              placeholder="politics, education, health (comma-separated)"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated tags for filtering and SEO.
            </p>
          </div>
        </fieldset>

        {/* ──────────── Actions ──────────── */}
        <div className="flex gap-3 pt-4">
          <Button type="submit">
            {isEdit ? "Update News" : "Create News"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/news">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
