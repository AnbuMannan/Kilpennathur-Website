import Link from "next/link";
import { ClassifiedForm } from "@/components/admin/ClassifiedForm";

export default function AdminClassifiedCreatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/classifieds"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Classifieds
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add Listing</h1>
        <p className="text-muted-foreground mt-1">
          Create a new classified listing.
        </p>
      </div>
      <ClassifiedForm mode="create" />
    </div>
  );
}
