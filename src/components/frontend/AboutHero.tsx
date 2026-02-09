import Image from "next/image";
import { Users } from "lucide-react";

export function AboutHero() {
  return (
    <div className="relative h-80 md:h-96 mb-16 rounded-2xl overflow-hidden">
      {/* Background: gradient fallback + pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          aria-hidden
        />
      </div>
      {/* Hero image */}
      <Image
        src="/images/about-hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />

      {/* Glossy overlay 50-60% - lets image show through */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-blue-800/55 to-purple-900/50 backdrop-blur-[1px]"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <Users className="w-16 h-16 mb-4 animate-pulse" aria-hidden />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">About Kilpennathur</h1>
        <p className="text-2xl md:text-3xl mb-2">கீழ்பென்னாத்தூரை பற்றி</p>
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl text-center">
          Your trusted source for community news, business directory, and local
          information
        </p>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
