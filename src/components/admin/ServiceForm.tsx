"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createService, updateService } from "@/app/admin/services/actions";
import type { ServiceActionState } from "@/app/admin/services/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Zod ---------- */

const serviceSchema = z.object({
  title: z.string().min(1, "Title (English) is required").trim(),
  titleTamil: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

/* ---------- Helpers ---------- */

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

export type ServiceForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
};

type ServiceFormProps =
  | { mode: "create" }
  | { mode: "edit"; service: ServiceForEdit };

/* ---------- Component ---------- */

export function ServiceForm(props: ServiceFormProps) {
  const isEdit = props.mode === "edit";
  const svc = isEdit ? props.service : null;

  const [state, formAction] = useActionState(
    isEdit ? updateService : createService,
    null as ServiceActionState | null,
  );

  const [slug, setSlug] = useState(svc?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(svc?.title ?? "");
  const [previewTitleTamil, setPreviewTitleTamil] = useState(svc?.titleTamil ?? "");
  const [previewIcon, setPreviewIcon] = useState(svc?.icon ?? "");

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

    const result = serviceSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      titleTamil: (formData.get("titleTamil") as string)?.trim(),
      slug: slugVal,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg = flat.title?.[0] ?? flat.slug?.[0] ?? "Please fix the errors";
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
          subtitle={previewTitleTamil}
          statusLabel="Service"
          statusColor="bg-indigo-100 text-indigo-700"
          fields={[
            { label: "Icon", value: previewIcon || "—" },
            { label: "Slug", value: slug },
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {isEdit && svc && <input type="hidden" name="id" value={svc.id} />}

        {state?.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        {/* ──────────── Service Identity ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Service Identity
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
                defaultValue={svc?.title ?? ""}
                onChange={handleTitleChange}
                placeholder="e.g. Life Insurance"
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
                defaultValue={svc?.titleTamil ?? ""}
                placeholder="ஆயுள் காப்பீடு"
                onChange={(e) => setPreviewTitleTamil(e.target.value)}
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
              Auto-generated from English title. Use lowercase letters, numbers, and hyphens.
            </p>
            {state?.fieldErrors?.slug && (
              <p className="mt-1 text-sm text-destructive">{state.fieldErrors.slug}</p>
            )}
          </div>
        </fieldset>

        {/* ──────────── Details ──────────── */}
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-semibold text-foreground">
            Details
          </legend>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={svc?.description ?? ""}
              className={textareaCls}
              placeholder="Short introduction for this service category..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="icon" className="mb-1 block text-sm font-medium">
                Icon
              </label>
              <Input
                id="icon"
                name="icon"
                defaultValue={svc?.icon ?? ""}
                placeholder="Lucide icon name (e.g. Shield, FileText)"
                onChange={(e) => setPreviewIcon(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Lucide icon name or an image URL.
              </p>
            </div>
            <div>
              <label htmlFor="order" className="mb-1 block text-sm font-medium">
                Display Order
              </label>
              <Input
                id="order"
                name="order"
                type="number"
                min={0}
                defaultValue={svc?.order ?? 0}
                placeholder="0"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Lower numbers appear first in the menu.
              </p>
            </div>
          </div>
        </fieldset>

        {/* ──────────── Actions ──────────── */}
        <div className="flex gap-3 pt-4">
          <Button type="submit">
            {isEdit ? "Update Service" : "Create Service"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/services">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
