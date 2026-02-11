"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createEvent, updateEvent } from "@/app/admin/events/actions";
import type { CreateEventState, UpdateEventState } from "@/app/admin/events/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/** Format Date for datetime-local input (YYYY-MM-DDTHH:mm) */
function toDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

export type EventForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  date: Date;
  image: string | null;
};

type EventFormProps =
  | { mode: "create" }
  | { mode: "edit"; event: EventForEdit };

export function EventForm(props: EventFormProps) {
  const isEdit = props.mode === "edit";
  const event = isEdit ? props.event : null;

  const [state, formAction] = useActionState(
    isEdit ? updateEvent : createEvent,
    null as CreateEventState | UpdateEventState | null
  );

  const [imagePreview, setImagePreview] = useState<string>(event?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(event?.image ?? "");
  const [previewTitle, setPreviewTitle] = useState(event?.title ?? "");
  const [previewTitleTamil, setPreviewTitleTamil] = useState(event?.titleTamil ?? "");

  const defaultDate = event?.date
    ? toDateTimeLocal(new Date(event.date))
    : "";

  return (
    <AdminFormLayout
      preview={
        <FormPreviewCard
          title={previewTitle}
          subtitle={previewTitleTamil}
          image={imagePreview}
          statusLabel="Event"
          statusColor="bg-pink-100 text-pink-700"
        />
      }
    >
    <form action={formAction} className="max-w-3xl space-y-6">
      {isEdit && event && <input type="hidden" name="id" value={event.id} />}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Event Details ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Event Details
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title (English) *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={event?.title ?? ""}
              onChange={(e) => setPreviewTitle(e.target.value)}
              className="w-full"
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
              type="text"
              defaultValue={event?.titleTamil ?? ""}
              onChange={(e) => setPreviewTitleTamil(e.target.value)}
              className="w-full"
              placeholder="நிகழ்வு தலைப்பு (தமிழ்)"
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date &amp; Time *
          </label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            required
            defaultValue={defaultDate}
            className="w-full"
          />
          {state?.fieldErrors?.date && (
            <p className="mt-1 text-sm text-destructive">
              {state.fieldErrors.date}
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
            rows={4}
            defaultValue={event?.description ?? ""}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe the event, venue, activities..."
          />
        </div>
      </fieldset>

      {/* ──────────── Media ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Media
        </legend>

        <div>
          <ImageUpload
            module="events"
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
          {isEdit ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/events">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
