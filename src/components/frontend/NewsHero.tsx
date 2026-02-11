"use client";

import Image from "next/image";
import { Calendar, User, Clock, Eye } from "lucide-react";
import { estimateReadingTime } from "@/lib/utils";

interface NewsHeroProps {
  news: {
    title: string;
    titleTamil?: string | null;
    image?: string | null;
    category: string;
    publishedAt: Date | null;
    author: { name: string };
    views: number;
    content: string;
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(date));
}

export function NewsHero({ news }: NewsHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="container relative z-10 h-full mx-auto px-4 flex flex-col justify-end pb-12">
        <div className="max-w-4xl space-y-6">
          {/* Category Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold tracking-wider uppercase">
            {news.category}
          </div>

          {/* Title and Tamil Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              {news.title}
            </h1>
            {news.titleTamil && (
              <p className="text-2xl md:text-3xl text-gray-300 font-medium leading-relaxed">
                {news.titleTamil}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base border-t border-white/20 pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>{news.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>{estimateReadingTime(news.content)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span>{news.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
