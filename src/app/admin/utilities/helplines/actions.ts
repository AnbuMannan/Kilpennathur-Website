"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/* ---------- Types ---------- */

export type HelplineActionState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    number?: string;
    category?: string;
  };
};

/* ---------- Create ---------- */

export async function createHelpline(
  _prevState: HelplineActionState | null,
  formData: FormData,
): Promise<HelplineActionState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const number = (formData.get("number") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  const fieldErrors: HelplineActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!number) fieldErrors.number = "Phone number is required";
  if (!category) fieldErrors.category = "Category is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  try {
    await prisma.helpline.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        number,
        category,
      },
    });
  } catch (err) {
    console.error("createHelpline error:", err);
    return { error: "Failed to create helpline." };
  }

  revalidatePath("/admin/utilities/helplines");
  revalidatePath("/helplines");
  redirect("/admin/utilities/helplines");
}

/* ---------- Update ---------- */

export async function updateHelpline(
  _prevState: HelplineActionState | null,
  formData: FormData,
): Promise<HelplineActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Helpline ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const number = (formData.get("number") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  const fieldErrors: HelplineActionState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!number) fieldErrors.number = "Phone number is required";
  if (!category) fieldErrors.category = "Category is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.helpline.findUnique({ where: { id } });
  if (!existing) return { error: "Helpline not found." };

  try {
    await prisma.helpline.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || null,
        number,
        category,
      },
    });
  } catch (err) {
    console.error("updateHelpline error:", err);
    return { error: "Failed to update helpline." };
  }

  revalidatePath("/admin/utilities/helplines");
  revalidatePath("/helplines");
  redirect("/admin/utilities/helplines");
}

/* ---------- Delete ---------- */

export async function deleteHelpline(
  id: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.helpline.findUnique({ where: { id } });
  if (!existing) return { error: "Helpline not found." };

  try {
    await prisma.helpline.delete({ where: { id } });
  } catch (err) {
    console.error("deleteHelpline error:", err);
    return { error: "Failed to delete helpline." };
  }

  revalidatePath("/admin/utilities/helplines");
  revalidatePath("/helplines");
  return {};
}
