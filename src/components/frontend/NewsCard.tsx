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
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`} className="block group">
      <article
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:-translate-y-1",
          "shadow-md"
        )}
      >
        {/* Image section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {news.image ? (
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm"
              aria-hidden
            >
              No image
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          />
          {/* Category badge */}
          <span
            className={cn(
              "absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium",
              "bg-primary text-primary-foreground"
            )}
          >
            {news.category}
          </span>
        </div>

        {/* Card content */}
        <div className="p-3">
          <h2 className="font-bold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {news.title}
          </h2>
          {news.titleTamil && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {news.titleTamil}
            </p>
          )}
          {news.excerpt && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
              {news.excerpt}
            </p>
          )}
        </div>

        {/* Card footer */}
        <div className="px-3 pb-3 pt-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {formatDate(news.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {news.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {news.views} views
            </span>
            {news.content != null && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {estimateReadingTime(news.content)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
