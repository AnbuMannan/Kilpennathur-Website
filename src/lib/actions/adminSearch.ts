"use server";

import { prisma } from "@/lib/prisma";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  editUrl: string;
};

export async function searchAdmin(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();
  const containsFilter = { contains: q, mode: "insensitive" as const };

  const [news, jobs, villages, events, businesses, schemes, classifieds] =
    await Promise.all([
      prisma.news.findMany({
        where: {
          OR: [
            { title: containsFilter },
            { titleTamil: containsFilter },
          ],
        },
        select: { id: true, title: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.findMany({
        where: {
          OR: [
            { title: containsFilter },
            { titleTamil: containsFilter },
            { company: containsFilter },
          ],
        },
        select: { id: true, title: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.village.findMany({
        where: {
          OR: [
            { name: containsFilter },
            { nameTamil: containsFilter },
          ],
        },
        select: { id: true, name: true },
        take: 5,
        orderBy: { name: "asc" },
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: containsFilter },
            { titleTamil: containsFilter },
          ],
        },
        select: { id: true, title: true },
        take: 5,
        orderBy: { date: "desc" },
      }),
      prisma.business.findMany({
        where: {
          OR: [
            { name: containsFilter },
            { nameTamil: containsFilter },
          ],
        },
        select: { id: true, name: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.scheme.findMany({
        where: {
          OR: [
            { title: containsFilter },
            { titleTamil: containsFilter },
          ],
        },
        select: { id: true, title: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.classified.findMany({
        where: {
          OR: [
            { title: containsFilter },
            { titleTamil: containsFilter },
          ],
        },
        select: { id: true, title: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const results: SearchResult[] = [
    ...news.map((n) => ({
      type: "News",
      id: n.id,
      title: n.title,
      editUrl: `/admin/news/${n.id}/edit`,
    })),
    ...jobs.map((j) => ({
      type: "Job",
      id: j.id,
      title: j.title,
      editUrl: `/admin/jobs/edit/${j.id}`,
    })),
    ...villages.map((v) => ({
      type: "Village",
      id: v.id,
      title: v.name,
      editUrl: `/admin/villages/edit/${v.id}`,
    })),
    ...events.map((e) => ({
      type: "Event",
      id: e.id,
      title: e.title,
      editUrl: `/admin/events/edit/${e.id}`,
    })),
    ...businesses.map((b) => ({
      type: "Business",
      id: b.id,
      title: b.name,
      editUrl: `/admin/business/${b.id}/edit`,
    })),
    ...schemes.map((s) => ({
      type: "Scheme",
      id: s.id,
      title: s.title,
      editUrl: `/admin/schemes/${s.id}/edit`,
    })),
    ...classifieds.map((c) => ({
      type: "Classified",
      id: c.id,
      title: c.title,
      editUrl: `/admin/classifieds/${c.id}/edit`,
    })),
  ];

  return results;
}
