"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface CategoryItem {
  slug: string;
  name: string;
  count: number;
}

interface DirectoryFiltersProps {
  categories: CategoryItem[];
  currentCategory: string;
  currentSort: string;
  currentSearch: string;
  totalCount: number;
}

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "newest", label: "Newest First" },
];

function FilterPanel({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
  totalCount,
  onClose,
}: DirectoryFiltersProps & { onClose?: () => void }) {
  const router = useRouter();

  const buildUrl = (overrides: {
    category?: string;
    sort?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    const cat = overrides.category ?? currentCategory;
    if (cat && cat !== "all") params.set("category", cat);

    const s = overrides.sort ?? currentSort;
    if (s && s !== "name-asc") params.set("sort", s);

    const q = overrides.search ?? currentSearch;
    if (q) params.set("search", q);

    const qs = params.toString();
    return qs ? `/directory?${qs}` : "/directory";
  };

  const handleCategory = (slug: string) => {
    router.push(buildUrl({ category: slug }));
    onClose?.();
  };

  const handleSort = (value: string) => {
    router.push(buildUrl({ sort: value }));
    onClose?.();
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-50 mb-3 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleCategory("all")}
            className={cn(
              "w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors",
              currentCategory === "all"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <span>All Categories</span>
            <span className="text-xs text-gray-400">{totalCount}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => handleCategory(c.slug)}
              className={cn(
                "w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors",
                currentCategory === c.slug
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <span className="truncate">{c.name}</span>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-50 mb-3 uppercase tracking-wider">
          Sort By
        </h3>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSort(opt.value)}
              className={cn(
                "w-full flex items-center py-2 px-3 rounded-lg text-sm transition-colors",
                currentSort === opt.value
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {(currentCategory !== "all" ||
        currentSort !== "name-asc" ||
        currentSearch) && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            router.push("/directory");
            onClose?.();
          }}
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export function DirectoryFilters(props: DirectoryFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Mobile: Sheet trigger button ── */}
      <div className="lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters & Sort
              {props.currentCategory !== "all" && (
                <span className="ml-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-serif">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel {...props} onClose={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Desktop: Sticky sidebar ── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <h2 className="font-serif font-bold text-sm text-gray-900 dark:text-gray-50">
              Filters
            </h2>
          </div>
          <FilterPanel {...props} />
        </div>
      </aside>
    </>
  );
}
