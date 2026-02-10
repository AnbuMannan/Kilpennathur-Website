"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteImageByUrl } from "@/lib/supabaseServer";

export type CreateBusinessState = {
  error?: string;
  fieldErrors?: { name?: string; categoryId?: string };
};

export async function createBusiness(
  _prevState: CreateBusinessState | null,
  formData: FormData
): Promise<CreateBusinessState> {
  const name = (formData.get("name") as string)?.trim();
  const nameTamil = (formData.get("nameTamil") as string)?.trim() || null;
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const whatsapp = (formData.get("whatsapp") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  const fieldErrors: CreateBusinessState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Name is required";
  if (!categoryId) fieldErrors.categoryId = "Category is required";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, type: "business" },
  });
  if (!category) {
    return { error: "Invalid category." };
  }

  try {
    await prisma.business.create({
      data: {
        name,
        nameTamil: nameTamil || undefined,
        category: category.name,
        address: address || undefined,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        website: website || undefined,
        description: description || undefined,
        image: imageUrl || undefined,
      },
    });
  } catch (err) {
    console.error("createBusiness error:", err);
    return { error: "Failed to create business. Please try again." };
  }

  revalidatePath("/admin/business");
  redirect("/admin/business");
}

export type UpdateBusinessState = {
  error?: string;
  fieldErrors?: { name?: string; categoryId?: string };
};

export async function updateBusiness(
  _prevState: UpdateBusinessState | null,
  formData: FormData
): Promise<UpdateBusinessState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Business ID is required." };

  const name = (formData.get("name") as string)?.trim();
  const nameTamil = (formData.get("nameTamil") as string)?.trim() || null;
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const whatsapp = (formData.get("whatsapp") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  const fieldErrors: UpdateBusinessState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Name is required";
  if (!categoryId) fieldErrors.categoryId = "Category is required";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const existing = await prisma.business.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Business not found." };
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, type: "business" },
  });
  if (!category) {
    return { error: "Invalid category." };
  }

  // If new image uploaded and old image existed, delete old from storage
  if (imageUrl && existing.image && imageUrl !== existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete old business image:", err);
    }
  }

  try {
    await prisma.business.update({
      where: { id },
      data: {
        name,
        nameTamil: nameTamil || undefined,
        category: category.name,
        address: address || undefined,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        website: website || undefined,
        description: description || undefined,
        image: imageUrl || undefined,
      },
    });
  } catch (err) {
    console.error("updateBusiness error:", err);
    return { error: "Failed to update business. Please try again." };
  }

  revalidatePath("/admin/business");
  revalidatePath(`/admin/business/${id}/edit`);
  redirect("/admin/business");
}
