"use client";

import { RowActions } from "@/components/admin/RowActions";
import { DeleteJobButton } from "./DeleteJobButton";
import { AlertTriangle } from "lucide-react";

type JobItem = {
  id: string;
  title: string;
  titleTamil: string | null;
  company: string;
  jobType: string;
  status: string;
  applicationDeadline: string | null;
  salaryDescription: string | null;
  location: string | null;
  createdAt: string;
};

function statusBadge(status: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize";
  if (status === "published") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "draft") return `${base} bg-amber-100 text-amber-700`;
  if (status === "closed") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
}

function isExpiringSoon(deadline: string | null): boolean {
  if (!deadline) return false;
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function JobsListClient({ items }: { items: JobItem[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col />
            <col style={{ width: "14%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Company</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Apps</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Deadline</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((job) => {
              const expiring = isExpiringSoon(job.applicationDeadline);
              return (
                <tr key={job.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2.5 min-w-0">
                    <span className="block truncate font-medium" title={job.title}>
                      {job.title}
                    </span>
                    {job.titleTamil && (
                      <span className="block truncate text-xs text-muted-foreground">{job.titleTamil}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-sm">{job.company}</td>
                  <td className="px-4 py-2.5 text-xs">{job.jobType}</td>
                  <td className="px-4 py-2.5">
                    <span className={statusBadge(job.status)}>{job.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums text-center" title="Future feature">
                    0
                  </td>
                  <td className="px-4 py-2.5 text-sm whitespace-nowrap">
                    {job.applicationDeadline ? (
                      <span className={expiring ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                        {expiring && <AlertTriangle className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />}
                        {formatDate(job.applicationDeadline)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <RowActions
                      editUrl={`/admin/jobs/edit/${job.id}`}
                      title={job.title}
                      fields={[
                        { label: "Title", value: job.title },
                        { label: "Tamil Title", value: job.titleTamil },
                        { label: "Company", value: job.company },
                        { label: "Type", value: job.jobType },
                        { label: "Status", value: job.status, type: "badge" },
                        { label: "Salary", value: job.salaryDescription },
                        { label: "Location", value: job.location },
                        { label: "Deadline", value: job.applicationDeadline ? formatDate(job.applicationDeadline) : null },
                      ]}
                      deleteComponent={<DeleteJobButton jobId={job.id} jobTitle={job.title} />}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
