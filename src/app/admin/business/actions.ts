"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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
