import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
import { ShareButtons } from "@/components/frontend/ShareButtons";
import { NewsHero } from "@/components/frontend/NewsHero";
import RelatedPosts from "@/components/frontend/RelatedPosts";
import CategoriesWidget from "@/components/frontend/CategoriesWidget";
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
      take: 5,
      include: { author: true },
    }),
    prisma.news.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { id: true, slug: true, title: true, image: true, publishedAt: true, views: true },
    }),
    prisma.news.findMany({
      where: { status: "published" },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, slug: true, title: true, image: true, publishedAt: true, views: true },
    }),
    prisma.category.findMany({
      where: { type: "news" },
      orderBy: { name: "asc" },
    }),
  ]);

  // Manually fetch counts since there's no formal relation in schema
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await prisma.news.count({
        where: {
          category: cat.name, // The News model uses the category name string
          status: "published",
        },
      });
      return {
        ...cat,
        _count: { news: count },
      };
    })
  );

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
    <article className="min-h-screen bg-white dark:bg-gray-950">
      <NewsViewTracker slug={news.slug} />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Cinematic Hero */}
      <NewsHero news={news} />

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Share (Left - 1 Col) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ShareButtons url={shareUrl} title={news.title} newsId={news.id} />
            </div>
          </div>

          {/* Main Content (Center - 7 Cols) */}
          <main className="lg:col-span-7">
            {/* Breadcrumbs inside content area for desktop, or top of mobile */}
            <div className="mb-8">
              <Breadcrumbs
                items={[
                  { label: "News", href: "/news" },
                  { label: truncate(news.title, 30) },
                ]}
              />
            </div>

            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formatContent(news.content) }} />

              {news.contentTamil && (
                <div className="mt-12 pt-12 border-t border-border">
                  <div dangerouslySetInnerHTML={{ __html: formatContent(news.contentTamil) }} />
                </div>
              )}
            </div>

            {/* Mobile Share Buttons */}
            <div className="mt-12 lg:hidden">
              <p className="text-sm font-medium text-gray-500 mb-4">Share this article</p>
              <ShareButtons url={shareUrl} title={news.title} newsId={news.id} />
            </div>

            {/* Tags and Reference */}
            <div className="mt-12 space-y-6 pt-8 border-t border-border">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {news.referenceUrl && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Source:</span>
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
            </div>

            {/* Related News Section below content */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8">Related News</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((related) => (
                  <NewsCard key={related.id} news={related as any} variant="default" />
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar (Right - 4 Cols) */}
          <aside className="lg:col-span-4 space-y-12">
            <RelatedPosts posts={recentPosts as any} title="Recent Posts" />
            <RelatedPosts posts={popularPosts as any} title="Popular Posts" />
            <CategoriesWidget categories={categoriesWithCounts as any} />
          </aside>
        </div>
      </div>
    </article>
  );
}
