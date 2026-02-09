"use client";

import { useState, useEffect } from "react";
import BreakingNewsTicker, { type NewsItem } from "./BreakingNewsTicker";
import { Facebook, Instagram, Twitter, MessageCircle, Youtube } from "lucide-react";

const FALLBACK_TEXT =
  "Welcome to Kilpennathur.com — Your community news and information source. ";

const SOCIAL_LINKS = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: MessageCircle, label: "WhatsApp" },
  { href: "#", icon: Youtube, label: "YouTube" },
] as const;

function SocialLinks() {
  return (
    <div className="flex items-center gap-3 shrink-0 ml-4">
      {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded text-white/90 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}

export function BreakingNewsBar() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news/headlines")
      .then((res) => res.json())
      .then((data) => setNews(data.news ?? []))
      .catch(() => setNews([]));
  }, []);

  if (news.length > 0) {
    return (
      <div className="flex items-stretch bg-red-600 dark:bg-red-800 min-h-9">
        <div className="flex-1 min-w-0 overflow-hidden">
          <BreakingNewsTicker news={news} />
        </div>
        <div className="hidden sm:flex items-center px-4 shrink-0 border-l border-white/20">
          <SocialLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 dark:bg-blue-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
        <div className="flex-1 min-w-0 overflow-hidden" aria-label="Breaking news ticker">
          <div className="inline-flex header-ticker whitespace-nowrap">
            <span className="font-semibold mr-4">Breaking News:</span>
            <span>{FALLBACK_TEXT.repeat(4)}</span>
          </div>
        </div>
        <SocialLinks />
      </div>
    </div>
  );
}
