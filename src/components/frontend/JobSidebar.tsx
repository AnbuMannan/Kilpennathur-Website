"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  X,
  SlidersHorizontal,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Filter constants ---------- */

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
  "Services",
  "Technician",
  "Labor",
  "General",
];

const DATE_POSTED_OPTIONS = [
  { value: "", label: "All Time", labelTa: "அனைத்தும்" },
  { value: "1", label: "Last 24 Hours", labelTa: "கடந்த 24 மணி" },
  { value: "3", label: "Last 3 Days", labelTa: "கடந்த 3 நாட்கள்" },
  { value: "7", label: "Last Week", labelTa: "கடந்த வாரம்" },
  { value: "30", label: "Last Month", labelTa: "கடந்த மாதம்" },
];

/* ---------- Filter Panel (shared between mobile + desktop) ---------- */

interface FilterPanelProps {
  onClose?: () => void;
}

function FilterPanel({ onClose }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTamil = locale === "ta";

  const currentSearch = searchParams.get("q") ?? "";
  const currentTypes = searchParams.getAll("type");
  const currentCategory = searchParams.get("category") ?? "";
  const currentDays = searchParams.get("days") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const buildUrl = useCallback(
    (overrides: {
      q?: string;
      types?: string[];
      category?: string;
      days?: string;
    }) => {
      const params = new URLSearchParams();
      const q = overrides.q ?? currentSearch;
      if (q) params.set("q", q);
      const types = overrides.types ?? currentTypes;
      types.forEach((t) => params.append("type", t));
      const cat = overrides.category ?? currentCategory;
      if (cat) params.set("category", cat);
      const days = overrides.days ?? currentDays;
      if (days) params.set("days", days);
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, currentSearch, currentTypes, currentCategory, currentDays]
  );

  const toggleType = (type: string) => {
    const next = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    router.push(buildUrl({ types: next }));
    onClose?.();
  };

  const setCategory = (cat: string) => {
    router.push(buildUrl({ category: cat === currentCategory ? "" : cat }));
    onClose?.();
  };

  const setDays = (days: string) => {
    router.push(buildUrl({ days }));
    onClose?.();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: search.trim() }));
    onClose?.();
  };

  const clearAll = () => {
    setSearch("");
    router.push(pathname);
    onClose?.();
  };

  const hasActiveFilters =
    currentSearch || currentTypes.length > 0 || currentCategory || currentDays;

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTamil ? "வேலைகளை தேடுங்கள்..." : "Search jobs..."}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Button type="submit" size="sm" className="h-9">
          <Search className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* Job Type */}
      <div>
        <h3 className="font-serif font-bold text-xs text-gray-900 dark:text-gray-50 mb-3 uppercase tracking-wider">
          {isTamil ? "வேலை வகை" : "Job Type"}
        </h3>
        <div className="space-y-1">
          {JOB_TYPES.map((jt) => {
            const active = currentTypes.includes(jt.value);
            return (
              <button
                key={jt.value}
                type="button"
                onClick={() => toggleType(jt.value)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left",
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                    active
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {active && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span>{isTamil ? jt.labelTa : jt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-serif font-bold text-xs text-gray-900 dark:text-gray-50 mb-3 uppercase tracking-wider">
          {isTamil ? "பிரிவு" : "Category"}
        </h3>
        <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const active = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div>
        <h3 className="font-serif font-bold text-xs text-gray-900 dark:text-gray-50 mb-3 uppercase tracking-wider">
          {isTamil ? "வெளியிட்ட நாள்" : "Date Posted"}
        </h3>
        <div className="space-y-0.5">
          {DATE_POSTED_OPTIONS.map((opt) => {
            const active = currentDays === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDays(opt.value)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {isTamil ? opt.labelTa : opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {isTamil ? "அனைத்தையும் அழி" : "Clear all filters"}
        </button>
      )}

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {currentSearch && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              &quot;{currentSearch}&quot;
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  router.push(buildUrl({ q: "" }));
                  onClose?.();
                }}
                aria-label="Clear search"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          )}
          {currentTypes.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="gap-1 text-[10px] capitalize"
            >
              {t}
              <button
                type="button"
                onClick={() => toggleType(t)}
                aria-label={`Remove ${t}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          ))}
          {currentCategory && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              {currentCategory}
              <button
                type="button"
                onClick={() => setCategory("")}
                aria-label="Clear category"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Post a Job CTA */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
        <Megaphone className="w-8 h-8 mb-3 opacity-80" />
        <h3 className="font-serif font-bold text-base mb-1.5">
          {isTamil ? "வேலை வாய்ப்பு உள்ளதா?" : "Hiring?"}
        </h3>
        <p className="text-xs text-blue-100 leading-relaxed mb-4">
          {isTamil
            ? "இலவசமாக வேலை விளம்பரம் போட்டு ஆயிரக்கணக்கான குடிமக்களை சென்றடையுங்கள்."
            : "Post a job for free to reach thousands of Kilpennathur residents."}
        </p>
        <Button
          size="sm"
          variant="secondary"
          className="w-full gap-1.5 font-semibold"
          asChild
        >
          <Link href="/contact">
            {isTamil ? "வேலை போடுங்கள்" : "Post a Job"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ---------- Main Export ---------- */

export function JobSidebar() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isTamil = locale === "ta";
  const searchParams = useSearchParams();
  const currentTypes = searchParams.getAll("type");
  const currentCategory = searchParams.get("category") ?? "";
  const currentDays = searchParams.get("days") ?? "";
  const filterCount =
    currentTypes.length +
    (currentCategory ? 1 : 0) +
    (currentDays ? 1 : 0);

  return (
    <>
      {/* Mobile: Sheet trigger */}
      <div className="lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {isTamil ? "வடிகட்டிகள்" : "Filters"}
              {filterCount > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-[10px]">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-serif">
                {isTamil ? "வடிகட்டிகள்" : "Filters"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel onClose={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sticky sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <h2 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-50">
                {isTamil ? "வடிகட்டிகள்" : "Filters"}
              </h2>
            </div>
            <FilterPanel />
          </div>
        </div>
      </aside>
    </>
  );
}
