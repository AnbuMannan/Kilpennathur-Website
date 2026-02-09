import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClassifiedForm } from "@/components/admin/ClassifiedForm";

export default async function AdminClassifiedEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const classified = await prisma.classified.findUnique({ where: { id } });
  if (!classified) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/classifieds"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Classifieds
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Listing</h1>
        <p className="text-muted-foreground mt-1">
          Update {classified.title}
        </p>
      </div>
      <ClassifiedForm
        mode="edit"
        classified={{
          id: classified.id,
          type: classified.type,
          category: classified.category,
          title: classified.title,
          titleTamil: classified.titleTamil,
          slug: classified.slug,
          description: classified.description,
          descriptionTamil: classified.descriptionTamil,
          price: classified.price,
          priceLabel: classified.priceLabel,
          contactName: classified.contactName,
          contactPhone: classified.contactPhone,
          location: classified.location,
          images: classified.images,
          status: classified.status,
          isFeatured: classified.isFeatured,
        }}
      />
    </div>
  );
}
