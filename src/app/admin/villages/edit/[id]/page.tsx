import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VillageForm } from "@/components/admin/VillageForm";

export default async function AdminVillageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const village = await prisma.village.findUnique({
    where: { id },
  });

  if (!village) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/villages"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Villages
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Village</h1>
        <p className="text-muted-foreground mt-1">
          Update {village.name}
        </p>
      </div>
      <VillageForm
        mode="edit"
        village={{
          id: village.id,
          name: village.name,
          nameTamil: village.nameTamil,
          slug: village.slug,
          description: village.description,
          presidentName: village.presidentName,
          presidentNameTamil: village.presidentNameTamil,
          presidentImage: village.presidentImage,
          population: village.population,
          totalStreets: village.totalStreets,
          wardCount: village.wardCount,
        }}
      />
    </div>
  );
}
