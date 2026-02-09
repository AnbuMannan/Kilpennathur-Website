import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";

export default function AdminEventCreatePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-bold mt-2">Create Event</h1>
        <p className="text-muted-foreground mt-1">
          Add a new event to the directory.
        </p>
      </div>
      <EventForm mode="create" />
    </div>
  );
}
