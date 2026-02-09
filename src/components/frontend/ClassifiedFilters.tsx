"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const TYPES = [
  { value: "real-estate", en: "Real Estate", ta: "நிலம்/வீடு" },
  { value: "marketplace", en: "Marketplace", ta: "சந்தை" },
  { value: "service", en: "Service", ta: "சேவை" },
];

export function ClassifiedFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTamil = locale === "ta";

  const currentSearch = searchParams.get("q") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";

  const [search, setSearch] = useState(currentSearch);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const buildUrl = useCallback(
    (overrides: {
      q?: string;
      type?: string;
      minPrice?: string;
      maxPrice?: string;
    }) => {
      const params = new URLSearchParams();
      const q = overrides.q ?? currentSearch;
      if (q) params.set("q", q);
      const t = overrides.type !== undefined ? overrides.type : currentType;
      if (t) params.set("type", t);
      const mn =
        overrides.minPrice !== undefined
          ? overrides.minPrice
          : currentMinPrice;
      if (mn) params.set("minPrice", mn);
      const mx =
        overrides.maxPrice !== undefined
          ? overrides.maxPrice
          : currentMaxPrice;
      if (mx) params.set("maxPrice", mx);
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, currentSearch, currentType, currentMinPrice, currentMaxPrice],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: search.trim() }));
  };

  const applyPriceFilter = () => {
    router.push(
      buildUrl({ minPrice: minPrice.trim(), maxPrice: maxPrice.trim() }),
    );
  };

  const clearAll = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentSearch || currentType || currentMinPrice || currentMaxPrice;

  return (
    <div className="space-y-4">
      {/* Search + Type */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTamil
                  ? "விளம்பரங்களை தேடுங்கள்..."
                  : "Search classifieds..."
              }
              className="pl-9"
            />
          </div>
          <Button type="submit">
            {isTamil ? "தேடு" : "Search"}
          </Button>
        </form>

        {/* Type filter pills */}
        <div className="flex gap-2 flex-wrap items-center">
          {TYPES.map((t) => {
            const active = currentType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() =>
                  router.push(
                    buildUrl({
                      type: active ? "" : t.value,
                    }),
                  )
                }
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {isTamil ? t.ta : t.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="flex items-end gap-2 flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            {isTamil ? "குறைந்தபட்ச விலை" : "Min Price"}
          </label>
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="₹0"
            className="w-28"
          />
        </div>
        <span className="pb-2 text-muted-foreground">—</span>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            {isTamil ? "அதிகபட்ச விலை" : "Max Price"}
          </label>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹∞"
            className="w-28"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={applyPriceFilter}
          className="mb-0.5"
        >
          {isTamil ? "வடிகட்டு" : "Filter"}
        </Button>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isTamil ? "வடிகட்டிகள்:" : "Filters:"}
          </span>
          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              &quot;{currentSearch}&quot;
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  router.push(buildUrl({ q: "" }));
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {currentType && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {currentType}
              <button
                type="button"
                onClick={() => router.push(buildUrl({ type: "" }))}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <Badge variant="secondary" className="gap-1">
              ₹{currentMinPrice || "0"} — ₹{currentMaxPrice || "∞"}
              <button
                type="button"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  router.push(buildUrl({ minPrice: "", maxPrice: "" }));
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-blue-600 hover:underline ml-1"
          >
            {isTamil ? "அனைத்தையும் அழி" : "Clear all"}
          </button>
        </div>
      )}
    </div>
  );
}
