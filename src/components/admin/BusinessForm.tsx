"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createBusiness, updateBusiness } from "@/app/admin/business/actions";
import type {
  CreateBusinessState,
  UpdateBusinessState,
} from "@/app/admin/business/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Zod schema ---------- */

const businessSchema = z.object({
  name: z.string().min(1, "Name (English) is required").trim(),
  nameTamil: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

type Category = { id: string; name: string };

export type BusinessForEdit = {
  id: string;
  name: string;
  nameTamil: string | null;
  category: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  description: string | null;
  image: string | null;
  website: string | null;
};

type BusinessFormProps =
  | { mode: "create"; categories: Category[] }
  | { mode: "edit"; business: BusinessForEdit; categories: Category[] };

/* ---------- Component ---------- */

export function BusinessForm(props: BusinessFormProps) {
  const isEdit = props.mode === "edit";
  const biz = isEdit ? props.business : null;
  const { categories } = props;

  const [state, formAction] = useActionState(
    isEdit ? updateBusiness : createBusiness,
    null as CreateBusinessState | UpdateBusinessState | null,
  );

  /* Preview state */
  const [previewName, setPreviewName] = useState(biz?.name ?? "");
  const [previewCategory, setPreviewCategory] = useState(() => {
    if (!biz) return "";
    return categories.find((c) => c.name === biz.category)?.name ?? biz.category;
  });
  const [imagePreview, setImagePreview] = useState<string>(biz?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(biz?.image ?? "");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = categories.find((c) => c.id === e.target.value);
    setPreviewCategory(cat?.name ?? "");
  };

  /* Submit with client-side validation */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = businessSchema.safeParse({
      name: (formData.get("name") as string)?.trim(),
      nameTamil: (formData.get("nameTamil") as string)?.trim(),
      categoryId: formData.get("categoryId"),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.name?.[0] ?? flat.categoryId?.[0] ?? "Please fix the errors";
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
          title={previewName}
          subtitle={previewCategory}
          image={imagePreview}
          statusLabel="Business"
          statusColor="bg-violet-100 text-violet-700"
          fields={[
            { label: "Category", value: previewCategory },
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {isEdit && biz && <input type="hidden" name="id" value={biz.id} />}

        {state?.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        {/* ──────────── Group 1: Identity ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Identity
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name (English) *
              </label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={biz?.name ?? ""}
                onChange={(e) => setPreviewName(e.target.value)}
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1 text-sm text-destructive">
                  {state.fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="nameTamil"
                className="mb-1 block text-sm font-medium"
              >
                Name (Tamil)
              </label>
              <Input
                id="nameTamil"
                name="nameTamil"
                defaultValue={biz?.nameTamil ?? ""}
                placeholder="நிறுவன பெயர் (தமிழ்)"
              />
            </div>
          </div>

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
                isEdit && biz
                  ? categories.find((c) => c.name === biz.category)?.id ?? ""
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
        </fieldset>

        {/* ──────────── Group 2: Contact ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Contact Information
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium"
              >
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                defaultValue={biz?.phone ?? ""}
                placeholder="+91 ..."
              />
            </div>
            <div>
              <label
                htmlFor="whatsapp"
                className="mb-1 block text-sm font-medium"
              >
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                defaultValue={biz?.whatsapp ?? ""}
                placeholder="+91 ..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="website"
              className="mb-1 block text-sm font-medium"
            >
              Website
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={biz?.website ?? ""}
              placeholder="https://..."
            />
          </div>
        </fieldset>

        {/* ──────────── Group 3: Location ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Location
          </legend>

          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={biz?.address ?? ""}
              className={textareaCls}
              placeholder="Full business address..."
            />
          </div>
        </fieldset>

        {/* ──────────── Group 4: Details & Media ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Details &amp; Media
          </legend>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={biz?.description ?? ""}
              className={textareaCls}
              placeholder="Describe the business, services offered, specialties..."
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium">
              Business Cover/Logo
            </label>
            <ImageUpload
              module="business"
              label="Business Cover/Logo"
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
        </fieldset>

        {/* ──────────── Actions ──────────── */}
        <div className="flex gap-3 pt-4">
          <Button type="submit">
            {isEdit ? "Update Business" : "Create Business"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/business">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
