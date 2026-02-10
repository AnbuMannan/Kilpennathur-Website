"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createJob, updateJob } from "@/app/admin/jobs/actions";
import type { CreateJobState, UpdateJobState } from "@/app/admin/jobs/actions";
import { uploadImage } from "@/lib/uploadImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "temporary",
];

const CATEGORIES = [
  "Education",
  "Healthcare",
  "Government",
  "Retail",
  "IT",
  "Banking",
  "Agriculture",
  "Manufacturing",
  "Driver",
  "Teacher",
  "General",
];

/* ---------- Zod schema ---------- */

const jobSchema = z.object({
  title: z.string().min(1, "Title (English) is required").trim(),
  titleTamil: z.string().optional(),
  company: z.string().min(1, "Company is required").trim(),
  companyTamil: z.string().optional(),
  description: z.string().min(1, "Description is required").trim(),
  jobType: z.string().min(1, "Job type is required"),
  category: z.string().min(1, "Category is required"),
});

/* ---------- Helpers ---------- */

function toDateLocal(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Types ---------- */

export type JobForEdit = {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string;
  company: string;
  companyTamil: string | null;
  location: string | null;
  locationTamil: string | null;
  jobType: string;
  category: string;
  salaryDescription: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  applicationUrl: string | null;
  applicationDeadline: Date | null;
  experience: string | null;
  qualifications: string | null;
  benefits: string | null;
  image: string | null;
  status: string;
};

type JobFormProps = { mode: "create" } | { mode: "edit"; job: JobForEdit };

/* ---------- Component ---------- */

export function JobForm(props: JobFormProps) {
  const isEdit = props.mode === "edit";
  const job = isEdit ? props.job : null;

  const [state, formAction] = useActionState(
    isEdit ? updateJob : createJob,
    null as CreateJobState | UpdateJobState | null,
  );

  const [imagePreview, setImagePreview] = useState<string>(job?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(job?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState(job?.title ?? "");
  const [previewCompany, setPreviewCompany] = useState(job?.company ?? "");
  const [previewJobType, setPreviewJobType] = useState(job?.jobType ?? "full-time");
  const [previewStatus, setPreviewStatus] = useState(job?.status ?? "draft");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  /* Image upload handler */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, "kilpennathur_data", "job-images");
      setImageUrl(url);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image",
      );
      setImageUrl(job?.image ?? "");
    } finally {
      setUploading(false);
    }
  };

  /* Submit with client-side validation */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = jobSchema.safeParse({
      title: (formData.get("title") as string)?.trim(),
      titleTamil: (formData.get("titleTamil") as string)?.trim(),
      company: (formData.get("company") as string)?.trim(),
      companyTamil: (formData.get("companyTamil") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      jobType: formData.get("jobType"),
      category: formData.get("category"),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.title?.[0] ??
        flat.company?.[0] ??
        flat.description?.[0] ??
        flat.jobType?.[0] ??
        flat.category?.[0] ??
        "Please fix the errors";
      toast.error(msg);
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <AdminFormLayout
      preview={
        <FormPreviewCard
          title={previewTitle}
          subtitle={previewCompany}
          image={imagePreview}
          statusLabel={previewStatus}
          statusColor={previewStatus === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
          fields={[
            { label: "Type", value: previewJobType },
            { label: "Company", value: previewCompany },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && job && <input type="hidden" name="id" value={job.id} />}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Group 1: Basic Info ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Basic Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title (English) *
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={job?.title ?? ""}
              onChange={(e) => setPreviewTitle(e.target.value)}
            />
            {state?.fieldErrors?.title && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.title}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="titleTamil"
              className="mb-1 block text-sm font-medium"
            >
              Title (Tamil)
            </label>
            <Input
              id="titleTamil"
              name="titleTamil"
              defaultValue={job?.titleTamil ?? ""}
              placeholder="தமிழ் தலைப்பு"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-sm font-medium"
            >
              Company *
            </label>
            <Input
              id="company"
              name="company"
              required
              defaultValue={job?.company ?? ""}
              onChange={(e) => setPreviewCompany(e.target.value)}
            />
            {state?.fieldErrors?.company && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.company}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="companyTamil"
              className="mb-1 block text-sm font-medium"
            >
              Company (Tamil)
            </label>
            <Input
              id="companyTamil"
              name="companyTamil"
              defaultValue={job?.companyTamil ?? ""}
              placeholder="நிறுவனம் (தமிழ்)"
            />
          </div>
        </div>
      </fieldset>

      {/* ──────────── Group 2: Details ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Job Details
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="jobType"
              className="mb-1 block text-sm font-medium"
            >
              Job Type *
            </label>
            <select
              id="jobType"
              name="jobType"
              defaultValue={job?.jobType ?? "full-time"}
              onChange={(e) => setPreviewJobType(e.target.value)}
              className={selectCls}
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              defaultValue={job?.category ?? "General"}
              className={selectCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium"
            >
              Location (English)
            </label>
            <Input
              id="location"
              name="location"
              defaultValue={job?.location ?? ""}
              placeholder="e.g. Kilpennathur, Tiruvannamalai"
            />
          </div>
          <div>
            <label
              htmlFor="locationTamil"
              className="mb-1 block text-sm font-medium"
            >
              Location (Tamil)
            </label>
            <Input
              id="locationTamil"
              name="locationTamil"
              defaultValue={job?.locationTamil ?? ""}
              placeholder="e.g. கீழ்பென்னாத்தூர்"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="salaryDescription"
              className="mb-1 block text-sm font-medium"
            >
              Salary
            </label>
            <Input
              id="salaryDescription"
              name="salaryDescription"
              placeholder="e.g. ₹15,000 - ₹25,000 or As per industry standards"
              defaultValue={job?.salaryDescription ?? ""}
            />
          </div>
          <div>
            <label
              htmlFor="experience"
              className="mb-1 block text-sm font-medium"
            >
              Experience
            </label>
            <Input
              id="experience"
              name="experience"
              placeholder="e.g. 1-3 years, Fresher"
              defaultValue={job?.experience ?? ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={job?.status ?? "draft"}
              onChange={(e) => setPreviewStatus(e.target.value)}
              className={selectCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium">
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
            />
            {uploading && (
              <p className="mt-1 text-sm text-muted-foreground">
                Uploading...
              </p>
            )}
            {uploadError && (
              <p className="mt-1 text-sm text-destructive">{uploadError}</p>
            )}
            {imagePreview && !uploadError && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-md border object-cover"
              />
            )}
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>
        </div>
      </fieldset>

      {/* ──────────── Group 3: Description ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Description &amp; Requirements
        </legend>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            defaultValue={job?.description ?? ""}
            className={textareaCls}
            placeholder="Describe the role, responsibilities, and expectations..."
          />
          {state?.fieldErrors?.description && (
            <p className="mt-1 text-sm text-destructive">
              {state.fieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="qualifications"
            className="mb-1 block text-sm font-medium"
          >
            Qualifications
          </label>
          <textarea
            id="qualifications"
            name="qualifications"
            rows={4}
            defaultValue={job?.qualifications ?? ""}
            className={textareaCls}
            placeholder="Required qualifications and skills..."
          />
        </div>

        <div>
          <label
            htmlFor="benefits"
            className="mb-1 block text-sm font-medium"
          >
            Benefits
          </label>
          <textarea
            id="benefits"
            name="benefits"
            rows={3}
            defaultValue={job?.benefits ?? ""}
            className={textareaCls}
            placeholder="Perks, benefits, and facilities..."
          />
        </div>
      </fieldset>

      {/* ──────────── Group 4: Contact & Application ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Contact &amp; Application
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contactPhone"
              className="mb-1 block text-sm font-medium"
            >
              Contact Phone
            </label>
            <Input
              id="contactPhone"
              name="contactPhone"
              defaultValue={job?.contactPhone ?? ""}
              placeholder="+91 ..."
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="mb-1 block text-sm font-medium"
            >
              Contact Email
            </label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={job?.contactEmail ?? ""}
              placeholder="hr@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicationUrl"
              className="mb-1 block text-sm font-medium"
            >
              Application URL
            </label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              placeholder="https://..."
              defaultValue={job?.applicationUrl ?? ""}
            />
          </div>
          <div>
            <label
              htmlFor="applicationDeadline"
              className="mb-1 block text-sm font-medium"
            >
              Application Deadline
            </label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              defaultValue={
                job?.applicationDeadline
                  ? toDateLocal(job.applicationDeadline)
                  : ""
              }
            />
          </div>
        </div>
      </fieldset>

      {/* ──────────── Actions ──────────── */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={uploading}>
          {isEdit ? "Update Job" : "Create Job"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/jobs">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
