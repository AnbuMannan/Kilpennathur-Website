"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { deleteImageByUrl } from "@/lib/supabaseServer";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CreateJobState = {
  error?: string;
  fieldErrors?: { title?: string; description?: string; company?: string };
};

export async function createJob(
  _prevState: CreateJobState | null,
  formData: FormData
): Promise<CreateJobState> {
  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const companyTamil = (formData.get("companyTamil") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const locationTamil = (formData.get("locationTamil") as string)?.trim() || null;
  const jobType = (formData.get("jobType") as string)?.trim() || "full-time";
  const category = (formData.get("category") as string)?.trim() || "General";
  const salaryDescription = (formData.get("salaryDescription") as string)?.trim() || null;
  const contactEmail = (formData.get("contactEmail") as string)?.trim() || null;
  const contactPhone = (formData.get("contactPhone") as string)?.trim() || null;
  const applicationUrl = (formData.get("applicationUrl") as string)?.trim() || null;
  const applicationDeadlineRaw = (formData.get("applicationDeadline") as string)?.trim() || null;
  const experience = (formData.get("experience") as string)?.trim() || null;
  const qualifications = (formData.get("qualifications") as string)?.trim() || null;
  const benefits = (formData.get("benefits") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: CreateJobState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!company) fieldErrors.company = "Company is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const applicationDeadline = applicationDeadlineRaw
    ? new Date(applicationDeadlineRaw)
    : null;

  let slug = slugify(title);
  const existing = await prisma.job.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  try {
    await prisma.job.create({
      data: {
        title,
        titleTamil: titleTamil || undefined,
        description,
        company,
        companyTamil: companyTamil || undefined,
        location: location || undefined,
        locationTamil: locationTamil || undefined,
        jobType,
        category,
        salaryDescription: salaryDescription || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        applicationUrl: applicationUrl || undefined,
        applicationDeadline: applicationDeadline || undefined,
        experience: experience || undefined,
        qualifications: qualifications || undefined,
        benefits: benefits || undefined,
        image: imageUrl || undefined,
        slug,
        status,
        publishedAt: status === "published" ? new Date() : undefined,
      },
    });
  } catch (err) {
    console.error("createJob error:", err);
    return { error: "Failed to create job." };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export type UpdateJobState = CreateJobState;

export async function updateJob(
  _prevState: UpdateJobState | null,
  formData: FormData
): Promise<UpdateJobState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Job ID is required." };

  const title = (formData.get("title") as string)?.trim();
  const titleTamil = (formData.get("titleTamil") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const companyTamil = (formData.get("companyTamil") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const locationTamil = (formData.get("locationTamil") as string)?.trim() || null;
  const jobType = (formData.get("jobType") as string)?.trim() || "full-time";
  const category = (formData.get("category") as string)?.trim() || "General";
  const salaryDescription = (formData.get("salaryDescription") as string)?.trim() || null;
  const contactEmail = (formData.get("contactEmail") as string)?.trim() || null;
  const contactPhone = (formData.get("contactPhone") as string)?.trim() || null;
  const applicationUrl = (formData.get("applicationUrl") as string)?.trim() || null;
  const applicationDeadlineRaw = (formData.get("applicationDeadline") as string)?.trim() || null;
  const experience = (formData.get("experience") as string)?.trim() || null;
  const qualifications = (formData.get("qualifications") as string)?.trim() || null;
  const benefits = (formData.get("benefits") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "draft";

  const fieldErrors: UpdateJobState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!description) fieldErrors.description = "Description is required";
  if (!company) fieldErrors.company = "Company is required";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return { error: "Job not found." };

  if (imageUrl && existing.image && imageUrl !== existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }
  }

  const applicationDeadline = applicationDeadlineRaw
    ? new Date(applicationDeadlineRaw)
    : null;

  try {
    await prisma.job.update({
      where: { id },
      data: {
        title,
        titleTamil: titleTamil || undefined,
        description,
        company,
        companyTamil: companyTamil || undefined,
        location: location || undefined,
        locationTamil: locationTamil || undefined,
        jobType,
        category,
        salaryDescription: salaryDescription || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        applicationUrl: applicationUrl || undefined,
        applicationDeadline: applicationDeadline || undefined,
        experience: experience || undefined,
        qualifications: qualifications || undefined,
        benefits: benefits || undefined,
        image: imageUrl || undefined,
        status,
        publishedAt:
          status === "published"
            ? existing.publishedAt || new Date()
            : status === "draft"
              ? null
              : existing.publishedAt,
      },
    });
  } catch (err) {
    console.error("updateJob error:", err);
    return { error: "Failed to update job." };
  }

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/edit/${id}`);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  redirect("/admin/jobs");
}

export async function deleteJob(id: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in." };

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return { error: "Job not found." };

  if (existing.image) {
    try {
      await deleteImageByUrl(existing.image);
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  }

  try {
    await prisma.job.delete({ where: { id } });
  } catch (err) {
    console.error("deleteJob error:", err);
    return { error: "Failed to delete job." };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  return {};
}
