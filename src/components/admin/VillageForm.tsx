"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createVillage, updateVillage } from "@/app/admin/villages/actions";
import type { CreateVillageState, UpdateVillageState } from "@/app/admin/villages/actions";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
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
    await formAction(state, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {isEdit && village && (
        <input type="hidden" name="id" value={village.id} />
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

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
          className="w-full"
        />
        {state?.fieldErrors?.nameTamil && (
          <p className="mt-1 text-sm text-destructive">
            {state.fieldErrors.nameTamil}
          </p>
        )}
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

      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEdit ? "Update Village" : "Create Village"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/villages">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
