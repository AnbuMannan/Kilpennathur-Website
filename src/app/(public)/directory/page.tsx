import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/components/frontend/BusinessCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import Pagination from "@/components/frontend/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, SlidersHorizontal } from "lucide-react";
import { DirectoryFilters } from "@/components/frontend/DirectoryFilters";

/** Next.js can pass searchParams values as string | string[]; normalize to string. */
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type SearchParams = {
  category?: string | string[];
  search?: string | string[];
  page?: string | string[];
  sort?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = generateMetadata({
  title: "Business Directory",
  description:
    "Find local businesses, services, and shops in Kilpennathur and surrounding areas. கீழ்பென்னாத்தூரில் உள்ளூர் வணிகங்கள் மற்றும் சேவைகளை கண்டறியுங்கள்.",
  path: "/directory",
  keywords: ["businesses", "local shops", "services", "வணிக அடைவு"],
});

/** Revalidate business directory every 5 minutes */
export const revalidate = 300;

export default async function DirectoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = toStr(params.category).trim() || "all";
  const search = toStr(params.search).trim();
  const page = Math.max(1, parseInt(toStr(params.page) || "1", 10) || 1);
  const sort = toStr(params.sort).trim() || "name-asc";

  const [categories, businessesPerPageSetting] = await Promise.all([
    prisma.category.findMany({
      where: { type: "business" },
      orderBy: { name: "asc" },
    }),
    prisma.siteSetting.findUnique({
      where: { key: "businesses_per_page" },
    }),
  ]);

  const limit = parseInt(businessesPerPageSetting?.value || "12", 10) || 12;

  const categoryBySlug =
    categorySlug && categorySlug !== "all"
      ? await prisma.category.findFirst({
          where: { slug: categorySlug, type: "business" },
        })
      : null;
  const categoryName = categoryBySlug?.name ?? null;

  const where = {
    ...(categoryName
      ? { category: { equals: categoryName, mode: "insensitive" as const } }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              nameTamil: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {}),
  };

  // Sort logic
  let orderBy: Record<string, string> = { name: "asc" };
  if (sort === "name-desc") orderBy = { name: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const [businesses, totalCount, countsByCategory] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.business.count({ where }),
    prisma.business.groupBy({
      by: ["category"],
      _count: { id: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.min(page, totalPages);
  const countByCategoryName = Object.fromEntries(
    countsByCategory.map((r) => [r.category.toLowerCase(), r._count.id])
  );
  const totalBusinesses = countsByCategory.reduce(
    (sum, r) => sum + r._count.id,
    0
  );

  // Data for client filter component
  const categoryData = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: countByCategoryName[c.name.toLowerCase()] ?? 0,
  }));

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('/images/business-hero.jpg')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Building2 className="w-3.5 h-3.5" aria-hidden />
            Business Directory
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            Business Directory
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-indigo-200/80">
            வணிக அடைவு
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Discover local businesses and services in Kilpennathur
          </p>
          <div className="mt-5">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              {totalBusinesses} businesses listed
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: "Business Directory" }]} />

        {/* ── Sidebar + Main Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar — Filters (Desktop: sticky, Mobile: Sheet via client component) */}
          <DirectoryFilters
            categories={categoryData}
            currentCategory={categorySlug}
            currentSort={sort}
            currentSearch={search}
            totalCount={totalBusinesses}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <section className="mb-6" aria-label="Search businesses">
              <form method="get" action="/directory">
                <input type="hidden" name="page" value="1" />
                {categorySlug !== "all" && (
                  <input type="hidden" name="category" value={categorySlug} />
                )}
                {sort !== "name-asc" && (
                  <input type="hidden" name="sort" value={sort} />
                )}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                      aria-hidden
                    />
                    <Input
                      type="search"
                      name="search"
                      defaultValue={search}
                      placeholder="Search businesses..."
                      className="pl-9"
                      aria-label="Search businesses"
                    />
                  </div>
                  <Button type="submit" size="default" className="shrink-0">
                    <Search className="h-4 w-4 mr-1" aria-hidden />
                    Search
                  </Button>
                </div>
              </form>
            </section>

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{totalCount}</span> results
                {categoryName && (
                  <> in <span className="font-semibold text-blue-600">{categoryName}</span></>
                )}
                {search && (
                  <> for &quot;<span className="font-semibold">{search}</span>&quot;</>
                )}
              </p>
            </div>

            {/* Businesses list */}
            <section aria-label="Business list">
              {businesses.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No businesses found"
                  description={
                    search || categorySlug !== "all"
                      ? "Try adjusting your search or category filter."
                      : "Check back later for business listings."
                  }
                  action={{ label: "Clear filters", href: "/directory" }}
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {businesses.map((item) => (
                    <BusinessCard
                      key={item.id}
                      business={{
                        id: item.id,
                        name: item.name,
                        nameTamil: item.nameTamil,
                        category: item.category,
                        phone: item.phone,
                        whatsapp: item.whatsapp,
                        address: item.address,
                        description: item.description,
                        image: item.image,
                        website: item.website,
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Pagination */}
            {businesses.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, totalPages)}
                  basePath="/directory"
                  searchParams={{
                    ...(categorySlug !== "all" && { category: categorySlug }),
                    ...(search && { search }),
                    ...(sort !== "name-asc" && { sort }),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
