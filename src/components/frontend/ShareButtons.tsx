"use client";

import { useState } from "react";
import {
  Facebook,
  Twitter,
  MessageCircle,
  Link2,
  Check,
} from "lucide-react";

function trackShare(newsId: string | undefined, platform: string) {
  if (!newsId) return;
  fetch("/api/news/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newsId, platform }),
  }).catch(() => {});
}

export type ShareButtonsProps = {
  url: string;
  title: string;
  whatsappLink?: string | null;
  newsId?: string;
};

export function ShareButtons({ url, title, whatsappLink, newsId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function shareOnFacebook() {
    trackShare(newsId, "facebook");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  }

  function shareOnTwitter() {
    trackShare(newsId, "twitter");
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  }

  function shareOnWhatsApp() {
    trackShare(newsId, "whatsapp");
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)} - ${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const buttonBase =
    "inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="flex lg:flex-col items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-border" role="group" aria-label="Share">
      <button
        type="button"
        onClick={shareOnWhatsApp}
        className={`${buttonBase} bg-[#25d366] text-white hover:bg-[#20bd5a] focus:ring-[#25d366]`}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={shareOnFacebook}
        className={`${buttonBase} bg-[#1877f2] text-white hover:bg-[#166fe5] focus:ring-[#1877f2]`}
        aria-label="Share on Facebook"
      >
        <Facebook className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={shareOnTwitter}
        className={`${buttonBase} bg-[#000000] text-white hover:bg-[#333333] focus:ring-[#000000]`}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={`${buttonBase} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-6 h-6 text-green-600" /> : <Link2 className="w-6 h-6" />}
      </button>
    </div>
  );
}
