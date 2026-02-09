"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/lib/utils";
import { deleteImageByUrl } from "@/lib/supabaseServer";

export type CreateNewsState = {
  error?: string;
  fieldErrors?: { title?: string; content?: string; categoryId?: string };
};

export async function createNews(
  _prevState: CreateNewsState | null,
  formData: FormData
): Promise<CreateNewsState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const isPublished = formData.get("isPublished") === "on";

  const fieldErrors: CreateNewsState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!content) fieldErrors.content = "Content is required";
  if (!categoryId) fieldErrors.categoryId = "Category is required";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { error: "You must be logged in to create news." };
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, type: "news" },
  });
  if (!category) {
    return { error: "Invalid category." };
  }

  let slug = generateSlug(title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  try {
    await prisma.news.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        slug,
        content,
        image: imageUrl || undefined,
        category: category.name,
        status: isPublished ? "published" : "draft",
        publishedAt: isPublished ? new Date() : null,
        authorId: userId,
      },
    });
  } catch (err) {
    console.error("createNews error:", err);
    return { error: "Failed to create news. Please try again." };
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export type UpdateNewsState = {
  error?: string;
  fieldErrors?: { title?: string; content?: string; categoryId?: string };
};

export async function updateNews(
  _prevState: UpdateNewsState | null,
  formData: FormData
): Promise<UpdateNewsState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "News ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const isPublished = formData.get("isPublished") === "on";

  const fieldErrors: UpdateNewsState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!content) fieldErrors.content = "Content is required";
  if (!categoryId) fieldErrors.categoryId = "Category is required";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { error: "You must be logged in to update news." };
  }

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) {
    return { error: "News not found." };
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, type: "news" },
  });
  if (!category) {
    return { error: "Invalid category." };
  }

  // If new image uploaded and we had an old image, delete old from storage
  if (imageUrl && existing.image && imageUrl !== existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete old image from storage:", err);
    }
  }

  try {
    await prisma.news.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || undefined,
        content,
        image: imageUrl || undefined,
        category: category.name,
        status: isPublished ? "published" : "draft",
        publishedAt: isPublished ? (existing.publishedAt ?? new Date()) : null,
      },
    });
  } catch (err) {
    console.error("updateNews error:", err);
    return { error: "Failed to update news. Please try again." };
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}/edit`);
  revalidatePath("/news");
  revalidatePath(`/news/${existing.slug}`);
  redirect("/admin/news");
}

export async function deleteNews(id: string): Promise<{ error?: string }> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { error: "You must be logged in to delete news." };
  }

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) {
    return { error: "News not found." };
  }

  if (existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete image from storage:", err);
    }
  }

  try {
    await prisma.news.delete({ where: { id } });
  } catch (err) {
    console.error("deleteNews error:", err);
    return { error: "Failed to delete news. Please try again." };
  }

  revalidatePath("/admin/news");
  return {};
}

export async function bulkDeleteNews(ids: string[]): Promise<{ error?: string; count?: number }> {
  const session = await auth();
  if (!(session?.user as { id?: string })?.id) {
    return { error: "You must be logged in." };
  }
  let count = 0;
  for (const id of ids) {
    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) continue;
    if (existing.image) {
      try {
        await deleteImageByUrl(existing.image);
      } catch {
        /* ignore */
      }
    }
    await prisma.news.delete({ where: { id } });
    count++;
  }
  revalidatePath("/admin/news");
  return { count };
}

export async function bulkPublishNews(ids: string[], publish: boolean): Promise<{ error?: string; count?: number }> {
  const session = await auth();
  if (!(session?.user as { id?: string })?.id) {
    return { error: "You must be logged in." };
  }
  const result = await prisma.news.updateMany({
    where: { id: { in: ids } },
    data: {
      status: publish ? "published" : "draft",
      publishedAt: publish ? new Date() : null,
    },
  });
  revalidatePath("/admin/news");
  return { count: result.count };
}
