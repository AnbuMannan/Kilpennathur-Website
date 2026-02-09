import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get all published news grouped by year and month
    const news = await prisma.news.findMany({
      where: { status: "published" },
      select: { publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    // Group by year and month
    const archiveMap = new Map<string, number>();

    news.forEach((item) => {
      if (item.publishedAt) {
        const date = new Date(item.publishedAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;

        archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
      }
    });

    // Convert to array
    const archives = Array.from(archiveMap.entries()).map(([key, count]) => {
      const [year, month] = key.split("-").map(Number);
      return { year, month, count };
    });

    // Sort by year and month descending
    archives.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return NextResponse.json(archives);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch archives" },
      { status: 500 }
    );
  }
}
