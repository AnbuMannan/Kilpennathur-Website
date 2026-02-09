import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsEditForm } from "./NewsEditForm";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [news, categories] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { type: "news" },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!news) notFound();

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/news" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Edit News</h1>
      <NewsEditForm news={news} categories={categories} />
    </div>
  );
}
