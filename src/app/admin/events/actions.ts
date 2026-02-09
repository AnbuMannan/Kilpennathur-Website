"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { deleteImageByUrl } from "@/lib/supabaseServer";

export type CreateEventState = {
  error?: string;
  fieldErrors?: { title?: string; date?: string };
};

export async function createEvent(
  _prevState: CreateEventState | null,
  formData: FormData
): Promise<CreateEventState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const dateRaw = (formData.get("date") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  const fieldErrors: CreateEventState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!dateRaw) fieldErrors.date = "Date is required";
  else {
    const date = new Date(dateRaw);
    if (Number.isNaN(date.getTime())) fieldErrors.date = "Invalid date";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to create an event." };
  }

  const eventDate = new Date(dateRaw!);

  try {
    await prisma.event.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        description: description || undefined,
        date: eventDate,
        image: imageUrl || undefined,
      },
    });
  } catch (err) {
    console.error("createEvent error:", err);
    return { error: "Failed to create event. Please try again." };
  }

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export type UpdateEventState = {
  error?: string;
  fieldErrors?: { title?: string; date?: string };
};

export async function updateEvent(
  _prevState: UpdateEventState | null,
  formData: FormData
): Promise<UpdateEventState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Event ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const dateRaw = (formData.get("date") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  const fieldErrors: UpdateEventState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!dateRaw) fieldErrors.date = "Date is required";
  else {
    const date = new Date(dateRaw);
    if (Number.isNaN(date.getTime())) fieldErrors.date = "Invalid date";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to update an event." };
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Event not found." };
  }

  if (imageUrl && existing.image && imageUrl !== existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete old image from storage:", err);
    }
  }

  const eventDate = new Date(dateRaw!);

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || undefined,
        description: description || undefined,
        date: eventDate,
        image: imageUrl || undefined,
      },
    });
  } catch (err) {
    console.error("updateEvent error:", err);
    return { error: "Failed to update event. Please try again." };
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/edit/${id}`);
  redirect("/admin/events");
}

export async function deleteEvent(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to delete an event." };
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Event not found." };
  }

  if (existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete image from storage:", err);
    }
  }

  try {
    await prisma.event.delete({ where: { id } });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return { error: "Failed to delete event. Please try again." };
  }

  revalidatePath("/admin/events");
  return {};
}

export async function bulkDeleteEvents(ids: string[]): Promise<{ error?: string; count?: number }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }
  let count = 0;
  for (const id of ids) {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) continue;
    if (existing.image) {
      try {
        await deleteImageByUrl(existing.image);
      } catch {
        /* ignore */
      }
    }
    await prisma.event.delete({ where: { id } });
    count++;
  }
  revalidatePath("/admin/events");
  return { count };
}
