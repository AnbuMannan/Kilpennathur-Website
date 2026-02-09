import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusForm } from "@/components/admin/BusForm";

export default async function AdminBusEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const busTiming = await prisma.busTiming.findUnique({
    where: { id },
  });

  if (!busTiming) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/utilities/bus"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Bus Timings
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Bus Timing</h1>
        <p className="text-muted-foreground mt-1">Update {busTiming.route}</p>
      </div>
      <BusForm
        mode="edit"
        busTiming={{
          id: busTiming.id,
          route: busTiming.route,
          routeTamil: busTiming.routeTamil,
          busNumber: busTiming.busNumber,
          busType: busTiming.busType,
          departureTime: busTiming.departureTime,
        }}
      />
    </div>
  );
}
