"use client";

import { useEffect, useRef } from "react";

interface NewsViewTrackerProps {
  slug: string;
}

export function NewsViewTracker({ slug }: NewsViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/news/${encodeURIComponent(slug)}/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      // Silently ignore errors (e.g. network)
      tracked.current = false;
    });
  }, [slug]);

  return null;
}
