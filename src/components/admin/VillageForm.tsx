"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createVillage, updateVillage } from "@/app/admin/villages/actions";
import type { CreateVillageState, UpdateVillageState } from "@/app/admin/villages/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

const villageSchema = z.object({
  name: z.string().min(1, "Name (English) is required").trim(),
  nameTamil: z.string().min(1, "Name (Tamil) is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
});

export type VillageForEdit = {
  id: string;
  name: string;
  nameTamil: string;
  slug: string;
  description: string | null;
  presidentName: string | null;
  presidentNameTamil: string | null;
  presidentImage: string | null;
  population: number | null;
  totalStreets: number | null;
  wardCount: number | null;
};

type VillageFormProps =
  | { mode: "create" }
  | { mode: "edit"; village: VillageForEdit };

export function VillageForm(props: VillageFormProps) {
  const isEdit = props.mode === "edit";
  const village = isEdit ? props.village : null;

  const [state, formAction] = useActionState(
    isEdit ? updateVillage : createVillage,
    null as CreateVillageState | UpdateVillageState | null
  );

  const [slug, setSlug] = useState(village?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewName, setPreviewName] = useState(village?.name ?? "");
  const [previewNameTamil, setPreviewNameTamil] = useState(village?.nameTamil ?? "");
  const [previewPopulation, setPreviewPopulation] = useState(village?.population?.toString() ?? "");
  const [previewPresident, setPreviewPresident] = useState(village?.presidentName ?? "");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPreviewName(name);
    if (!slugTouched) {
      setSlug(generateSlug(name));
    }
  };

  const handleSlugBlur = () => setSlugTouched(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    let slugVal = (formData.get("slug") as string)?.trim();
    if (!slugVal) {
      slugVal = generateSlug((formData.get("name") as string) ?? "");
      formData.set("slug", slugVal);
    }
    const result = villageSchema.safeParse({
      name: (formData.get("name") as string)?.trim(),
      nameTamil: (formData.get("nameTamil") as string)?.trim(),
      slug: slugVal,
      description: formData.get("description"),
    });
    if (!result.success) {
      const msg = result.error.flatten().fieldErrors?.slug?.[0]
        ?? result.error.flatten().fieldErrors?.name?.[0]
        ?? result.error.flatten().fieldErrors?.nameTamil?.[0]
        ?? "Please fix the errors";
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
          subtitle={previewNameTamil}
          statusLabel="Village"
          statusColor="bg-teal-100 text-teal-700"
          fields={[
            { label: "Population", value: previewPopulation },
            { label: "President", value: previewPresident },
            { label: "Slug", value: slug },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && village && (
        <input type="hidden" name="id" value={village.id} />
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Basic Information ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Basic Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name (English) *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={village?.name ?? ""}
              onChange={handleNameChange}
              className="w-full"
            />
            {state?.fieldErrors?.name && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="nameTamil" className="mb-1 block text-sm font-medium">
              Name (Tamil) *
            </label>
            <Input
              id="nameTamil"
              name="nameTamil"
              type="text"
              required
              defaultValue={village?.nameTamil ?? ""}
              onChange={(e) => setPreviewNameTamil(e.target.value)}
              className="w-full"
            />
            {state?.fieldErrors?.nameTamil && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.nameTamil}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={handleSlugBlur}
            placeholder="auto-generated-from-name"
            className="w-full font-mono text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Auto-generated from English name. Edit if needed. Use lowercase letters, numbers, and hyphens only.
          </p>
          {state?.fieldErrors?.slug && (
            <p className="mt-1 text-sm text-destructive">
              {state.fieldErrors.slug}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={village?.description ?? ""}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Optional village description..."
          />
        </div>
      </fieldset>

      {/* ──────────── President Information ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Village President / Panchayat Leader
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="presidentName" className="mb-1 block text-sm font-medium">
              President Name (English)
            </label>
            <Input
              id="presidentName"
              name="presidentName"
              type="text"
              defaultValue={village?.presidentName ?? ""}
              placeholder="e.g. Ramesh Kumar"
              onChange={(e) => setPreviewPresident(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="presidentNameTamil" className="mb-1 block text-sm font-medium">
              President Name (Tamil)
            </label>
            <Input
              id="presidentNameTamil"
              name="presidentNameTamil"
              type="text"
              defaultValue={village?.presidentNameTamil ?? ""}
              placeholder="e.g. ரமேஷ் குமார்"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="presidentImage" className="mb-1 block text-sm font-medium">
            President Photo URL
          </label>
          <Input
            id="presidentImage"
            name="presidentImage"
            type="url"
            defaultValue={village?.presidentImage ?? ""}
            placeholder="https://..."
            className="w-full"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Direct URL to the president&apos;s photo (upload via Media first).
          </p>
        </div>
      </fieldset>

      {/* Village Statistics */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Village Statistics
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="population" className="mb-1 block text-sm font-medium">
              Population
            </label>
            <Input
              id="population"
              name="population"
              type="number"
              min={0}
              defaultValue={village?.population ?? ""}
              placeholder="e.g. 5000"
              onChange={(e) => setPreviewPopulation(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="totalStreets" className="mb-1 block text-sm font-medium">
              Total Streets
            </label>
            <Input
              id="totalStreets"
              name="totalStreets"
              type="number"
              min={0}
              defaultValue={village?.totalStreets ?? ""}
              placeholder="e.g. 12"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="wardCount" className="mb-1 block text-sm font-medium">
              Ward Count
            </label>
            <Input
              id="wardCount"
              name="wardCount"
              type="number"
              min={0}
              defaultValue={village?.wardCount ?? ""}
              placeholder="e.g. 4"
              className="w-full"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3 pt-4">
        <Button type="submit">
          {isEdit ? "Update Village" : "Create Village"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/villages">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
