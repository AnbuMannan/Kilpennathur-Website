import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search across multiple models
    const [news, businesses, villages, events, jobs] = await Promise.all([
      // Search news
      prisma.news.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { titleTamil: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          titleTamil: true,
          slug: true,
          category: true,
        },
        take: 5,
      }),

      // Search businesses
      prisma.business.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { nameTamil: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          nameTamil: true,
          category: true,
        },
        take: 5,
      }),

      // Search villages
      prisma.village.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { nameTamil: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          nameTamil: true,
          slug: true,
        },
        take: 5,
      }),

      // Search events
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { titleTamil: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          titleTamil: true,
        },
        take: 5,
      }),

      // Search jobs
      prisma.job.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { titleTamil: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          titleTamil: true,
          company: true,
        },
        take: 5,
      }),
    ]);

    // Combine and format results
    const results = [
      ...news.map((item) => ({ ...item, type: "news" as const })),
      ...businesses.map((item) => ({
        ...item,
        type: "business" as const,
        title: item.name,
      })),
      ...villages.map((item) => ({
        ...item,
        type: "village" as const,
        title: item.name,
      })),
      ...events.map((item) => ({ ...item, type: "event" as const })),
      ...jobs.map((item) => ({
        ...item,
        type: "job" as const,
        titleTamil: item.titleTamil,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
