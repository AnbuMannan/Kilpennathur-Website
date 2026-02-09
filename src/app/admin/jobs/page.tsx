import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DeleteJobButton } from "./DeleteJobButton";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const publishedCount = jobs.filter((j) => j.status === "published").length;

  return (
    <div className="max-w-5xl">
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
        <p className="text-muted-foreground mb-4">
          {publishedCount} published job(s)
        </p>
      )}

      {jobs.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No jobs found. Create your first job listing.
        </p>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Company</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Deadline</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-muted/30">
                  <td className="p-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-medium hover:underline"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{job.company}</td>
                  <td className="p-4">{job.jobType}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        job.status === "published"
                          ? "default"
                          : job.status === "closed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {job.applicationDeadline
                      ? format(
                          new Date(job.applicationDeadline),
                          "MMM dd, yyyy"
                        )
                      : "—"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/jobs/edit/${job.id}`}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-muted"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>
                      <DeleteJobButton jobId={job.id} jobTitle={job.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
