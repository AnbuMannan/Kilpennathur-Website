import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventsHeroProps {
  upcomingCount: number;
  pastCount: number;
}

export function EventsHero({ upcomingCount, pastCount }: EventsHeroProps) {
  return (
    <div className="relative h-64 md:h-80 mb-12 rounded-2xl overflow-hidden">
      {/* Background: gradient fallback + pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
          aria-hidden
        />
      </div>
      {/* Hero image */}
      <Image
        src="/images/events-hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />

      {/* Glossy overlay 50-60% - lets image show through */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-orange-900/50 via-pink-800/55 to-purple-900/50 backdrop-blur-[1px]"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <Calendar className="w-12 h-12 mb-3 animate-pulse" aria-hidden />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Events</h1>
        <p className="text-xl md:text-2xl mb-2">நிகழ்வுகள்</p>
        <p className="text-base md:text-lg text-orange-100 text-center">
          Upcoming and past events in Kilpennathur and surrounding areas.
        </p>
        <div className="mt-3 flex gap-3">
          <Badge variant="secondary" className="text-base px-3 py-1.5">
            {upcomingCount} upcoming
          </Badge>
          <Badge variant="outline" className="text-base px-3 py-1.5 border-white text-white">
            {pastCount} past
          </Badge>
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
