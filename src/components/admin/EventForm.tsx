"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createEvent, updateEvent } from "@/app/admin/events/actions";
import type { CreateEventState, UpdateEventState } from "@/app/admin/events/actions";
import { uploadImage } from "@/lib/uploadImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState(event?.title ?? "");
  const [previewTitleTamil, setPreviewTitleTamil] = useState(event?.titleTamil ?? "");

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
      const url = await uploadImage(file, "kilpennathur_data", "event-images");
      setImageUrl(url);
      setUploadError("");
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImageUrl(event?.image ?? "");
    } finally {
      setUploading(false);
    }
  };

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
          {uploading && (
            <p className="mt-1 text-sm text-muted-foreground">Uploading image...</p>
          )}
          {uploadError && (
            <p className="mt-1 text-sm text-destructive">{uploadError}</p>
          )}
          {imagePreview && !uploadError && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-32 w-auto rounded-md border border-border object-cover"
            />
          )}
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
