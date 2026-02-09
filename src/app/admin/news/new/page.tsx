import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsCreateForm } from "./NewsCreateForm";

export default async function AdminNewsNewPage() {
  const categories = await prisma.category.findMany({
    where: { type: "news" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/news" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Add News</h1>
      <NewsCreateForm categories={categories} />
    </div>
  );
}
