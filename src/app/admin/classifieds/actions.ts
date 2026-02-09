"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/lib/utils";

/* ---------- Types ---------- */

export type ClassifiedActionState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    description?: string;
    type?: string;
    category?: string;
    contactName?: string;
    contactPhone?: string;
    slug?: string;
  };
};

/* ---------- Create ---------- */

export async function createClassified(
  _prevState: ClassifiedActionState | null,
  formData: FormData,
): Promise<ClassifiedActionState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const descriptionTamil = (formData.get("descriptionTamil") as string)?.trim() || null;
  const type = (formData.get("type") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const priceLabel = (formData.get("priceLabel") as string)?.trim() || null;
  const contactName = (formData.get("contactName") as string)?.trim();
  const contactPhone = (formData.get("contactPhone") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const images = (formData.get("images") as string)?.trim() || "";
  const status = (formData.get("status") as string)?.trim() || "draft";
  const isFeatured = formData.get("isFeatured") === "on";

  const fieldErrors: ClassifiedActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!type) fieldErrors.type = "Type is required";
  if (!category) fieldErrors.category = "Category is required";
  if (!contactName) fieldErrors.contactName = "Contact name is required";
  if (!contactPhone) fieldErrors.contactPhone = "Contact phone is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  if (!slug) slug = generateSlug(title);
  const existing = await prisma.classified.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const price = priceRaw ? parseFloat(priceRaw) : null;

  try {
    await prisma.classified.create({
      data: {
        type,
        category,
        title,
        titleTamil: titleTamil || undefined,
        slug,
        description,
        descriptionTamil: descriptionTamil || undefined,
        price: price && !Number.isNaN(price) ? price : null,
        priceLabel: priceLabel || undefined,
        contactName,
        contactPhone,
        location: location || undefined,
        images,
        status,
        isFeatured,
      },
    });
  } catch (err) {
    console.error("createClassified error:", err);
    return { error: "Failed to create classified." };
  }

  revalidatePath("/admin/classifieds");
  revalidatePath("/classifieds");
  redirect("/admin/classifieds");
}

/* ---------- Update ---------- */

export async function updateClassified(
  _prevState: ClassifiedActionState | null,
  formData: FormData,
): Promise<ClassifiedActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const descriptionTamil = (formData.get("descriptionTamil") as string)?.trim() || null;
  const type = (formData.get("type") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const priceLabel = (formData.get("priceLabel") as string)?.trim() || null;
  const contactName = (formData.get("contactName") as string)?.trim();
  const contactPhone = (formData.get("contactPhone") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const images = (formData.get("images") as string)?.trim() || "";
  const status = (formData.get("status") as string)?.trim() || "draft";
  const isFeatured = formData.get("isFeatured") === "on";

  const fieldErrors: ClassifiedActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!type) fieldErrors.type = "Type is required";
  if (!category) fieldErrors.category = "Category is required";
  if (!contactName) fieldErrors.contactName = "Contact name is required";
  if (!contactPhone) fieldErrors.contactPhone = "Contact phone is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existingItem = await prisma.classified.findUnique({ where: { id } });
  if (!existingItem) return { error: "Classified not found." };

  if (!slug) slug = generateSlug(title);
  const slugConflict = await prisma.classified.findFirst({
    where: { slug, id: { not: id } },
  });
  if (slugConflict) return { fieldErrors: { slug: "This slug is already in use." } };

  const price = priceRaw ? parseFloat(priceRaw) : null;

  try {
    await prisma.classified.update({
      where: { id },
      data: {
        type,
        category,
        title,
        titleTamil: titleTamil || null,
        slug,
        description,
        descriptionTamil: descriptionTamil || null,
        price: price && !Number.isNaN(price) ? price : null,
        priceLabel: priceLabel || null,
        contactName,
        contactPhone,
        location: location || null,
        images,
        status,
        isFeatured,
      },
    });
  } catch (err) {
    console.error("updateClassified error:", err);
    return { error: "Failed to update classified." };
  }

  revalidatePath("/admin/classifieds");
  revalidatePath("/classifieds");
  redirect("/admin/classifieds");
}

/* ---------- Delete ---------- */

export async function deleteClassified(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.classified.findUnique({ where: { id } });
  if (!existing) return { error: "Classified not found." };

  try {
    await prisma.classified.delete({ where: { id } });
  } catch (err) {
    console.error("deleteClassified error:", err);
    return { error: "Failed to delete classified." };
  }

  revalidatePath("/admin/classifieds");
  revalidatePath("/classifieds");
  return {};
}
