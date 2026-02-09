"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { MapPin, Phone, Star, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ClassifiedCardProps {
  classified: {
    id: string;
    type: string;
    category: string;
    title: string;
    titleTamil?: string | null;
    description: string;
    descriptionTamil?: string | null;
    price?: number | null;
    priceLabel?: string | null;
    contactName: string;
    contactPhone: string;
    location?: string | null;
    images: string;
    isFeatured: boolean;
    createdAt?: Date | string | null;
  };
}

const TYPE_LABELS: Record<string, { en: string; ta: string; color: string }> = {
  "real-estate": {
    en: "Real Estate",
    ta: "நிலம்/வீடு",
    color: "bg-blue-600 text-white",
  },
  marketplace: {
    en: "For Sale",
    ta: "விற்பனைக்கு",
    color: "bg-emerald-600 text-white",
  },
  service: {
    en: "Service",
    ta: "சேவை",
    color: "bg-amber-600 text-white",
  },
};

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ClassifiedCard({ classified: c }: ClassifiedCardProps) {
  const locale = useLocale();
  const isTamil = locale === "ta";

  const displayTitle = isTamil && c.titleTamil ? c.titleTamil : c.title;
  const displaySubtitle = isTamil && c.titleTamil ? c.title : c.titleTamil;
  const displayDesc =
    isTamil && c.descriptionTamil ? c.descriptionTamil : c.description;

  const imageUrls = c.images
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  const typeInfo = TYPE_LABELS[c.type] ?? TYPE_LABELS["marketplace"];

  const [imgIndex, setImgIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const prevImg = () =>
    setImgIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
  const nextImg = () =>
    setImgIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));

  const priceStr = formatPrice(c.price);

  return (
    <article
      className={cn(
        "group bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full",
        "border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        c.isFeatured && "ring-2 ring-amber-400/50"
      )}
    >
      {/* ── Image area — 4:3 ── */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imageUrls.length > 0 ? (
          <>
            <Image
              src={imageUrls[imgIndex]}
              alt={c.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImg}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {imageUrls.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "block w-1.5 h-1.5 rounded-full transition-colors",
                        i === imgIndex ? "bg-white" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            No image
          </div>
        )}

        {/* Type + Featured badges — top-left */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow",
              typeInfo.color
            )}
          >
            {isTamil ? typeInfo.ta : typeInfo.en}
          </span>
          {c.isFeatured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" />
              {isTamil ? "சிறப்பு" : "Featured"}
            </span>
          )}
        </div>

        {/* Price overlay — bottom-right */}
        {priceStr && (
          <div className="absolute bottom-2.5 right-2.5 bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {priceStr}
            {c.priceLabel && (
              <span className="font-normal text-[11px] ml-1 text-green-100">
                / {c.priceLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <Badge variant="secondary" className="self-start text-[10px] font-semibold uppercase tracking-wider mb-2">
          {c.category}
        </Badge>

        {/* Title */}
        <h3 className="font-serif font-bold text-base leading-snug line-clamp-1 text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {displayTitle}
        </h3>
        {displaySubtitle && (
          <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 leading-relaxed">
            {displaySubtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
          {displayDesc}
        </p>

        {/* Meta: location + time */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          {c.location && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {c.location}
            </span>
          )}
          {c.createdAt && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="w-3 h-3 shrink-0" />
              {timeAgo(c.createdAt)}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-2" />

        {/* ── CTA ── */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {showPhone ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              asChild
            >
              <a href={`tel:${c.contactPhone.replace(/\D/g, "")}`}>
                <Phone className="w-4 h-4" />
                {c.contactPhone} — {c.contactName}
              </a>
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => setShowPhone(true)}
            >
              <Phone className="w-4 h-4" />
              {isTamil ? "தொடர்பு கொள்ள" : "Contact Seller"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
