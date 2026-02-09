import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Eye, Clock } from "lucide-react";
import { cn, estimateReadingTime } from "@/lib/utils";

export interface NewsCardProps {
  news: {
    id: string;
    title: string;
    titleTamil?: string | null;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    image?: string | null;
    category: string;
    publishedAt?: Date | null;
    views: number;
    author: {
      name: string;
    };
  };
  /** Variant: "default" for standard grid, "compact" for sidebar/top-stories */
  variant?: "default" | "compact";
}

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

/** Default (full) card — 16:9 image, serif headline, Tamil subtitle, meta row */
function DefaultCard({ news }: { news: NewsCardProps["news"] }) {
  return (
    <Link href={`/news/${news.slug}`} className="block group h-full">
      <article
        className={cn(
          "h-full flex flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:-translate-y-1",
          "shadow-sm"
        )}
      >
        {/* Image — 16:9 aspect ratio */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {news.image ? (
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={80}
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-400 dark:text-gray-500 text-sm"
              aria-hidden
            >
              No image
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          />
          {/* Category badge — top-right */}
          <span
            className={cn(
              "absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider shadow-md",
              getCategoryColor(news.category)
            )}
          >
            {news.category}
          </span>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Headline — serif font for newspaper feel */}
          <h2 className="font-serif font-bold text-lg leading-snug line-clamp-2 text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {news.title}
          </h2>

          {/* Tamil subtitle — with dedicated Tamil font */}
          {news.titleTamil && (
            <p className="mt-1 font-tamil text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-1">
              {news.titleTamil}
            </p>
          )}

          {/* Excerpt */}
          {news.excerpt && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {news.excerpt}
            </p>
          )}

          {/* Spacer to push meta to bottom */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="mt-3 mb-2.5 border-t border-gray-100 dark:border-gray-700" />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" aria-hidden />
              {formatDate(news.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 shrink-0" aria-hidden />
              {news.views.toLocaleString()}
            </span>
            {news.content != null && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" aria-hidden />
                {estimateReadingTime(news.content)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 ml-auto">
              <User className="h-3 w-3 shrink-0" aria-hidden />
              {news.author.name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** Compact card — horizontal layout for sidebar "Top Stories" */
function CompactCard({ news }: { news: NewsCardProps["news"] }) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            quality={60}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-[10px]">
            No img
          </div>
        )}
      </div>
      {/* Text */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <span
          className={cn(
            "inline-block self-start px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-1",
            getCategoryColor(news.category)
          )}
        >
          {news.category}
        </span>
        <h3 className="font-serif font-bold text-sm leading-snug line-clamp-2 text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {news.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" aria-hidden />
            {formatDate(news.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-2.5 w-2.5" aria-hidden />
            {news.views.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ news, variant = "default" }: NewsCardProps) {
  if (variant === "compact") {
    return <CompactCard news={news} />;
  }
  return <DefaultCard news={news} />;
}
