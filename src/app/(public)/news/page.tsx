import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import ArchivesSidebar from "@/components/frontend/ArchivesSidebar";
import RelatedPosts from "@/components/frontend/RelatedPosts";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Calendar,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, estimateReadingTime } from "@/lib/utils";

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

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}

/** Category badge color mapping */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Breaking News": "bg-red-600 text-white",
    Health: "bg-emerald-600 text-white",
    Employment: "bg-blue-600 text-white",
    "EB News": "bg-amber-600 text-white",
    Weather: "bg-sky-600 text-white",
    Spiritual: "bg-purple-600 text-white",
    "Blood Donation": "bg-rose-600 text-white",
  };
  return colors[category] || "bg-gray-800 text-white";
}

type SearchParams = {
  category?: string | string[];
  search?: string | string[];
  page?: string | string[];
  year?: string | string[];
  month?: string | string[];
};

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
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
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Kilpennathur News",
        },
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
      ? prisma.category.findFirst({
          where: { slug: categorySlug, type: "news" },
        })
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
            {
              titleTamil: { contains: search, mode: "insensitive" as const },
            },
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

  // Build archives array
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
    else if (currentPage > 1)
      u.searchParams.set("page", String(currentPage));
    if (overrides.category !== undefined)
      u.searchParams.set("category", overrides.category);
    else if (categorySlug) u.searchParams.set("category", categorySlug);
    if (overrides.search !== undefined)
      u.searchParams.set("search", overrides.search);
    else if (search) u.searchParams.set("search", search);
    if (overrides.year !== undefined)
      u.searchParams.set("year", overrides.year);
    else if (year) u.searchParams.set("year", year);
    if (overrides.month !== undefined)
      u.searchParams.set("month", overrides.month);
    else if (month) u.searchParams.set("month", month);
    return u.pathname + u.search;
  };

  // ── Magazine layout split ──
  // On page 1 without filters, show the first article as "featured" and the
  // next 4 as "top stories". The rest go into the standard grid.
  const isFirstPageUnfiltered =
    page === 1 && !categorySlug && !search && !year && !month;
  const featuredArticle =
    isFirstPageUnfiltered && news.length > 0 ? news[0] : null;
  const topStories =
    isFirstPageUnfiltered && news.length > 1 ? news.slice(1, 5) : [];
  const gridArticles =
    isFirstPageUnfiltered && news.length > 5
      ? news.slice(5)
      : isFirstPageUnfiltered
        ? []
        : news;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/images/news-hero.jpg')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Newspaper className="w-3.5 h-3.5" aria-hidden />
            News & Updates
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            Kilpennathur News
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-blue-200/80">
            கீழ்பென்னாத்தூர் செய்திகள்
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Latest updates and stories from Kilpennathur and surrounding
            villages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
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

        {/* ── Search & filter bar ── */}
        <section aria-label="Filter news" className="mb-8">
          <form
            method="get"
            action="/news"
            className="flex flex-col sm:flex-row gap-3"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden
              />
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search by title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                aria-label="Search news"
              />
            </div>
            <select
              name="category"
              defaultValue={categorySlug}
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
            >
              Apply
            </button>
          </form>
        </section>

        {/* ── Magazine Featured Section (page 1 only, no filters) ── */}
        {featuredArticle && (
          <section aria-label="Featured news" className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-red-500" aria-hidden />
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50">
                Top Stories
              </h2>
              <span className="font-tamil text-sm text-gray-500 dark:text-gray-400 ml-1">
                முக்கிய செய்திகள்
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left — Featured article (large hero card) */}
              <Link
                href={`/news/${featuredArticle.slug}`}
                className="lg:col-span-3 group"
              >
                <article className="relative h-full min-h-[360px] md:min-h-[420px] rounded-xl overflow-hidden shadow-lg">
                  {/* Background image */}
                  {featuredArticle.image ? (
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      quality={90}
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900" />
                  )}
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    aria-hidden
                  />
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {/* Category */}
                    <span
                      className={cn(
                        "inline-block self-start px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-3 shadow",
                        getCategoryColor(featuredArticle.category)
                      )}
                    >
                      {featuredArticle.category}
                    </span>
                    {/* Headline */}
                    <h3
                      className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-3 group-hover:underline decoration-2 underline-offset-4"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                    >
                      {featuredArticle.title}
                    </h3>
                    {featuredArticle.titleTamil && (
                      <p
                        className="mt-1.5 font-tamil text-lg text-blue-100/90 line-clamp-1"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                      >
                        {featuredArticle.titleTamil}
                      </p>
                    )}
                    {featuredArticle.excerpt && (
                      <p className="mt-2 text-sm text-gray-200 line-clamp-2 max-w-xl">
                        {featuredArticle.excerpt}
                      </p>
                    )}
                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" aria-hidden />
                        {formatDate(featuredArticle.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" aria-hidden />
                        {featuredArticle.views.toLocaleString()} views
                      </span>
                      {featuredArticle.content && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden />
                          {estimateReadingTime(featuredArticle.content)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>

              {/* Right — Top Stories (vertical list) */}
              <div className="lg:col-span-2 flex flex-col">
                {topStories.length > 0 ? (
                  <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-full">
                    {topStories.map((item, idx) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex-1"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-[72px] shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="96px"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              quality={60}
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                {item.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Number overlay */}
                          <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold rounded w-5 h-5 flex items-center justify-center">
                            {idx + 2}
                          </span>
                        </div>
                        {/* Text */}
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <span
                            className={cn(
                              "inline-block self-start px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1",
                              getCategoryColor(item.category)
                            )}
                          >
                            {item.category}
                          </span>
                          <h4 className="font-serif font-bold text-[13px] leading-snug line-clamp-2 text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-0.5">
                              <Calendar className="h-2.5 w-2.5" aria-hidden />
                              {formatDate(item.publishedAt)}
                            </span>
                            <span className="inline-flex items-center gap-0.5">
                              <Eye className="h-2.5 w-2.5" aria-hidden />
                              {item.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {/* ── Main content + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content — 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section heading for grid articles */}
            {isFirstPageUnfiltered && gridArticles.length > 0 && (
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" aria-hidden />
                <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-50">
                  More News
                </h2>
                <span className="font-tamil text-sm text-gray-500 dark:text-gray-400 ml-1">
                  மேலும் செய்திகள்
                </span>
              </div>
            )}

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
              ) : gridArticles.length === 0 && !isFirstPageUnfiltered ? (
                <EmptyState
                  icon={Newspaper}
                  title="No news found"
                  description="Try adjusting your search, category, or archive filter."
                  action={{ label: "Clear filters", href: "/news" }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(isFirstPageUnfiltered ? gridArticles : news).map(
                    (item) => (
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
                    )
                  )}
                </div>
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && news.length > 0 && (
              <nav
                className="flex items-center justify-center gap-2 pt-4"
                aria-label="Pagination"
              >
                <Link
                  href={buildUrl({ page: currentPage - 1 })}
                  className={cn(
                    "inline-flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    currentPage <= 1
                      ? "pointer-events-none border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  aria-disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Link>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) =>
                      p === currentPage ? (
                        <span
                          key={p}
                          className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-semibold"
                          aria-current="page"
                        >
                          {p}
                        </span>
                      ) : (
                        <Link
                          key={p}
                          href={buildUrl({ page: p })}
                          className="inline-flex w-9 h-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {p}
                        </Link>
                      )
                  )}
                </div>
                <Link
                  href={buildUrl({ page: currentPage + 1 })}
                  className={cn(
                    "inline-flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    currentPage >= totalPages
                      ? "pointer-events-none border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  aria-disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </nav>
            )}
          </div>

          {/* Sidebar — 1 column */}
          <aside className="lg:col-span-1 space-y-6">
            {showArchives && archives.length > 0 && (
              <ArchivesSidebar archives={archives} />
            )}

            <RelatedPosts posts={popularPosts} title="Popular Posts" />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-serif">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0.5">
                  <Link
                    href="/news"
                    className={cn(
                      "flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group text-sm",
                      !categorySlug ? "text-blue-600 font-semibold" : ""
                    )}
                  >
                    <span>All Categories</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/news?category=${c.slug}`}
                      className={cn(
                        "flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group text-sm",
                        categorySlug === c.slug
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span className="group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
