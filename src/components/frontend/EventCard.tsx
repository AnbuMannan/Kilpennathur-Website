import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    titleTamil?: string | null;
    description?: string | null;
    date: Date;
    image?: string | null;
  };
}

const isUpcoming = (date: Date) => new Date(date) >= new Date();

export function EventCard({ event }: EventCardProps) {
  const upcoming = isUpcoming(event.date);
  const eventDate = new Date(event.date);
  const monthShort = format(eventDate, "MMM").toUpperCase();
  const dayNum = format(eventDate, "dd");
  const fullDate = format(eventDate, "EEEE, MMM dd, yyyy");
  const time = format(eventDate, "hh:mm a");

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <article
        className={cn(
          "h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          upcoming
            ? "hover:border-purple-300 dark:hover:border-purple-700"
            : "hover:border-gray-300 dark:hover:border-gray-600",
          "group"
        )}
      >
        {/* ── Image Section with Date Tile ── */}
        <div className="relative aspect-video overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                upcoming
                  ? "bg-gradient-to-br from-purple-500 to-violet-600"
                  : "bg-gradient-to-br from-gray-400 to-gray-500"
              )}
            >
              <Calendar className="w-12 h-12 text-white/20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* ── Date Tile — top-left ── */}
          <div className="absolute top-3 left-3 rounded-lg overflow-hidden shadow-lg w-14">
            <div className={cn(
              "py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white",
              upcoming ? "bg-red-600" : "bg-gray-500"
            )}>
              {monthShort}
            </div>
            <div className="bg-white dark:bg-gray-900 py-1 text-center">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-50 leading-none">
                {dayNum}
              </span>
            </div>
          </div>

          {/* Status badge — top-right */}
          <Badge
            className={cn(
              "absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider shadow",
              upcoming
                ? "bg-green-500 hover:bg-green-500 text-white"
                : "bg-gray-100 hover:bg-gray-100 text-gray-600"
            )}
          >
            {upcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-4">
          {/* Title */}
          <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 text-gray-900 dark:text-gray-50 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>

          {/* Tamil Title */}
          {event.titleTamil && (
            <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-1">
              {event.titleTamil}
            </p>
          )}

          {/* Date & Time — prominent with icons */}
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>{fullDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>{time} &middot; Kilpennathur</span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1 min-h-2" />

          {/* Full-width button */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors",
                upcoming
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40"
                  : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
              )}
            >
              {upcoming ? "Register / View" : "View Details"}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
