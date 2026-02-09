import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface VillageCardProps {
  village: {
    id: string;
    name: string;
    nameTamil: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  };
}

export function VillageCard({ village }: VillageCardProps) {
  return (
    <Link href={`/villages/${village.slug}`} className="block">
      <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-200">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {village.image ? (
            <Image
              src={village.image}
              alt={village.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-white opacity-40 mx-auto mb-1" />
                <div className="text-3xl font-bold text-white opacity-50">
                  {village.name.charAt(0)}
                </div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 mb-1.5 text-teal-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Village</span>
          </div>

          <h3 className="font-bold text-base mb-0.5 group-hover:text-teal-600 transition-colors">
            {village.name}
          </h3>

          <p className="text-gray-600 text-sm mb-1">
            {village.nameTamil}
          </p>

          {village.description && (
            <p className="text-xs text-gray-700 line-clamp-2 mt-2">
              {village.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-3 text-teal-600 font-medium text-xs group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
