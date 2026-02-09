"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import {
  createClassified,
  updateClassified,
} from "@/app/admin/classifieds/actions";
import type { ClassifiedActionState } from "@/app/admin/classifieds/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const TYPES = [
  { value: "real-estate", label: "Real Estate" },
  { value: "marketplace", label: "Marketplace" },
  { value: "service", label: "Service" },
];

const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  "real-estate": [
    "Land for Sale",
    "House for Sale",
    "House for Rent",
    "Plot for Sale",
    "Commercial Property",
    "Farm Land",
  ],
  marketplace: [
    "Bike",
    "Car",
    "Electronics",
    "Furniture",
    "Mobile Phone",
    "Agriculture Equipment",
    "Other",
  ],
  service: [
    "Plumbing",
    "Electrical",
    "Painting",
    "Catering",
    "Transport",
    "Tutoring",
    "Other",
  ],
};

/* ---------- Zod schema ---------- */

const classifiedSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  contactName: z.string().min(1, "Contact name is required").trim(),
  contactPhone: z.string().min(1, "Contact phone is required").trim(),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

export type ClassifiedForEdit = {
  id: string;
  type: string;
  category: string;
  title: string;
  titleTamil: string | null;
  slug: string;
  description: string;
  descriptionTamil: string | null;
  price: number | null;
  priceLabel: string | null;
  contactName: string;
  contactPhone: string;
  location: string | null;
  images: string;
  status: string;
  isFeatured: boolean;
};

type ClassifiedFormProps =
  | { mode: "create" }
  | { mode: "edit"; classified: ClassifiedForEdit };

/* ---------- Component ---------- */

export function ClassifiedForm(props: ClassifiedFormProps) {
  const isEdit = props.mode === "edit";
  const item = isEdit ? props.classified : null;

  const [state, formAction] = useActionState(
    isEdit ? updateClassified : createClassified,
    null as ClassifiedActionState | null,
  );

  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [selectedType, setSelectedType] = useState(
    item?.type ?? "real-estate",
  );
  const [previewTitle, setPreviewTitle] = useState(item?.title ?? "");
  const [previewPrice, setPreviewPrice] = useState(item?.price?.toString() ?? "");
  const [previewStatus, setPreviewStatus] = useState(item?.status ?? "draft");

  const categories = CATEGORIES_BY_TYPE[selectedType] ?? [];

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewTitle(e.target.value);
    if (!slugTouched) setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let slugVal = (formData.get("slug") as string)?.trim();
    if (!slugVal) {
      slugVal = generateSlug((formData.get("title") as string) ?? "");
      formData.set("slug", slugVal);
    }

    const result = classifiedSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      type: formData.get("type"),
      category: formData.get("category"),
      contactName: (formData.get("contactName") as string)?.trim(),
      contactPhone: (formData.get("contactPhone") as string)?.trim(),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.title?.[0] ??
        flat.description?.[0] ??
        flat.type?.[0] ??
        flat.category?.[0] ??
        flat.contactName?.[0] ??
        flat.contactPhone?.[0] ??
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
          subtitle={selectedType}
          statusLabel={previewStatus}
          statusColor={previewStatus === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
          fields={[
            { label: "Type", value: selectedType },
            { label: "Price", value: previewPrice ? `₹${Number(previewPrice).toLocaleString("en-IN")}` : "" },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && item && <input type="hidden" name="id" value={item.id} />}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──── Type & Category ──── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Classification
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="mb-1 block text-sm font-medium">
              Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={selectCls}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={item?.category ?? categories[0] ?? ""}
              className={selectCls}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* ──── Bilingual Info ──── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Listing Details
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
              defaultValue={item?.title ?? ""}
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
              defaultValue={item?.titleTamil ?? ""}
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
            className="font-mono text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description (English) *
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            defaultValue={item?.description ?? ""}
            className={textareaCls}
            placeholder="Describe the item, property, or service..."
          />
          {state?.fieldErrors?.description && (
            <p className="mt-1 text-sm text-destructive">
              {state.fieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="descriptionTamil"
            className="mb-1 block text-sm font-medium"
          >
            Description (Tamil)
          </label>
          <textarea
            id="descriptionTamil"
            name="descriptionTamil"
            rows={5}
            defaultValue={item?.descriptionTamil ?? ""}
            className={textareaCls}
            placeholder="விவரம் (தமிழ்)..."
          />
        </div>
      </fieldset>

      {/* ──── Pricing ──── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Pricing
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Price (₹)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              defaultValue={item?.price ?? ""}
              onChange={(e) => setPreviewPrice(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label
              htmlFor="priceLabel"
              className="mb-1 block text-sm font-medium"
            >
              Price Label
            </label>
            <Input
              id="priceLabel"
              name="priceLabel"
              defaultValue={item?.priceLabel ?? ""}
              placeholder="e.g. per cent, negotiable, per month, fixed"
            />
          </div>
        </div>
      </fieldset>

      {/* ──── Contact ──── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Contact Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="contactName"
              className="mb-1 block text-sm font-medium"
            >
              Contact Name *
            </label>
            <Input
              id="contactName"
              name="contactName"
              required
              defaultValue={item?.contactName ?? ""}
            />
            {state?.fieldErrors?.contactName && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.contactName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="contactPhone"
              className="mb-1 block text-sm font-medium"
            >
              Contact Phone *
            </label>
            <Input
              id="contactPhone"
              name="contactPhone"
              required
              defaultValue={item?.contactPhone ?? ""}
              placeholder="+91 ..."
            />
            {state?.fieldErrors?.contactPhone && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.contactPhone}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium"
            >
              Location
            </label>
            <Input
              id="location"
              name="location"
              defaultValue={item?.location ?? ""}
              placeholder="e.g. Kilpennathur"
            />
          </div>
        </div>
      </fieldset>

      {/* ──── Images & Status ──── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Media &amp; Status
        </legend>

        <div>
          <label htmlFor="images" className="mb-1 block text-sm font-medium">
            Image URLs
          </label>
          <textarea
            id="images"
            name="images"
            rows={2}
            defaultValue={item?.images ?? ""}
            className={textareaCls}
            placeholder="Paste image URLs, separated by commas"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Comma-separated image URLs. Upload via Media first, then paste
            URLs here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              defaultValue={item?.status ?? "draft"}
              onChange={(e) => setPreviewStatus(e.target.value)}
              className={selectCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={item?.isFeatured ?? false}
                className="rounded border-input"
              />
              Featured Listing
            </label>
          </div>
        </div>
      </fieldset>

      {/* ──── Actions ──── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEdit ? "Update Listing" : "Create Listing"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/classifieds">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
