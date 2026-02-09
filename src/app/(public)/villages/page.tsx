import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VillageCard } from "@/components/frontend/VillageCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import Pagination from "@/components/frontend/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";

/** Next.js can pass searchParams values as string | string[]; normalize to string. */
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type SearchParams = { search?: string | string[]; page?: string | string[] };

type Props = { searchParams: Promise<SearchParams> };

export const metadata: Metadata = generateMetadata({
  title: "Our Villages",
  description:
    "Explore villages in and around Kilpennathur. கீழ்பென்னாத்தூர் மற்றும் சுற்றியுள்ள கிராமங்களை ஆராயுங்கள்.",
  path: "/villages",
  keywords: ["villages", "கிராமங்கள்", "rural areas"],
});

/** Revalidate villages page every 10 minutes */
export const revalidate = 600;

export default async function VillagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = toStr(params.search).trim();
  const page = Math.max(1, parseInt(toStr(params.page) || "1", 10) || 1);

  const villagesPerPageSetting = await prisma.siteSetting.findUnique({
    where: { key: "villages_per_page" },
  });
  const limit = parseInt(villagesPerPageSetting?.value || "15", 10) || 15;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { nameTamil: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [villages, totalCount] = await Promise.all([
    prisma.village.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.village.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const groupedVillages = villages.reduce<Record<string, typeof villages>>(
    (acc, village) => {
      const firstLetter = village.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(village);
      return acc;
    },
    {}
  );

  const letters = Object.keys(groupedVillages).sort();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-green-600 to-emerald-700" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/villages-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-teal-900/50 via-teal-800/55 to-green-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <MapPin className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Villages</h1>
          <p className="text-xl md:text-2xl mb-2">எங்கள் கிராமங்கள்</p>
          <p className="text-base md:text-lg text-teal-100 text-center max-w-3xl">
            Explore villages in and around Kilpennathur and surrounding areas.
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              {totalCount} villages listed
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "Our Villages" }]} />

        {/* Search */}
        <section className="mb-8" aria-label="Search villages">
          <form method="get" action="/villages" className="max-w-2xl">
            <input type="hidden" name="page" value="1" />
            {search && <input type="hidden" name="search" value={search} />}
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
                  placeholder="Search by name (English or Tamil)..."
                  className="pl-9"
                  aria-label="Search villages by name in English or Tamil"
                />
              </div>
              <Button type="submit" size="default" className="shrink-0">
                <Search className="h-4 w-4" aria-hidden />
                Search
              </Button>
            </div>
          </form>
        </section>

        {/* Villages content */}
        {villages.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No villages found"
            description={
              search
                ? "Try a different search term or clear the search."
                : "No villages are listed yet. Check back later."
            }
            action={search ? { label: "Clear search", href: "/villages" } : undefined}
          />
        ) : letters.length > 0 ? (
          /* Alphabetically grouped */
          <section aria-label="Villages by letter">
            {letters.map((letter) => (
              <div key={letter} className="mb-10">
                <h2
                  className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-2 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 mb-4"
                  id={`letter-${letter}`}
                >
                  {letter}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedVillages[letter].map((village) => (
                    <VillageCard
                      key={village.id}
                      village={{
                        id: village.id,
                        name: village.name,
                        nameTamil: village.nameTamil,
                        slug: village.slug,
                        description: village.description,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {/* Pagination */}
        {villages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            basePath="/villages"
            searchParams={search ? { search } : undefined}
          />
        )}
      </div>
    </div>
  );
}
