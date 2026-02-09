import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, LayoutGrid, UserCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VillageCardProps {
  village: {
    id: string;
    name: string;
    nameTamil: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    population?: number | null;
    wardCount?: number | null;
    presidentName?: string | null;
    presidentNameTamil?: string | null;
    totalStreets?: number | null;
  };
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
          {label}
        </p>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export function VillageCard({ village }: VillageCardProps) {
  const hasStats =
    village.population || village.wardCount || village.presidentName || village.totalStreets;

  return (
    <Link href={`/villages/${village.slug}`} className="block h-full">
      <article
        className={cn(
          "h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-teal-300 dark:hover:border-teal-700",
          "group"
        )}
      >
        {/* ── Header — image or gradient placeholder ── */}
        <div className="relative h-36 overflow-hidden">
          {village.image ? (
            <Image
              src={village.image}
              alt={village.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-white/30" />
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Village name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3
              className="font-serif font-bold text-lg text-white leading-tight line-clamp-1"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {village.name}
            </h3>
            <p
              className="font-tamil text-sm text-white/80 leading-relaxed"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              {village.nameTamil}
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-4">
          {/* Description */}
          {village.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-3">
              {village.description}
            </p>
          )}

          {/* Stats grid */}
          {hasStats && (
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {village.population != null && village.population > 0 && (
                <StatItem icon={Users} label="Population" value={village.population.toLocaleString()} />
              )}
              {village.wardCount != null && village.wardCount > 0 && (
                <StatItem icon={LayoutGrid} label="Wards" value={village.wardCount} />
              )}
              {village.presidentName && (
                <StatItem
                  icon={UserCircle}
                  label="President"
                  value={village.presidentNameTamil || village.presidentName}
                />
              )}
              {village.totalStreets != null && village.totalStreets > 0 && (
                <StatItem icon={MapPin} label="Streets" value={village.totalStreets} />
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Full-width View Details button */}
          <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-semibold group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
