import Image from "next/image";
import { BookOpen } from "lucide-react";

export function HistoryHero() {
  return (
    <div className="relative h-80 md:h-96 mb-16 rounded-2xl overflow-hidden">
      {/* Background: gradient fallback + pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
      </div>
      {/* Hero image */}
      <Image
        src="/images/history-hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />

      {/* Glossy overlay 50-60% - lets image show through */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-amber-900/50 via-orange-800/55 to-red-900/50 backdrop-blur-[1px]"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-full mb-4 shadow-2xl">
          <BookOpen className="w-12 h-12 text-white" aria-hidden />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          History of Kilpennathur
        </h1>
        <p className="text-2xl md:text-3xl mb-2">கில்பென்னாத்தூர் வரலாறு</p>
        <p className="text-lg md:text-xl text-amber-100 max-w-3xl text-center">
          A journey through time - Exploring the rich heritage and cultural
          legacy of our community
        </p>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
