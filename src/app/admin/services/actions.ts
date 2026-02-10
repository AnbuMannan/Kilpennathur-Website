"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/lib/utils";
import { deleteImageByUrl } from "@/lib/supabaseServer";

/* =========================================================================
   Service CRUD
   ========================================================================= */

export type ServiceActionState = {
  error?: string;
  fieldErrors?: { title?: string; slug?: string };
};

export async function createService(
  _prev: ServiceActionState | null,
  formData: FormData,
): Promise<ServiceActionState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const icon = (formData.get("icon") as string)?.trim() || null;
  const order = parseInt((formData.get("order") as string) || "0", 10) || 0;

  const fieldErrors: ServiceActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { fieldErrors: { slug: "Slug must be lowercase letters, numbers, and hyphens only" } };
  }

  const existing = await prisma.service.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  try {
    await prisma.service.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        slug,
        description: description || undefined,
        icon: icon || undefined,
        order,
      },
    });
  } catch (err) {
    console.error("createService error:", err);
    return { error: "Failed to create service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function updateService(
  _prev: ServiceActionState | null,
  formData: FormData,
): Promise<ServiceActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Service ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const icon = (formData.get("icon") as string)?.trim() || null;
  const order = parseInt((formData.get("order") as string) || "0", 10) || 0;

  const fieldErrors: ServiceActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: "Service not found." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { fieldErrors: { slug: "Slug must be lowercase letters, numbers, and hyphens only" } };
  }

  const conflict = await prisma.service.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { fieldErrors: { slug: "This slug is already in use." } };

  try {
    await prisma.service.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || null,
        slug,
        description: description || null,
        icon: icon || null,
        order,
      },
    });
  } catch (err) {
    console.error("updateService error:", err);
    return { error: "Failed to update service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: "Service not found." };

  try {
    await prisma.service.delete({ where: { id } });
  } catch (err) {
    console.error("deleteService error:", err);
    return { error: "Failed to delete service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return {};
}

/* =========================================================================
   ServicePost CRUD
   ========================================================================= */

export type ServicePostActionState = {
  error?: string;
  fieldErrors?: { title?: string; content?: string; slug?: string };
};

export async function createServicePost(
  _prev: ServicePostActionState | null,
  formData: FormData,
): Promise<ServicePostActionState> {
  const serviceId = (formData.get("serviceId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const contentTamil = (formData.get("contentTamil") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: ServicePostActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!content) fieldErrors.content = "Content is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!serviceId) return { error: "Service ID is required." };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { fieldErrors: { slug: "Slug must be lowercase letters, numbers, and hyphens only" } };
  }

  const existingSlug = await prisma.servicePost.findUnique({ where: { slug } });
  if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`;

  const isPublished = status === "published";

  try {
    await prisma.servicePost.create({
      data: {
        serviceId,
        title,
        titleTamil: titleTamil || undefined,
        slug,
        content,
        contentTamil: contentTamil || undefined,
        image: imageUrl || undefined,
        status: isPublished ? "published" : "draft",
        publishedAt: isPublished ? new Date() : null,
      },
    });
  } catch (err) {
    console.error("createServicePost error:", err);
    return { error: "Failed to create post." };
  }

  revalidatePath(`/admin/services/${serviceId}/posts`);
  revalidatePath("/services");
  redirect(`/admin/services/${serviceId}/posts`);
}

export async function updateServicePost(
  _prev: ServicePostActionState | null,
  formData: FormData,
): Promise<ServicePostActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Post ID is required." };

  const serviceId = (formData.get("serviceId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const contentTamil = (formData.get("contentTamil") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: ServicePostActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!content) fieldErrors.content = "Content is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.servicePost.findUnique({ where: { id } });
  if (!existing) return { error: "Post not found." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { fieldErrors: { slug: "Slug must be lowercase letters, numbers, and hyphens only" } };
  }

  const conflict = await prisma.servicePost.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { fieldErrors: { slug: "This slug is already in use." } };

  // Clean up old image
  if (imageUrl && existing.image && imageUrl !== existing.image) {
    try { await deleteImageByUrl(existing.image); } catch { /* ignore */ }
  }

  const isPublished = status === "published";

  try {
    await prisma.servicePost.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || null,
        slug,
        content,
        contentTamil: contentTamil || null,
        image: imageUrl || null,
        status: isPublished ? "published" : "draft",
        publishedAt: isPublished ? (existing.publishedAt ?? new Date()) : null,
      },
    });
  } catch (err) {
    console.error("updateServicePost error:", err);
    return { error: "Failed to update post." };
  }

  const targetServiceId = serviceId || existing.serviceId;
  revalidatePath(`/admin/services/${targetServiceId}/posts`);
  revalidatePath("/services");
  redirect(`/admin/services/${targetServiceId}/posts`);
}

export async function deleteServicePost(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.servicePost.findUnique({ where: { id } });
  if (!existing) return { error: "Post not found." };

  if (existing.image) {
    try { await deleteImageByUrl(existing.image); } catch { /* ignore */ }
  }

  try {
    await prisma.servicePost.delete({ where: { id } });
  } catch (err) {
    console.error("deleteServicePost error:", err);
    return { error: "Failed to delete post." };
  }

  revalidatePath(`/admin/services/${existing.serviceId}/posts`);
  revalidatePath("/services");
  return {};
}
