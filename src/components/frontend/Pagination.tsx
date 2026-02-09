import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
  pageParamName?: string;
}

function buildPageUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string>,
  pageParamName = "page"
): string {
  const params = new URLSearchParams();
  params.set(pageParamName, String(page));
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v != null && v !== "" && k !== pageParamName) params.set(k, v);
    });
  }
  return `${basePath}?${params.toString()}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  pageParamName = "page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage > 1 ? buildPageUrl(basePath, currentPage - 1, searchParams, pageParamName) : "#";
  const nextHref = currentPage < totalPages ? buildPageUrl(basePath, currentPage + 1, searchParams, pageParamName) : "#";

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800 font-medium"
          aria-disabled
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
          p === currentPage ? (
            <span
              key={p}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-medium"
              aria-current="page"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildPageUrl(basePath, p, searchParams, pageParamName)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {p}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800 font-medium"
          aria-disabled
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
