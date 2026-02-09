import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 10,
      select: { id: true, title: true, slug: true },
    });
    return NextResponse.json({ news });
  } catch {
    return NextResponse.json({ news: [] });
  }
}
