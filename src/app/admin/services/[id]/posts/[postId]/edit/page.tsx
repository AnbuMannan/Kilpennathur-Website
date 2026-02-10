import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServicePostForm } from "@/components/admin/ServicePostForm";

export default async function AdminServicePostEditPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = await params;

  const [service, post] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.servicePost.findUnique({ where: { id: postId } }),
  ]);

  if (!service || !post) notFound();

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
      <h1 className="text-4xl font-bold mb-6">Edit Post</h1>
      <ServicePostForm
        mode="edit"
        serviceName={service.title}
        post={{
          id: post.id,
          serviceId: post.serviceId,
          title: post.title,
          titleTamil: post.titleTamil,
          slug: post.slug,
          content: post.content,
          contentTamil: post.contentTamil,
          image: post.image,
          status: post.status,
        }}
      />
    </div>
  );
}
