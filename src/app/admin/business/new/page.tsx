import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BusinessCreateForm } from "./BusinessCreateForm";

export default async function AdminBusinessNewPage() {
  const categories = await prisma.category.findMany({
    where: { type: "business" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/business" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Add Business</h1>
      <BusinessCreateForm categories={categories} />
    </div>
  );
}
