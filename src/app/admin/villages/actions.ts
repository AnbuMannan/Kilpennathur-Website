"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/lib/utils";

export type CreateVillageState = {
  error?: string;
  fieldErrors?: { name?: string; nameTamil?: string; slug?: string };
};

export async function createVillage(
  _prevState: CreateVillageState | null,
  formData: FormData
): Promise<CreateVillageState> {
  const name = (formData.get("name") as string)?.trim();
  const nameTamil = (formData.get("nameTamil") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();

  const fieldErrors: CreateVillageState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Name (English) is required";
  if (!nameTamil) fieldErrors.nameTamil = "Name (Tamil) is required";
  if (!slug) slug = generateSlug(name);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fieldErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to create a village." };
  }

  const existing = await prisma.village.findUnique({ where: { slug } });
  if (existing) {
    return { fieldErrors: { slug: "This slug is already in use." } };
  }

  // Optional new fields
  const presidentName = (formData.get("presidentName") as string)?.trim() || null;
  const presidentNameTamil = (formData.get("presidentNameTamil") as string)?.trim() || null;
  const presidentImage = (formData.get("presidentImage") as string)?.trim() || null;
  const populationRaw = (formData.get("population") as string)?.trim();
  const totalStreetsRaw = (formData.get("totalStreets") as string)?.trim();
  const wardCountRaw = (formData.get("wardCount") as string)?.trim();
  const population = populationRaw ? parseInt(populationRaw, 10) : null;
  const totalStreets = totalStreetsRaw ? parseInt(totalStreetsRaw, 10) : null;
  const wardCount = wardCountRaw ? parseInt(wardCountRaw, 10) : null;

  try {
    await prisma.village.create({
      data: {
        name,
        nameTamil,
        slug,
        description: (formData.get("description") as string)?.trim() || undefined,
        presidentName,
        presidentNameTamil,
        presidentImage,
        population: Number.isNaN(population!) ? null : population,
        totalStreets: Number.isNaN(totalStreets!) ? null : totalStreets,
        wardCount: Number.isNaN(wardCount!) ? null : wardCount,
      },
    });
  } catch (err) {
    console.error("createVillage error:", err);
    return { error: "Failed to create village. Please try again." };
  }

  revalidatePath("/admin/villages");
  revalidatePath("/villages");
  redirect("/admin/villages");
}

export type UpdateVillageState = {
  error?: string;
  fieldErrors?: { name?: string; nameTamil?: string; slug?: string };
};

export async function updateVillage(
  _prevState: UpdateVillageState | null,
  formData: FormData
): Promise<UpdateVillageState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Village ID is required." };

  const name = (formData.get("name") as string)?.trim();
  const nameTamil = (formData.get("nameTamil") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();

  const fieldErrors: UpdateVillageState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Name (English) is required";
  if (!nameTamil) fieldErrors.nameTamil = "Name (Tamil) is required";
  if (!slug) slug = generateSlug(name);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fieldErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to update a village." };
  }

  const existing = await prisma.village.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Village not found." };
  }

  const slugConflict = await prisma.village.findFirst({
    where: { slug, id: { not: id } },
  });
  if (slugConflict) {
    return { fieldErrors: { slug: "This slug is already in use." } };
  }

  // Optional new fields
  const presidentName = (formData.get("presidentName") as string)?.trim() || null;
  const presidentNameTamil = (formData.get("presidentNameTamil") as string)?.trim() || null;
  const presidentImage = (formData.get("presidentImage") as string)?.trim() || null;
  const populationRaw = (formData.get("population") as string)?.trim();
  const totalStreetsRaw = (formData.get("totalStreets") as string)?.trim();
  const wardCountRaw = (formData.get("wardCount") as string)?.trim();
  const population = populationRaw ? parseInt(populationRaw, 10) : null;
  const totalStreets = totalStreetsRaw ? parseInt(totalStreetsRaw, 10) : null;
  const wardCount = wardCountRaw ? parseInt(wardCountRaw, 10) : null;

  try {
    await prisma.village.update({
      where: { id },
      data: {
        name,
        nameTamil,
        slug,
        description: (formData.get("description") as string)?.trim() || undefined,
        presidentName,
        presidentNameTamil,
        presidentImage,
        population: Number.isNaN(population!) ? null : population,
        totalStreets: Number.isNaN(totalStreets!) ? null : totalStreets,
        wardCount: Number.isNaN(wardCount!) ? null : wardCount,
      },
    });
  } catch (err) {
    console.error("updateVillage error:", err);
    return { error: "Failed to update village. Please try again." };
  }

  revalidatePath("/admin/villages");
  revalidatePath("/admin/villages/edit/" + id);
  revalidatePath("/villages");
  revalidatePath(`/villages/${existing.slug}`);
  redirect("/admin/villages");
}

export async function deleteVillage(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to delete a village." };
  }

  const existing = await prisma.village.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Village not found." };
  }

  try {
    await prisma.village.delete({ where: { id } });
  } catch (err) {
    console.error("deleteVillage error:", err);
    return { error: "Failed to delete village. Please try again." };
  }

  revalidatePath("/admin/villages");
  revalidatePath("/villages");
  return {};
}
