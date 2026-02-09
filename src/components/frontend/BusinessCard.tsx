import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  Globe,
  MapPin,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {business.image ? (
          <Image
            src={business.image}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={75}
            loading="lazy"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="w-10 h-10 text-white opacity-40 mx-auto mb-1" />
              <div className="text-3xl font-bold text-white opacity-50">
                {business.name.charAt(0)}
              </div>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-blue-600 backdrop-blur-sm text-xs">
            {business.category}
          </Badge>
        </div>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Category Label */}
        <div className="flex items-center gap-1.5 mb-1.5 text-blue-600">
          <Building2 className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {business.category}
          </span>
        </div>

        {/* Business Name */}
        <h3 className="font-bold text-base mb-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {business.name}
        </h3>

        {/* Tamil Name */}
        {business.nameTamil && (
          <p className="text-gray-600 text-sm mb-1">{business.nameTamil}</p>
        )}

        {/* Description */}
        {business.description && (
          <p className="text-xs text-gray-700 line-clamp-2 mt-2">
            {business.description}
          </p>
        )}

        {/* Address */}
        {business.address && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
        )}
      </CardContent>

      {/* Footer with Contact Actions */}
      <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2">
        {/* Contact Buttons Row */}
        {(business.phone || business.whatsapp || business.website) && (
          <div className="flex flex-wrap gap-1.5">
            {business.phone && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 min-w-[70px] h-7 hover:bg-green-50 hover:border-green-500 hover:text-green-700"
                asChild
              >
                <a
                  href={`tel:${business.phone.replace(/[\s\-\.()]/g, "")}`}
                  className="flex items-center justify-center gap-1"
                  aria-label={`Call ${business.name}`}
                >
                  <Phone className="w-3 h-3" />
                  <span className="text-xs">Call</span>
                </a>
              </Button>
            )}

            {business.whatsapp && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 min-w-[70px] h-7 hover:bg-green-50 hover:border-green-500 hover:text-green-700"
                asChild
              >
                <a
                  href={whatsappHref(business.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1"
                  aria-label={`WhatsApp ${business.name}`}
                >
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs">WhatsApp</span>
                </a>
              </Button>
            )}

            {business.website && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 min-w-[70px] h-7 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
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
                  className="flex items-center justify-center gap-1"
                  aria-label={`Visit website of ${business.name}`}
                >
                  <Globe className="w-3 h-3" />
                  <span className="text-xs">Web</span>
                </a>
              </Button>
            )}
          </div>
        )}

        {/* View Details Link */}
        <Link
          href={`/directory/${business.id}`}
          className="flex items-center justify-center gap-1.5 text-blue-600 font-medium text-xs hover:gap-2 transition-all group-hover:text-blue-700"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
