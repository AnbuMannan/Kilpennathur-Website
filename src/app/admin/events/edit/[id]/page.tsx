import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Event</h1>
        <p className="text-muted-foreground mt-1">
          Update {event.title}
        </p>
      </div>
      <EventForm
        mode="edit"
        event={{
          id: event.id,
          title: event.title,
          titleTamil: event.titleTamil,
          description: event.description,
          date: event.date,
          image: event.image,
        }}
      />
    </div>
  );
}
