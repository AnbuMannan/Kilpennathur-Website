import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 overflow-hidden">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-10 h-10 text-white opacity-40 mx-auto mb-1" />
                <div className="text-3xl font-bold text-white opacity-50">
                  {event.title.charAt(0)}
                </div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={upcoming ? "default" : "secondary"}
              className={`${upcoming ? "bg-green-500" : "bg-gray-500"} text-xs`}
            >
              {upcoming ? "Upcoming" : "Past"}
            </Badge>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4">
          {/* Date Display */}
          <div className="flex items-center gap-1.5 mb-2 text-purple-600">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">
              {format(new Date(event.date), "MMM dd, yyyy")}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base mb-0.5 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {event.title}
          </h3>

          {/* Tamil Title */}
          {event.titleTamil && (
            <p className="text-gray-600 text-sm mb-1">
              {event.titleTamil}
            </p>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-xs text-gray-700 line-clamp-2 mt-2">
              {event.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center gap-1.5 text-purple-600 font-medium text-xs group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
