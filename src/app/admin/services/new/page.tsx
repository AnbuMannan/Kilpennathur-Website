import Link from "next/link";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function AdminServiceNewPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/services" className="text-muted-foreground hover:text-foreground">
          &larr; Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Add Service</h1>
      <ServiceForm mode="create" />
    </div>
  );
}
