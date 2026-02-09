"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";

const JOB_TYPES = [
  { value: "full-time", label: "Full-time", labelTa: "முழுநேரம்" },
  { value: "part-time", label: "Part-time", labelTa: "பகுதிநேரம்" },
  { value: "contract", label: "Contract", labelTa: "ஒப்பந்தம்" },
  { value: "internship", label: "Internship", labelTa: "பயிற்சி" },
  { value: "temporary", label: "Temporary", labelTa: "தற்காலிகம்" },
];

const CATEGORIES = [
  "Education",
  "Healthcare",
  "Government",
  "Retail",
  "IT",
  "Banking",
  "Agriculture",
  "Manufacturing",
  "Driver",
  "Teacher",
  "General",
];

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTamil = locale === "ta";

  const currentSearch = searchParams.get("q") ?? "";
  const currentTypes = searchParams.getAll("type");
  const currentCategory = searchParams.get("category") ?? "";

  const [search, setSearch] = useState(currentSearch);
  const [showFilters, setShowFilters] = useState(
    currentTypes.length > 0 || !!currentCategory,
  );

  const buildUrl = useCallback(
    (overrides: {
      q?: string;
      types?: string[];
      category?: string;
    }) => {
      const params = new URLSearchParams();

      const q = overrides.q ?? currentSearch;
      if (q) params.set("q", q);

      const types = overrides.types ?? currentTypes;
      types.forEach((t) => params.append("type", t));

      const cat = overrides.category ?? currentCategory;
      if (cat) params.set("category", cat);

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, currentSearch, currentTypes, currentCategory],
  );

  /* Toggle a job type checkbox */
  const toggleType = (type: string) => {
    const next = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    router.push(buildUrl({ types: next }));
  };

  /* Set category */
  const setCategory = (cat: string) => {
    router.push(buildUrl({ category: cat === currentCategory ? "" : cat }));
  };

  /* Search submit */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: search.trim() }));
  };

  /* Clear all filters */
  const clearAll = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentSearch || currentTypes.length > 0 || currentCategory;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isTamil
                ? "வேலைகளை தேடுங்கள்..."
                : "Search jobs by title..."
            }
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="default" size="default">
          {isTamil ? "தேடு" : "Search"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </form>

      {/* Expandable filters */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          {/* Job Type checkboxes */}
          <div>
            <p className="text-sm font-medium mb-2">
              {isTamil ? "வேலை வகை" : "Job Type"}
            </p>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((jt) => {
                const active = currentTypes.includes(jt.value);
                return (
                  <button
                    key={jt.value}
                    type="button"
                    onClick={() => toggleType(jt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {isTamil ? jt.labelTa : jt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-sm font-medium mb-2">
              {isTamil ? "பிரிவு" : "Category"}
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = currentCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active filter summary */}
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
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {currentTypes.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1 capitalize">
              {t}
              <button
                type="button"
                onClick={() => toggleType(t)}
                aria-label={`Remove ${t} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {currentCategory && (
            <Badge variant="secondary" className="gap-1">
              {currentCategory}
              <button
                type="button"
                onClick={() => setCategory("")}
                aria-label="Clear category"
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
