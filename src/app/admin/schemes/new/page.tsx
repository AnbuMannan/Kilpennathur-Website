import Link from "next/link";
import { SchemeForm } from "@/components/admin/SchemeForm";

export default function AdminSchemeCreatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/schemes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Schemes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add Scheme</h1>
        <p className="text-muted-foreground mt-1">
          Create a new government scheme entry.
        </p>
      </div>
      <SchemeForm mode="create" />
    </div>
  );
}
