import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsListWithBulk } from "./NewsListWithBulk";

export default async function AdminNewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">Manage News</h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/news/new"
            className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Add News
          </Link>
        </div>
      </div>

      {newsList.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No news found. Create your first news item.
        </p>
      ) : (
        <NewsListWithBulk
          items={newsList.map((n) => ({
            id: n.id,
            title: n.title,
            titleTamil: n.titleTamil,
            image: n.image,
            category: n.category,
            status: n.status,
            views: n.views,
            createdAt: n.createdAt,
          }))}
        />
      )}
    </div>
  );
}
