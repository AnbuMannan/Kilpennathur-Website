"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function FallbackImage({
  src,
  alt,
  fill,
  className,
  sizes,
}: FallbackImageProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setHidden(true)}
    />
  );
}
