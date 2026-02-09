"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

type ShareBarProps = {
  url: string;
  title: string;
  whatsappLink?: string | null;
  newsId?: string;
};

function trackShare(newsId: string | undefined, platform: string) {
  if (!newsId) return;
  fetch("/api/news/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newsId, platform }),
  }).catch(() => {});
}

export function ShareBar({ url, title, whatsappLink, newsId }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith("http") ? url : (typeof window !== "undefined" ? `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}` : url);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappUrl = whatsappLink || `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const handleCopy = async () => {
    try {
      const textToCopy = url.startsWith("http") ? url : (typeof window !== "undefined" ? `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}` : url);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare(newsId, "facebook")}
        className="px-3 py-1.5 rounded-md bg-[#1877f2] text-white text-sm hover:opacity-90"
      >
        Facebook
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare(newsId, "twitter")}
        className="px-3 py-1.5 rounded-md bg-[#1da1f2] text-white text-sm hover:opacity-90"
      >
        Twitter
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare(newsId, "whatsapp")}
        className="px-3 py-1.5 rounded-md bg-[#25d366] text-white text-sm hover:opacity-90"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50"
      >
        <Share2 className="w-4 h-4" />
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
