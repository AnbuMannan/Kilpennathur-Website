import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EventsListWithBulk } from "./EventsListWithBulk";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Events
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Create Event
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No events found. Create your first event.
        </p>
      ) : (
        <EventsListWithBulk
          items={events.map((e) => ({
            id: e.id,
            title: e.title,
            titleTamil: e.titleTamil,
            image: e.image,
            date: e.date,
          }))}
        />
      )}
    </div>
  );
}
