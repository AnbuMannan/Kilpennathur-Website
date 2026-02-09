"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFICIARY_TYPES = [
  { value: "Farmers", labelTa: "விவசாயிகள்", emoji: "🌾" },
  { value: "Students", labelTa: "மாணவர்கள்", emoji: "🎓" },
  { value: "Women", labelTa: "பெண்கள்", emoji: "👩" },
  { value: "Senior Citizens", labelTa: "மூத்த குடிமக்கள்", emoji: "👴" },
  { value: "SC/ST", labelTa: "SC/ST", emoji: "🏘" },
  { value: "BPL Families", labelTa: "BPL குடும்பங்கள்", emoji: "🏠" },
  { value: "Differently Abled", labelTa: "மாற்றுத்திறனாளிகள்", emoji: "♿" },
  { value: "General", labelTa: "பொது", emoji: "👥" },
  { value: "Health", labelTa: "சுகாதாரம்", emoji: "🏥" },
];

const SPONSORS = [
  { value: "Central Govt", labelTa: "மத்திய அரசு" },
  { value: "State Govt", labelTa: "மாநில அரசு" },
  { value: "District", labelTa: "மாவட்டம்" },
  { value: "Other", labelTa: "பிற" },
];

export function SchemeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTamil = locale === "ta";

  const currentSearch = searchParams.get("q") ?? "";
  const currentBeneficiary = searchParams.get("beneficiary") ?? "";
  const currentSponsor = searchParams.get("sponsor") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const buildUrl = useCallback(
    (overrides: { q?: string; beneficiary?: string; sponsor?: string }) => {
      const params = new URLSearchParams();

      const q = overrides.q ?? currentSearch;
      if (q) params.set("q", q);

      const ben =
        overrides.beneficiary !== undefined
          ? overrides.beneficiary
          : currentBeneficiary;
      if (ben) params.set("beneficiary", ben);

      const sp =
        overrides.sponsor !== undefined
          ? overrides.sponsor
          : currentSponsor;
      if (sp) params.set("sponsor", sp);

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, currentSearch, currentBeneficiary, currentSponsor]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: search.trim() }));
  };

  const clearAll = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentSearch || currentBeneficiary || currentSponsor;

  return (
    <div className="space-y-5">
      {/* ── Search bar ── */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isTamil
                ? "திட்டங்களை தேடுங்கள்..."
                : "Search schemes..."
            }
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="default" size="default">
          {isTamil ? "தேடு" : "Search"}
        </Button>
      </form>

      {/* ── Beneficiary Pill Tabs (horizontal scrollable) ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {isTamil ? "பயனாளி வகை" : "Beneficiary Type"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(buildUrl({ beneficiary: "" }))}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              !currentBeneficiary
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
            )}
          >
            {isTamil ? "அனைத்தும்" : "All"}
          </button>
          {BENEFICIARY_TYPES.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() =>
                router.push(
                  buildUrl({
                    beneficiary:
                      currentBeneficiary === b.value ? "" : b.value,
                  })
                )
              }
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                currentBeneficiary === b.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
              )}
            >
              <span className="text-xs">{b.emoji}</span>
              {isTamil ? b.labelTa : b.value}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sponsor filter row ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {isTamil ? "ஆதரவாளர்" : "Sponsor"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(buildUrl({ sponsor: "" }))}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              !currentSponsor
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300"
            )}
          >
            {isTamil ? "அனைத்தும்" : "All"}
          </button>
          {SPONSORS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() =>
                router.push(
                  buildUrl({
                    sponsor: currentSponsor === s.value ? "" : s.value,
                  })
                )
              }
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                currentSponsor === s.value
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300"
              )}
            >
              {isTamil ? s.labelTa : s.value}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active filters ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">
            {isTamil ? "வடிகட்டிகள்:" : "Active:"}
          </span>
          {currentSearch && (
            <Badge variant="secondary" className="gap-1 text-xs">
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
          {currentBeneficiary && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {currentBeneficiary}
              <button
                type="button"
                onClick={() =>
                  router.push(buildUrl({ beneficiary: "" }))
                }
                aria-label="Clear beneficiary filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {currentSponsor && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {currentSponsor}
              <button
                type="button"
                onClick={() => router.push(buildUrl({ sponsor: "" }))}
                aria-label="Clear sponsor filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-red-600 hover:underline ml-1 font-medium"
          >
            {isTamil ? "அனைத்தையும் அழி" : "Clear all"}
          </button>
        </div>
      )}
    </div>
  );
}
