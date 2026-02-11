"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Slide {
  id: string;
  title: string;
  titleTamil: string;
  description: string;
  image: string;
  link: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[600px] flex items-center justify-center text-center px-4 overflow-hidden group">
        {/* 1. Background Image */}
        <Image
          src="/images/hero-bg.jpg" // Make sure this image exists in public/images/
          alt="Kilpennathur scenic view"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority // Loads image immediately for better performance
        />
        {/* 2. Dark Overlay (Crucial for text readability) */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* 3. Main Content (kept relative to sit on top) */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl space-y-4">
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            Welcome to Kilpennathur
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-blue-100">கீழ்பென்னாத்தூர் வரவேற்கிறது</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[500px] md:h-[600px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.image ? (
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={index === 0}
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
          )}

          <div className="absolute inset-0 bg-black/60 z-0" />

          <div className="absolute inset-0 flex items-center z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
              <div className="max-w-2xl space-y-4">
                <h2
                  className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  {slide.title}
                </h2>
                <p
                  className="text-2xl md:text-3xl text-blue-100 font-medium"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
                >
                  {slide.titleTamil}
                </p>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                  {slide.description}
                </p>
                <Link href={slide.link}>
                  <Button size="lg" className="mt-2">Read More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
