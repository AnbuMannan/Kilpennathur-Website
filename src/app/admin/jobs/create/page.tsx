import Link from "next/link";
import { JobForm } from "@/components/admin/JobForm";

export default function AdminJobCreatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/jobs"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold mt-2">Create Job</h1>
        <p className="text-muted-foreground mt-1">
          Add a new job listing to the directory.
        </p>
      </div>
      <JobForm mode="create" />
    </div>
  );
}
