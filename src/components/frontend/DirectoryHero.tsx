import Image from "next/image";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DirectoryHeroProps {
  totalCount: number;
}

export function DirectoryHero({ totalCount }: DirectoryHeroProps) {
  return (
    <div className="relative h-64 md:h-80 mb-12 rounded-2xl overflow-hidden">
      {/* Background: gradient fallback + pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 20px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
      </div>
      {/* Hero image */}
      <Image
        src="/images/business-hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />

      {/* Glossy overlay 50-60% - lets image show through */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-purple-800/55 to-indigo-900/50 backdrop-blur-[1px]"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <Building2 className="w-12 h-12 mb-3 animate-pulse" aria-hidden />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Business Directory</h1>
        <p className="text-xl md:text-2xl mb-2">வணிக அடைவு</p>
        <p className="text-base md:text-lg text-purple-100 text-center">
          Discover local businesses and services in Kilpennathur
        </p>
        <div className="mt-3">
          <Badge variant="secondary" className="text-base px-4 py-1.5">
            {totalCount} businesses listed
          </Badge>
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
