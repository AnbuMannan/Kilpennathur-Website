import Link from "next/link";
import { VillageForm } from "@/components/admin/VillageForm";

export default function AdminVillageCreatePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/villages"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Villages
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add Village</h1>
        <p className="text-muted-foreground mt-1">
          Create a new village entry for the directory.
        </p>
      </div>
      <VillageForm mode="create" />
    </div>
  );
}
