import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
import { ShareBar } from "@/components/frontend/ShareBar";
import { NewsViewTracker } from "@/components/frontend/NewsViewTracker";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { estimateReadingTime } from "@/lib/utils";
import {
  Calendar,
  User,
  Eye,
  ArrowLeft,
  Clock,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await prisma.news.findFirst({
    where: { slug, status: "published" },
    select: { title: true, titleTamil: true, excerpt: true, image: true, category: true },
  });
  if (!news) {
    return { title: "Not Found" };
  }
  const title = `${news.title} - Kilpennathur News`;
  const description = news.excerpt ?? `${news.title} - Read the full article on Kilpennathur Community Portal.`;

  return {
    title,
    description,
    keywords: ["kilpennathur", news.category, "news", "செய்திகள்", news.titleTamil].filter(Boolean) as string[],
    authors: [{ name: "Kilpennathur.com" }],
    openGraph: {
      title: news.title,
      description,
      type: "article",
      url: `https://kilpennathur.com/news/${slug}`,
      siteName: "Kilpennathur Community Portal",
      images: news.image
        ? [{ url: news.image, width: 1200, height: 630, alt: news.title }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Kilpennathur News" }],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      images: news.image ? [news.image] : ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://kilpennathur.com/news/${slug}`,
    },
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(date));
}

function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p.replace(/\n/g, "<br />"))}</p>`)
    .join("");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + "…";
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const news = await prisma.news.findFirst({
    where: { slug, status: "published" },
    include: { author: true },
  });

  if (!news) notFound();

  const [relatedNews, recentPosts, popularPosts, categories] = await Promise.all([
    prisma.news.findMany({
      where: {
        category: news.category,
        id: { not: news.id },
        status: "published",
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { author: true },
    }),
    prisma.news.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { slug: true, title: true },
    }),
    prisma.news.findMany({
      where: { status: "published" },
      orderBy: { views: "desc" },
      take: 5,
      select: { slug: true, title: true },
    }),
    prisma.category.findMany({
      where: { type: "news" },
      orderBy: { name: "asc" },
    }),
  ]);

  const tags = news.tags ? news.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://kilpennathur.com";
  const shareUrl = `${baseUrl}/news/${news.slug}`;

  // Structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    alternativeHeadline: news.titleTamil,
    image: news.image || `${baseUrl}/og-image.jpg`,
    datePublished: news.publishedAt?.toISOString(),
    dateModified: news.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: news.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Kilpennathur Community Portal",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    description: news.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
    articleSection: news.category,
    keywords: tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsViewTracker slug={news.slug} />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        <Breadcrumbs
          items={[
            { label: "News", href: "/news" },
            { label: truncate(news.title, 40) },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main content */}
          <main className="lg:col-span-3 max-w-4xl">
            <article>
              <header className="mb-6">
                <span className="inline-block px-2.5 py-0.5 rounded text-sm font-medium bg-primary text-primary-foreground mb-2">
                  {news.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {news.title}
                </h1>
                {news.titleTamil && (
                  <p className="text-2xl text-gray-600 mb-4">{news.titleTamil}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 shrink-0" aria-hidden />
                    {formatDate(news.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 shrink-0" aria-hidden />
                    {news.author.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 shrink-0" aria-hidden />
                    {news.views} views
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" aria-hidden />
                    {estimateReadingTime(news.content)}
                  </span>
                </div>
                <div className="h-px bg-gray-200" aria-hidden />
              </header>

              {news.image && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted mb-8">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div
                className="prose prose-lg prose-neutral max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: formatContent(news.content) }}
              />

              {news.contentTamil && (
                <>
                  <div className="h-px bg-gray-200 my-8" aria-hidden />
                  <div
                    className="prose prose-lg prose-neutral max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: formatContent(news.contentTamil) }}
                  />
                </>
              )}

              {tags.length > 0 && (
                <div className="mb-8">
                  <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-2.5 py-0.5 rounded text-sm bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-2">Share this article:</p>
                <ShareBar
                  url={shareUrl}
                  title={news.title}
                  whatsappLink={news.whatsappLink}
                  newsId={news.id}
                />
              </div>

              {news.referenceUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Source:</span>
                  <a
                    href={news.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    {news.referenceUrl}
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              )}
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
              <ul className="space-y-2">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="text-sm text-gray-600 hover:text-blue-600 line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h2>
              <ul className="space-y-2">
                {popularPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="text-sm text-gray-600 hover:text-blue-600 line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/news?category=${c.slug}`}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Related News</h2>
            <p className="text-gray-600 mb-8">தொடர்புடைய செய்திகள்</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
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
          </section>
        )}
      </div>
    </div>
  );
}
