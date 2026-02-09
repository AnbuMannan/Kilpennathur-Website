"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
}

interface BreakingNewsTickerProps {
  news: NewsItem[];
}

export default function BreakingNewsTicker({ news }: BreakingNewsTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker || news.length === 0) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= ticker.scrollWidth / 2) {
        scrollAmount = 0;
      }
      ticker.style.transform = `translateX(-${scrollAmount}px)`;
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animation);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <div className="bg-red-600 dark:bg-red-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 h-9">
        <div className="flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-5 h-5 animate-pulse" aria-hidden />
          <span className="font-bold uppercase text-sm">Breaking News</span>
        </div>
        <div className="flex-1 overflow-hidden min-w-0" aria-label="Scrolling news headlines">
          <div
            ref={tickerRef}
            className="flex gap-12 whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            {[...news, ...news].map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={`/news/${item.slug}`}
                className="hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
