import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServicePostForm } from "@/components/admin/ServicePostForm";

export default async function AdminServicePostNewPage({
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
        <Link
          href={`/admin/services/${id}/posts`}
          className="text-muted-foreground hover:text-foreground"
        >
          &larr; Back to {service.title}
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">New Post</h1>
      <ServicePostForm mode="create" serviceId={id} serviceName={service.title} />
    </div>
  );
}
