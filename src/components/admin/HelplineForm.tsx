"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createHelpline, updateHelpline } from "@/app/admin/utilities/helplines/actions";
import type { HelplineActionState } from "@/app/admin/utilities/helplines/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const CATEGORIES = ["Emergency", "Medical", "EB", "Water", "Panchayat", "Fire", "Ambulance", "Other"];

/* ---------- Zod schema ---------- */

const helplineSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  number: z.string().min(1, "Phone number is required").trim(),
  category: z.string().min(1, "Category is required"),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/* ---------- Types ---------- */

export type HelplineForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  number: string;
  category: string;
};

type HelplineFormProps =
  | { mode: "create" }
  | { mode: "edit"; helpline: HelplineForEdit };

/* ---------- Component ---------- */

export function HelplineForm(props: HelplineFormProps) {
  const isEdit = props.mode === "edit";
  const helpline = isEdit ? props.helpline : null;

  const [state, formAction] = useActionState(
    isEdit ? updateHelpline : createHelpline,
    null as HelplineActionState | null,
  );

  const [previewTitle, setPreviewTitle] = useState(helpline?.title ?? "");
  const [previewNumber, setPreviewNumber] = useState(helpline?.number ?? "");
  const [previewCategory, setPreviewCategory] = useState(helpline?.category ?? "Emergency");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = helplineSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      number: (formData.get("number") as string)?.trim(),
      category: formData.get("category"),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.title?.[0] ??
        flat.number?.[0] ??
        flat.category?.[0] ??
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
          title={previewTitle || "Helpline"}
          statusLabel={previewCategory}
          statusColor="bg-red-100 text-red-700"
          fields={[
            { label: "Number", value: previewNumber },
            { label: "Category", value: previewCategory },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && helpline && (
        <input type="hidden" name="id" value={helpline.id} />
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Helpline Information ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Helpline Information
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
              defaultValue={helpline?.title ?? ""}
              placeholder="e.g., Police Station"
              onChange={(e) => setPreviewTitle(e.target.value)}
            />
            {state?.fieldErrors?.title && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.title}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="titleTamil" className="mb-1 block text-sm font-medium">
              Title (Tamil)
            </label>
            <Input
              id="titleTamil"
              name="titleTamil"
              defaultValue={helpline?.titleTamil ?? ""}
              placeholder="e.g., காவல் நிலையம்"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="number" className="mb-1 block text-sm font-medium">
              Phone Number *
            </label>
            <Input
              id="number"
              name="number"
              required
              defaultValue={helpline?.number ?? ""}
              placeholder="e.g., 100 or 04175-252525"
              onChange={(e) => setPreviewNumber(e.target.value)}
            />
            {state?.fieldErrors?.number && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.number}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={helpline?.category ?? "Emergency"}
              onChange={(e) => setPreviewCategory(e.target.value)}
              className={selectCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.category && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.category}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ──────────── Actions ──────────── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEdit ? "Update Helpline" : "Add Helpline"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/utilities/helplines">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
