import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";

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
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/news" className="text-muted-foreground hover:text-foreground">
          &larr; Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">Edit News</h1>
      <NewsForm
        mode="edit"
        categories={categories}
        news={{
          id: news.id,
          title: news.title,
          titleTamil: news.titleTamil,
          slug: news.slug,
          content: news.content,
          contentTamil: news.contentTamil,
          excerpt: news.excerpt,
          image: news.image,
          category: news.category,
          tags: news.tags,
          status: news.status,
          whatsappLink: news.whatsappLink,
          referenceUrl: news.referenceUrl,
        }}
      />
    </div>
  );
}
