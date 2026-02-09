import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HelplineForm } from "@/components/admin/HelplineForm";

export default async function AdminHelplineEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const helpline = await prisma.helpline.findUnique({
    where: { id },
  });

  if (!helpline) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/utilities/helplines"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Helplines
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Helpline</h1>
        <p className="text-muted-foreground mt-1">Update {helpline.title}</p>
      </div>
      <HelplineForm
        mode="edit"
        helpline={{
          id: helpline.id,
          title: helpline.title,
          titleTamil: helpline.titleTamil,
          number: helpline.number,
          category: helpline.category,
        }}
      />
    </div>
  );
}
