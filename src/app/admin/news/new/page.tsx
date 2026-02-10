import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function AdminNewsNewPage() {
  const categories = await prisma.category.findMany({
    where: { type: "news" },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/news" className="text-muted-foreground hover:text-foreground">
          &larr; Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Add News</h1>
      <NewsForm mode="create" categories={categories} />
    </div>
  );
}
