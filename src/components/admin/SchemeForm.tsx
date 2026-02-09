"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createScheme, updateScheme } from "@/app/admin/schemes/actions";
import type { SchemeActionState } from "@/app/admin/schemes/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const SPONSORS = ["Central Govt", "State Govt", "District", "Other"];

const BENEFICIARY_TYPES = [
  "Farmers",
  "Students",
  "Women",
  "Senior Citizens",
  "SC/ST",
  "BPL Families",
  "Differently Abled",
  "General",
];

/* ---------- Zod schema ---------- */

const schemeSchema = z.object({
  title: z.string().min(1, "Title (English) is required").trim(),
  titleTamil: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  description: z.string().min(1, "Description is required").trim(),
  sponsor: z.string().min(1, "Sponsor is required"),
  beneficiaryType: z.string().min(1, "Beneficiary type is required"),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

export type SchemeForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  slug: string;
  description: string;
  descriptionTamil: string | null;
  sponsor: string;
  beneficiaryType: string;
  applicationLink: string | null;
  status: string;
};

type SchemeFormProps =
  | { mode: "create" }
  | { mode: "edit"; scheme: SchemeForEdit };

/* ---------- Component ---------- */

export function SchemeForm(props: SchemeFormProps) {
  const isEdit = props.mode === "edit";
  const scheme = isEdit ? props.scheme : null;

  const [state, formAction] = useActionState(
    isEdit ? updateScheme : createScheme,
    null as SchemeActionState | null,
  );

  const [slug, setSlug] = useState(scheme?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(scheme?.title ?? "");
  const [previewTitleTamil, setPreviewTitleTamil] = useState(scheme?.titleTamil ?? "");
  const [previewSponsor, setPreviewSponsor] = useState(scheme?.sponsor ?? "State Govt");
  const [previewStatus, setPreviewStatus] = useState(scheme?.status ?? "draft");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewTitle(e.target.value);
    if (!slugTouched) {
      setSlug(generateSlug(e.target.value));
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

    const result = schemeSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      titleTamil: (formData.get("titleTamil") as string)?.trim(),
      slug: slugVal,
      description: (formData.get("description") as string)?.trim(),
      sponsor: formData.get("sponsor"),
      beneficiaryType: formData.get("beneficiaryType"),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.title?.[0] ??
        flat.description?.[0] ??
        flat.sponsor?.[0] ??
        flat.beneficiaryType?.[0] ??
        flat.slug?.[0] ??
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
          subtitle={previewTitleTamil}
          statusLabel={previewStatus}
          statusColor={previewStatus === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
          fields={[
            { label: "Sponsor", value: previewSponsor },
            { label: "Slug", value: slug },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && scheme && (
        <input type="hidden" name="id" value={scheme.id} />
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Basic Info ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Scheme Information
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
              defaultValue={scheme?.title ?? ""}
              onChange={handleNameChange}
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
              defaultValue={scheme?.titleTamil ?? ""}
              placeholder="தமிழ் தலைப்பு"
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
            Auto-generated from English title. Use lowercase letters, numbers,
            and hyphens.
          </p>
          {state?.fieldErrors?.slug && (
            <p className="mt-1 text-sm text-destructive">
              {state.fieldErrors.slug}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sponsor"
              className="mb-1 block text-sm font-medium"
            >
              Sponsor *
            </label>
            <select
              id="sponsor"
              name="sponsor"
              required
              defaultValue={scheme?.sponsor ?? "State Govt"}
              onChange={(e) => setPreviewSponsor(e.target.value)}
              className={selectCls}
            >
              {SPONSORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.sponsor && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.sponsor}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="beneficiaryType"
              className="mb-1 block text-sm font-medium"
            >
              Beneficiary Type *
            </label>
            <select
              id="beneficiaryType"
              name="beneficiaryType"
              required
              defaultValue={scheme?.beneficiaryType ?? "General"}
              className={selectCls}
            >
              {BENEFICIARY_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.beneficiaryType && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.beneficiaryType}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicationLink"
              className="mb-1 block text-sm font-medium"
            >
              Application Link
            </label>
            <Input
              id="applicationLink"
              name="applicationLink"
              type="url"
              placeholder="https://..."
              defaultValue={scheme?.applicationLink ?? ""}
            />
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
              defaultValue={scheme?.status ?? "draft"}
              onChange={(e) => setPreviewStatus(e.target.value)}
              className={selectCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* ──────────── Descriptions ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Description
        </legend>

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
            rows={6}
            required
            defaultValue={scheme?.description ?? ""}
            className={textareaCls}
            placeholder="Describe the scheme, eligibility, benefits..."
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
            rows={6}
            defaultValue={scheme?.descriptionTamil ?? ""}
            className={textareaCls}
            placeholder="திட்டத்தின் விவரம் (தமிழ்)..."
          />
        </div>
      </fieldset>

      {/* ──────────── Actions ──────────── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEdit ? "Update Scheme" : "Create Scheme"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/schemes">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
