import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { ClassifiedCard } from "@/components/frontend/ClassifiedCard";
import { ClassifiedFilters } from "@/components/frontend/ClassifiedFilters";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

/* ---------- Locale helper ---------- */

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const val = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(val as Locale) ? (val as Locale) : defaultLocale;
}

/* ---------- Metadata ---------- */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isTamil = locale === "ta";

  const title = isTamil
    ? "விளம்பரங்கள் - கீழ்பென்னாத்தூர்"
    : "Buy, Sell, Rent in Kilpennathur";
  const description = isTamil
    ? "கிள்பெண்ணாத்தூரில் வாங்க, விற்க, வாடகைக்கு - நிலம், வீடு, பொருட்கள், சேவைகள்"
    : "Buy, sell, rent properties, goods and services in Kilpennathur and surrounding areas.";

  return {
    title: `${title} - Kilpennathur Community Portal`,
    description,
    keywords: [
      "classifieds",
      "விளம்பரங்கள்",
      "buy sell",
      "real estate",
      "Kilpennathur",
      "marketplace",
    ],
    openGraph: { title, description },
  };
}

/* ---------- Revalidate ---------- */

export const revalidate = 300;

/* ---------- Page ---------- */

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function ClassifiedsPage({ searchParams }: Props) {
  const locale = await getLocale();
  const isTamil = locale === "ta";
  const params = await searchParams;

  const searchQuery = typeof params.q === "string" ? params.q.trim() : "";
  const typeFilter =
    typeof params.type === "string" ? params.type.trim() : "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "published" };

  if (typeFilter) where.type = typeFilter;

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { titleTamil: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (minPrice != null && !Number.isNaN(minPrice)) {
    where.price = { ...where.price, gte: minPrice };
  }
  if (maxPrice != null && !Number.isNaN(maxPrice)) {
    where.price = { ...where.price, lte: maxPrice };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifieds: any[] = await (prisma as any).classified.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden />
            {isTamil ? "விளம்பரங்கள்" : "Marketplace"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            {isTamil ? "கீழ்பென்னாத்தூர் விளம்பரங்கள்" : "Kilpennathur Classifieds"}
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-rose-200/80">
            {isTamil ? "Kilpennathur Classifieds" : "கீழ்பென்னாத்தூர் விளம்பரங்கள்"}
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            {isTamil
              ? "நிலம், வீடு, பொருட்கள், சேவைகள் - வாங்க, விற்க, வாடகைக்கு"
              : "Buy, sell, rent — land, houses, goods, and services"}
          </p>
          <div className="mt-5">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              {classifieds.length}{" "}
              {isTamil ? "விளம்பரங்கள்" : "listings"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            {
              label: isTamil ? "விளம்பரங்கள்" : "Classifieds",
            },
          ]}
        />

        {/* ── Filters ── */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <ClassifiedFilters />
          </Suspense>
        </div>

        {/* ── Results count ── */}
        {classifieds.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {classifieds.length}
            </span>{" "}
            {isTamil ? "விளம்பரங்கள்" : "listings"}
          </p>
        )}

        {classifieds.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={
              isTamil
                ? "விளம்பரங்கள் எதுவும் கிடைக்கவில்லை"
                : "No listings found"
            }
            description={
              searchQuery || typeFilter || minPrice || maxPrice
                ? isTamil
                  ? "உங்கள் வடிகட்டிகளுக்கு பொருந்தக்கூடிய விளம்பரங்கள் இல்லை."
                  : "No listings match your current filters. Try adjusting your search."
                : isTamil
                  ? "தற்போது விளம்பரங்கள் எதுவும் பதிவு செய்யப்படவில்லை."
                  : "No listings are available at the moment. Check back later."
            }
          />
        ) : (
          <section aria-label="Classified listings">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {classifieds.map((c: any) => (
                <ClassifiedCard
                  key={c.id}
                  classified={{
                    id: c.id,
                    type: c.type,
                    category: c.category,
                    title: c.title,
                    titleTamil: c.titleTamil,
                    description: c.description,
                    descriptionTamil: c.descriptionTamil,
                    price: c.price,
                    priceLabel: c.priceLabel,
                    contactName: c.contactName,
                    contactPhone: c.contactPhone,
                    location: c.location,
                    images: c.images,
                    isFeatured: c.isFeatured,
                    createdAt: c.createdAt,
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
