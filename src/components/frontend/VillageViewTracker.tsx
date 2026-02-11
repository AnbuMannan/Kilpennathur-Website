"use client";

import { useEffect, useRef } from "react";

interface VillageViewTrackerProps {
  slug: string;
}

export function VillageViewTracker({ slug }: VillageViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/villages/${encodeURIComponent(slug)}/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      // Silently ignore errors (e.g. network)
      tracked.current = false;
    });
  }, [slug]);

  return null;
}
