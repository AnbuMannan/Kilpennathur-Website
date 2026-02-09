import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kilpennathur.com";

  // Fetch all news, businesses, villages, events
  const [news, businesses, villages, events, jobs] = await Promise.all([
    prisma.news.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.business.findMany({
      select: { id: true, updatedAt: true },
    }),
    prisma.village.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.event.findMany({
      select: { id: true, updatedAt: true },
    }),
    prisma.job.findMany({
      where: { status: "published" },
      select: { id: true, updatedAt: true },
    }),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          ta: `${baseUrl}/ta`,
        },
      },
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/villages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/history`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // Dynamic news pages
  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic business pages
  const businessPages: MetadataRoute.Sitemap = businesses.map((item) => ({
    url: `${baseUrl}/directory/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Dynamic village pages
  const villagePages: MetadataRoute.Sitemap = villages.map((item) => ({
    url: `${baseUrl}/villages/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Dynamic event pages
  const eventPages: MetadataRoute.Sitemap = events.map((item) => ({
    url: `${baseUrl}/events/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Dynamic job pages
  const jobPages: MetadataRoute.Sitemap = jobs.map((item) => ({
    url: `${baseUrl}/jobs/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...newsPages,
    ...businessPages,
    ...villagePages,
    ...eventPages,
    ...jobPages,
  ];
}
