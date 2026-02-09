import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import ArchivesSidebar from "@/components/frontend/ArchivesSidebar";
import RelatedPosts from "@/components/frontend/RelatedPosts";
import { Search, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Revalidate news list every 60 seconds for fresh content */
export const revalidate = 60;

/** Next.js can pass searchParams values as string | string[]; normalize to string. */
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

const getMonthName = (month: number) => {
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[month - 1];
};

type SearchParams = {
  category?: string | string[];
  search?: string | string[];
  page?: string | string[];
  year?: string | string[];
  month?: string | string[];
};

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = toStr(params.category);
  const search = toStr(params.search);
  const year = toStr(params.year);
  const month = toStr(params.month);
  let title = "News - Kilpennathur | செய்திகள்";
  let description =
    "Latest news and updates from Kilpennathur and surrounding villages. கீழ்பென்னாத்தூர் மற்றும் சுற்றியுள்ள கிராமங்களின் சமீபத்திய செய்திகள்.";

  if (year && month) {
    title = `News: ${getMonthName(parseInt(month))} ${year} - Kilpennathur`;
  } else if (category && search) {
    title = `News: ${category} - "${search}" - Kilpennathur`;
  } else if (category) {
    title = `${category} News - Kilpennathur | ${category} செய்திகள்`;
    description = `Latest ${category.toLowerCase()} news and updates from Kilpennathur. ${category} வகை செய்திகள்.`;
  } else if (search) {
    title = `News: "${search}" - Kilpennathur`;
  }

  return {
    title,
    description,
    keywords: [
      "kilpennathur news",
      "செய்திகள்",
      "tamil nadu news",
      "local news",
      category,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://kilpennathur.com/news",
      siteName: "Kilpennathur Community Portal",
      images: [
        { url: "/og-image.jpg", width: 1200, height: 630, alt: "Kilpennathur News" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: "https://kilpennathur.com/news",
    },
  };
}

export default async function NewsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = toStr(params.category).trim();
  const search = toStr(params.search).trim();
  const page = Math.max(1, parseInt(toStr(params.page) || "1", 10) || 1);
  const year = toStr(params.year).trim();
  const month = toStr(params.month).trim();

  // Fetch pagination setting
  const [newsPerPageSetting, showArchivesSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "news_per_page" } }),
    prisma.siteSetting.findUnique({ where: { key: "show_archives" } }),
  ]);
  const limit = parseInt(newsPerPageSetting?.value || "9", 10) || 9;
  const showArchives = showArchivesSetting?.value !== "false";

  const [categories, categoryBySlug] = await Promise.all([
    prisma.category.findMany({
      where: { type: "news" },
      orderBy: { name: "asc" },
    }),
    categorySlug
      ? prisma.category.findFirst({ where: { slug: categorySlug, type: "news" } })
      : Promise.resolve(null),
  ]);

  const categoryName = categoryBySlug?.name ?? null;

  const where = {
    status: "published" as const,
    ...(categoryName ? { category: categoryName } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { titleTamil: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(year && month
      ? {
          publishedAt: {
            gte: new Date(parseInt(year), parseInt(month) - 1, 1),
            lt: new Date(parseInt(year), parseInt(month), 1),
          },
        }
      : {}),
  };

  const [news, totalCount, archivesNews, popularPosts] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: true },
    }),
    prisma.news.count({ where }),
    showArchives
      ? prisma.news.findMany({
          where: { status: "published" },
          select: { publishedAt: true },
        })
      : Promise.resolve([]),
    prisma.news.findMany({
      where: { status: "published" },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        publishedAt: true,
        views: true,
      },
    }),
  ]);

  // Build archives array (same logic as API)
  const archiveMap = new Map<string, number>();
  archivesNews.forEach((item) => {
    if (item.publishedAt) {
      const date = new Date(item.publishedAt);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const key = `${y}-${m}`;
      archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
    }
  });
  const archives = Array.from(archiveMap.entries())
    .map(([key, count]) => {
      const [y, m] = key.split("-").map(Number);
      return { year: y, month: m, count };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(page, totalPages);

  const buildUrl = (overrides: {
    page?: number;
    category?: string;
    search?: string;
    year?: string;
    month?: string;
  }) => {
    const u = new URL("/news", "http://localhost");
    if (overrides.page !== undefined)
      u.searchParams.set("page", String(overrides.page));
    else if (currentPage > 1) u.searchParams.set("page", String(currentPage));
    if (overrides.category !== undefined)
      u.searchParams.set("category", overrides.category);
    else if (categorySlug) u.searchParams.set("category", categorySlug);
    if (overrides.search !== undefined)
      u.searchParams.set("search", overrides.search);
    else if (search) u.searchParams.set("search", search);
    if (overrides.year !== undefined) u.searchParams.set("year", overrides.year);
    else if (year) u.searchParams.set("year", year);
    if (overrides.month !== undefined)
      u.searchParams.set("month", overrides.month);
    else if (month) u.searchParams.set("month", month);
    return u.pathname + u.search;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/news-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/55 to-indigo-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Newspaper className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">News</h1>
          <p className="text-xl md:text-2xl mb-2">செய்திகள்</p>
          <p className="text-base md:text-lg text-blue-100 max-w-3xl text-center">
            Latest updates and stories from Kilpennathur and surrounding
            villages.
          </p>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "News" }]} />

        {/* Show selected archive if filtered */}
        {year && month && (
          <div className="mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Showing news from{" "}
              <strong>
                {getMonthName(parseInt(month))} {year}
              </strong>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and filters */}
            <section aria-label="Filter news">
              <form
                method="get"
                action="/news"
                className="flex flex-col sm:flex-row gap-4"
              >
                <input type="hidden" name="page" value="1" />
                {year && (
                  <>
                    <input type="hidden" name="year" value={year} />
                    <input type="hidden" name="month" value={month} />
                  </>
                )}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    name="search"
                    defaultValue={search}
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search news"
                  />
                </div>
                <select
                  name="category"
                  defaultValue={categorySlug}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </form>
            </section>

            {/* News grid */}
            <section aria-label="News list">
              {news.length === 0 ? (
                <EmptyState
                  icon={Newspaper}
                  title="No news found"
                  description={
                    search || categorySlug || (year && month)
                      ? "Try adjusting your search, category, or archive filter."
                      : "Only published articles appear here. Check back later for the latest updates."
                  }
                  action={{ label: "Clear filters", href: "/news" }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {news.map((item) => (
                    <NewsCard
                      key={item.id}
                      news={{
                        id: item.id,
                        title: item.title,
                        titleTamil: item.titleTamil,
                        slug: item.slug,
                        excerpt: item.excerpt,
                        content: item.content,
                        image: item.image,
                        category: item.category,
                        publishedAt: item.publishedAt,
                        views: item.views,
                        author: { name: item.author.name },
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && news.length > 0 && (
              <nav
                className="flex items-center justify-center gap-2"
                aria-label="Pagination"
              >
                <Link
                  href={buildUrl({ page: currentPage - 1 })}
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg border font-medium transition-colors ${
                    currentPage <= 1
                      ? "pointer-events-none border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  aria-disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) =>
                      p === currentPage ? (
                        <span
                          key={p}
                          className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-blue-600 text-white font-medium"
                          aria-current="page"
                        >
                          {p}
                        </span>
                      ) : (
                        <Link
                          key={p}
                          href={buildUrl({ page: p })}
                          className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          {p}
                        </Link>
                      )
                  )}
                </div>
                <Link
                  href={buildUrl({ page: currentPage + 1 })}
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg border font-medium transition-colors ${
                    currentPage >= totalPages
                      ? "pointer-events-none border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  aria-disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </nav>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {showArchives && archives.length > 0 && (
              <ArchivesSidebar archives={archives} />
            )}

            <RelatedPosts posts={popularPosts} title="Popular Posts" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Link
                    href="/news"
                    className={`flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${
                      !categorySlug ? "text-blue-600 font-medium" : ""
                    }`}
                  >
                    <span className="text-sm">All Categories</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/news?category=${c.slug}`}
                      className={`flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${
                        categorySlug === c.slug ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                        {c.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
