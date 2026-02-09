"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/* ---------- Types ---------- */

export type BusActionState = {
  error?: string;
  fieldErrors?: {
    route?: string;
    busType?: string;
    departureTime?: string;
  };
};

/* ---------- Create ---------- */

export async function createBusTiming(
  _prevState: BusActionState | null,
  formData: FormData,
): Promise<BusActionState> {
  const route = (formData.get("route") as string)?.trim();
  const routeTamil = (formData.get("routeTamil") as string)?.trim() || null;
  const busNumber = (formData.get("busNumber") as string)?.trim() || null;
  const busType = (formData.get("busType") as string)?.trim();
  const departureTime = (formData.get("departureTime") as string)?.trim();

  const fieldErrors: BusActionState["fieldErrors"] = {};
  if (!route) fieldErrors.route = "Route is required";
  if (!busType) fieldErrors.busType = "Bus type is required";
  if (!departureTime) fieldErrors.departureTime = "Departure time is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  try {
    await prisma.busTiming.create({
      data: {
        route,
        routeTamil: routeTamil || undefined,
        busNumber: busNumber || undefined,
        busType,
        departureTime,
      },
    });
  } catch (err) {
    console.error("createBusTiming error:", err);
    return { error: "Failed to create bus timing." };
  }

  revalidatePath("/admin/utilities/bus");
  revalidatePath("/bus-timings");
  redirect("/admin/utilities/bus");
}

/* ---------- Update ---------- */

export async function updateBusTiming(
  _prevState: BusActionState | null,
  formData: FormData,
): Promise<BusActionState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Bus timing ID is required." };

  const route = (formData.get("route") as string)?.trim();
  const routeTamil = (formData.get("routeTamil") as string)?.trim() || null;
  const busNumber = (formData.get("busNumber") as string)?.trim() || null;
  const busType = (formData.get("busType") as string)?.trim();
  const departureTime = (formData.get("departureTime") as string)?.trim();

  const fieldErrors: BusActionState["fieldErrors"] = {};
  if (!route) fieldErrors.route = "Route is required";
  if (!busType) fieldErrors.busType = "Bus type is required";
  if (!departureTime) fieldErrors.departureTime = "Departure time is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.busTiming.findUnique({ where: { id } });
  if (!existing) return { error: "Bus timing not found." };

  try {
    await prisma.busTiming.update({
      where: { id },
      data: {
        route,
        routeTamil: routeTamil || null,
        busNumber: busNumber || null,
        busType,
        departureTime,
      },
    });
  } catch (err) {
    console.error("updateBusTiming error:", err);
    return { error: "Failed to update bus timing." };
  }

  revalidatePath("/admin/utilities/bus");
  revalidatePath("/bus-timings");
  redirect("/admin/utilities/bus");
}

/* ---------- Delete ---------- */

export async function deleteBusTiming(
  id: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.busTiming.findUnique({ where: { id } });
  if (!existing) return { error: "Bus timing not found." };

  try {
    await prisma.busTiming.delete({ where: { id } });
  } catch (err) {
    console.error("deleteBusTiming error:", err);
    return { error: "Failed to delete bus timing." };
  }

  revalidatePath("/admin/utilities/bus");
  revalidatePath("/bus-timings");
  return {};
}
