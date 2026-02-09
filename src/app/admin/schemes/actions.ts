"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/lib/utils";

/* ---------- Types ---------- */

export type SchemeActionState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    description?: string;
    sponsor?: string;
    beneficiaryType?: string;
    slug?: string;
  };
};

/* ---------- Create ---------- */

export async function createScheme(
  _prevState: SchemeActionState | null,
  formData: FormData,
): Promise<SchemeActionState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const descriptionTamil =
    (formData.get("descriptionTamil") as string)?.trim() || null;
  const sponsor = (formData.get("sponsor") as string)?.trim();
  const beneficiaryType = (formData.get("beneficiaryType") as string)?.trim();
  const applicationLink =
    (formData.get("applicationLink") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: SchemeActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!sponsor) fieldErrors.sponsor = "Sponsor is required";
  if (!beneficiaryType)
    fieldErrors.beneficiaryType = "Beneficiary type is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      fieldErrors: {
        slug: "Slug must be lowercase letters, numbers, and hyphens only",
      },
    };
  }

  const existing = await prisma.scheme.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  try {
    await prisma.scheme.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        slug,
        description,
        descriptionTamil: descriptionTamil || undefined,
        sponsor,
        beneficiaryType,
        applicationLink: applicationLink || undefined,
        status,
      },
    });
  } catch (err) {
    console.error("createScheme error:", err);
    return { error: "Failed to create scheme." };
  }

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  redirect("/admin/schemes");
}

/* ---------- Update ---------- */

export async function updateScheme(
  _prevState: SchemeActionState | null,
  formData: FormData,
): Promise<SchemeActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Scheme ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const descriptionTamil =
    (formData.get("descriptionTamil") as string)?.trim() || null;
  const sponsor = (formData.get("sponsor") as string)?.trim();
  const beneficiaryType = (formData.get("beneficiaryType") as string)?.trim();
  const applicationLink =
    (formData.get("applicationLink") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: SchemeActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!sponsor) fieldErrors.sponsor = "Sponsor is required";
  if (!beneficiaryType)
    fieldErrors.beneficiaryType = "Beneficiary type is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existingScheme = await prisma.scheme.findUnique({ where: { id } });
  if (!existingScheme) return { error: "Scheme not found." };

  if (!slug) slug = generateSlug(title);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      fieldErrors: {
        slug: "Slug must be lowercase letters, numbers, and hyphens only",
      },
    };
  }

  const slugConflict = await prisma.scheme.findFirst({
    where: { slug, id: { not: id } },
  });
  if (slugConflict) {
    return { fieldErrors: { slug: "This slug is already in use." } };
  }

  try {
    await prisma.scheme.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || null,
        slug,
        description,
        descriptionTamil: descriptionTamil || null,
        sponsor,
        beneficiaryType,
        applicationLink: applicationLink || null,
        status,
      },
    });
  } catch (err) {
    console.error("updateScheme error:", err);
    return { error: "Failed to update scheme." };
  }

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  redirect("/admin/schemes");
}

/* ---------- Delete ---------- */

export async function deleteScheme(
  id: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.scheme.findUnique({ where: { id } });
  if (!existing) return { error: "Scheme not found." };

  try {
    await prisma.scheme.delete({ where: { id } });
  } catch (err) {
    console.error("deleteScheme error:", err);
    return { error: "Failed to delete scheme." };
  }

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  return {};
}
