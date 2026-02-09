import Image from "next/image";
import { Mail } from "lucide-react";

export function ContactHero() {
  return (
    <div className="relative h-64 md:h-80 mb-12 rounded-2xl overflow-hidden">
      {/* Background: gradient fallback + pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700"
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
        src="/images/contact-hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />

      {/* Glossy overlay 50-60% - lets image show through */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-teal-800/55 to-blue-900/50 backdrop-blur-[1px]"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <Mail className="w-12 h-12 mb-3 animate-pulse" aria-hidden />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-xl md:text-2xl mb-2">எங்களை தொடர்பு கொள்ளுங்கள்</p>
        <p className="text-base md:text-lg text-green-100 text-center max-w-2xl">
          Have questions or feedback? We&apos;d love to hear from you. Send us a
          message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-10 right-10 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
