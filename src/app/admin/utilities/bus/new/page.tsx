import Link from "next/link";
import { BusForm } from "@/components/admin/BusForm";

export default function AdminBusCreatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/utilities/bus"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Bus Timings
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add Bus Timing</h1>
        <p className="text-muted-foreground mt-1">
          Create a new bus timing entry.
        </p>
      </div>
      <BusForm mode="create" />
    </div>
  );
}
