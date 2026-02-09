import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SchemeForm } from "@/components/admin/SchemeForm";

export default async function AdminSchemeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const scheme = await prisma.scheme.findUnique({
    where: { id },
  });

  if (!scheme) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/schemes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Schemes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Scheme</h1>
        <p className="text-muted-foreground mt-1">Update {scheme.title}</p>
      </div>
      <SchemeForm
        mode="edit"
        scheme={{
          id: scheme.id,
          title: scheme.title,
          titleTamil: scheme.titleTamil,
          slug: scheme.slug,
          description: scheme.description,
          descriptionTamil: scheme.descriptionTamil,
          sponsor: scheme.sponsor,
          beneficiaryType: scheme.beneficiaryType,
          applicationLink: scheme.applicationLink,
          status: scheme.status,
        }}
      />
    </div>
  );
}
