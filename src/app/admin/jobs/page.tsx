import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JobsListClient } from "./JobsListClient";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const publishedCount = jobs.filter((j) => j.status === "published").length;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Jobs
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/jobs/create"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Create Job
          </Link>
        </div>
      </div>

      {publishedCount > 0 && (
        <p className="text-muted-foreground mb-4 text-sm">
          {publishedCount} published job(s) &middot; {jobs.length} total
        </p>
      )}

      {jobs.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No jobs found. Create your first job listing.
        </p>
      ) : (
        <JobsListClient
          items={jobs.map((job) => ({
            id: job.id,
            title: job.title,
            titleTamil: job.titleTamil,
            company: job.company,
            jobType: job.jobType,
            status: job.status,
            applicationDeadline: job.applicationDeadline?.toISOString() ?? null,
            salaryDescription: job.salaryDescription,
            location: job.location,
            createdAt: job.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
