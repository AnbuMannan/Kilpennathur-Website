import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  Globe,
  MapPin,
  MessageCircle,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    nameTamil?: string | null;
    category: string;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    description?: string | null;
    image?: string | null;
    website?: string | null;
  };
}

/** Normalize number for wa.me (digits only). */
function whatsappHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800",
        /* Desktop: horizontal row | Mobile: stacked */
        "flex flex-col sm:flex-row",
        "overflow-hidden h-full"
      )}
    >
      {/* ── Image section ── */}
      <div className="relative sm:w-44 md:w-48 shrink-0 overflow-hidden">
        <div className="aspect-[4/3] sm:aspect-auto sm:h-full w-full relative">
          {business.image ? (
            <Image
              src={business.image}
              alt={business.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 192px"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-8 h-8 text-white/40 mx-auto mb-1" />
                <span className="text-2xl font-bold text-white/50">
                  {business.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Category badge on image — mobile only */}
        <Badge className="absolute top-2.5 right-2.5 sm:hidden bg-white/90 text-gray-700 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider shadow">
          {business.category}
        </Badge>
      </div>

      {/* ── Content section ── */}
      <div className="flex flex-col flex-1 min-w-0 p-4">
        {/* Category — desktop only */}
        <div className="hidden sm:flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400">
          <Building2 className="w-3 h-3" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {business.category}
          </span>
        </div>

        {/* Title + Verified badge */}
        <div className="flex items-start gap-1.5">
          <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {business.name}
          </h3>
          <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-label="Verified" />
        </div>

        {/* Tamil Name */}
        {business.nameTamil && (
          <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
            {business.nameTamil}
          </p>
        )}

        {/* Description */}
        {business.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
            {business.description}
          </p>
        )}

        {/* Address */}
        {business.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-2" />

        {/* ── Actions row ── */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {business.phone && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 gap-1.5 text-xs font-medium hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              asChild
            >
              <a
                href={`tel:${business.phone.replace(/[\s\-\.()]/g, "")}`}
                aria-label={`Call ${business.name}`}
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
            </Button>
          )}

          {business.whatsapp && (
            <Button
              size="sm"
              className="h-8 px-3 gap-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white"
              asChild
            >
              <a
                href={whatsappHref(business.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${business.name}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </Button>
          )}

          {business.website && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 gap-1.5 text-xs font-medium text-gray-600 hover:text-blue-600"
              asChild
            >
              <a
                href={
                  business.website.startsWith("http")
                    ? business.website
                    : `https://${business.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit website of ${business.name}`}
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </a>
            </Button>
          )}

          {/* View Details — pushed right */}
          <Link
            href={`/directory/${business.id}`}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
