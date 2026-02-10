import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BusinessForm } from "@/components/admin/BusinessForm";

export default async function AdminBusinessEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [business, categories] = await Promise.all([
    prisma.business.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { type: "business" },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!business) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/business" className="text-muted-foreground hover:text-foreground">
          &larr; Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Edit Business</h1>
      <BusinessForm
        mode="edit"
        categories={categories}
        business={{
          id: business.id,
          name: business.name,
          nameTamil: business.nameTamil,
          category: business.category,
          phone: business.phone,
          whatsapp: business.whatsapp,
          address: business.address,
          description: business.description,
          image: business.image,
          website: business.website,
        }}
      />
    </div>
  );
}
