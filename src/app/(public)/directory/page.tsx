import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/components/frontend/BusinessCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavList, TabsLink } from "@/components/ui/tabs";
import Pagination from "@/components/frontend/Pagination";
import { Search, Building2 } from "lucide-react";

/** Next.js can pass searchParams values as string | string[]; normalize to string. */
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type SearchParams = {
  category?: string | string[];
  search?: string | string[];
  page?: string | string[];
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
    ...(categoryName ? { category: { equals: categoryName, mode: "insensitive" as const } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { nameTamil: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [businesses, totalCount, countsByCategory] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: { name: "asc" },
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
  // Use lowercase keys for case-insensitive matching (business.category may differ in case from Category.name)
  const countByCategoryName = Object.fromEntries(
    countsByCategory.map((r) => [r.category.toLowerCase(), r._count.id])
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/business-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-purple-800/55 to-indigo-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Building2 className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Business Directory</h1>
          <p className="text-xl md:text-2xl mb-2">வணிக அடைவு</p>
          <p className="text-base md:text-lg text-purple-100 text-center max-w-3xl">
            Discover local businesses and services in Kilpennathur
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              {totalCount} businesses listed
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "Business Directory" }]} />

        {/* Search */}
        <section className="mb-6" aria-label="Search businesses">
          <form method="get" action="/directory" className="max-w-2xl">
            <input type="hidden" name="page" value="1" />
            {categorySlug !== "all" && (
              <input type="hidden" name="category" value={categorySlug} />
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
                <Search className="h-4 w-4" aria-hidden />
                Search
              </Button>
            </div>
          </form>
        </section>

        {/* Category Tabs */}
        <section className="mb-8" aria-label="Filter by category">
          <TabsNavList className="w-full justify-start flex">
            <TabsLink
                href="/directory"
                active={categorySlug === "all"}
              >
                All Categories
              </TabsLink>
              {categories.map((c) => (
                <TabsLink
                  key={c.id}
                  href={`/directory?category=${c.slug}`}
                  active={categorySlug === c.slug}
                >
                  {c.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({countByCategoryName[c.name.toLowerCase()] ?? 0})
                  </span>
                </TabsLink>
              ))}
          </TabsNavList>
        </section>

        {/* Businesses grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            basePath="/directory"
            searchParams={{
              ...(categorySlug !== "all" && { category: categorySlug }),
              ...(search && { search }),
            }}
          />
        )}
      </div>
    </div>
  );
}
