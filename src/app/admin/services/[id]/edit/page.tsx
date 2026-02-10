import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/services" className="text-muted-foreground hover:text-foreground">
          &larr; Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Edit Service</h1>
      <ServiceForm
        mode="edit"
        service={{
          id: service.id,
          title: service.title,
          titleTamil: service.titleTamil,
          slug: service.slug,
          description: service.description,
          icon: service.icon,
          order: service.order,
        }}
      />
    </div>
  );
}
