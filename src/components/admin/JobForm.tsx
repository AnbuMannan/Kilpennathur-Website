"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createJob, updateJob } from "@/app/admin/jobs/actions";
import type { CreateJobState, UpdateJobState } from "@/app/admin/jobs/actions";
import { uploadImage } from "@/lib/uploadImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  "General",
];

function toDateLocal(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

export function JobForm(props: JobFormProps) {
  const isEdit = props.mode === "edit";
  const job = isEdit ? props.job : null;

  const [state, formAction] = useActionState(
    isEdit ? updateJob : createJob,
    null as CreateJobState | UpdateJobState | null
  );

  const [imagePreview, setImagePreview] = useState<string>(job?.image ?? "");
  const [imageUrl, setImageUrl] = useState<string>(job?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

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
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImageUrl(job?.image ?? "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {isEdit && job && <input type="hidden" name="id" value={job.id} />}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title (English) *
        </label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={job?.title ?? ""}
        />
        {state?.fieldErrors?.title && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="titleTamil" className="mb-1 block text-sm font-medium">
          Title (Tamil)
        </label>
        <Input id="titleTamil" name="titleTamil" defaultValue={job?.titleTamil ?? ""} />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={job?.description ?? ""}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.description && (
          <p className="mt-1 text-sm text-destructive">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium">
          Company *
        </label>
        <Input id="company" name="company" required defaultValue={job?.company ?? ""} />
        {state?.fieldErrors?.company && (
          <p className="mt-1 text-sm text-destructive">{state.fieldErrors.company}</p>
        )}
      </div>

      <div>
        <label htmlFor="companyTamil" className="mb-1 block text-sm font-medium">
          Company (Tamil)
        </label>
        <Input
          id="companyTamil"
          name="companyTamil"
          defaultValue={job?.companyTamil ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <Input id="location" name="location" defaultValue={job?.location ?? ""} />
        </div>
        <div>
          <label htmlFor="jobType" className="mb-1 block text-sm font-medium">
            Job Type
          </label>
          <select
            id="jobType"
            name="jobType"
            defaultValue={job?.jobType ?? "full-time"}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={job?.category ?? "General"}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="salaryDescription" className="mb-1 block text-sm font-medium">
          Salary
        </label>
        <Input
          id="salaryDescription"
          name="salaryDescription"
          placeholder="e.g. As per industry standards or ₹15,000 - ₹25,000"
          defaultValue={job?.salaryDescription ?? ""}
        />
      </div>

      <div>
        <label htmlFor="applicationDeadline" className="mb-1 block text-sm font-medium">
          Application Deadline
        </label>
        <Input
          id="applicationDeadline"
          name="applicationDeadline"
          type="date"
          defaultValue={job?.applicationDeadline ? toDateLocal(job.applicationDeadline) : ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium">
            Contact Email
          </label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={job?.contactEmail ?? ""}
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium">
            Contact Phone
          </label>
          <Input
            id="contactPhone"
            name="contactPhone"
            defaultValue={job?.contactPhone ?? ""}
          />
        </div>
      </div>

      <div>
        <label htmlFor="applicationUrl" className="mb-1 block text-sm font-medium">
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
        <label htmlFor="experience" className="mb-1 block text-sm font-medium">
          Experience
        </label>
        <Input
          id="experience"
          name="experience"
          placeholder="e.g. 1-3 years, Fresher"
          defaultValue={job?.experience ?? ""}
        />
      </div>

      <div>
        <label htmlFor="qualifications" className="mb-1 block text-sm font-medium">
          Qualifications
        </label>
        <textarea
          id="qualifications"
          name="qualifications"
          rows={3}
          defaultValue={job?.qualifications ?? ""}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="benefits" className="mb-1 block text-sm font-medium">
          Benefits
        </label>
        <textarea
          id="benefits"
          name="benefits"
          rows={2}
          defaultValue={job?.benefits ?? ""}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={job?.status ?? "draft"}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          <p className="mt-1 text-sm text-muted-foreground">Uploading...</p>
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

      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEdit ? "Update Job" : "Create Job"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/jobs">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
