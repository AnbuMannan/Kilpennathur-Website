import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { NewsCard } from "@/components/frontend/NewsCard";
import { BusinessCard } from "@/components/frontend/BusinessCard";
import { VillageCard } from "@/components/frontend/VillageCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Building2, Newspaper, Users, LayoutGrid, Map, UserCircle } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(date);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const village = await prisma.village.findUnique({
    where: { slug },
    select: { name: true, nameTamil: true, description: true },
  });
  if (!village) {
    return { title: "Not Found" };
  }
  return {
    title: `${village.name} - Villages | Kilpennathur`,
    description:
      village.description ?? `${village.name} (${village.nameTamil}) - Village in Kilpennathur area.`,
  };
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : defaultLocale;
}

export default async function VillageDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();

  const village = await prisma.village.findUnique({
    where: { slug },
  });

  if (!village) notFound();

  const hasPresidentInfo = village.presidentName || village.presidentNameTamil;
  const hasStats = village.population || village.totalStreets || village.wardCount;
  const hasOverview = hasPresidentInfo || hasStats;

  const [relatedNews, localBusinesses, relatedVillages] = await Promise.all([
    prisma.news.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: village.name, mode: "insensitive" as const } },
          { content: { contains: village.name, mode: "insensitive" as const } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { author: true },
    }),
    prisma.business.findMany({
      orderBy: { name: "asc" },
      take: 4,
    }),
    prisma.village.findMany({
      where: { id: { not: village.id } },
      orderBy: { name: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Our Villages", href: "/villages" },
            { label: village.name },
          ]}
        />

        {/* Hero Image Section */}
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          {village.image ? (
            <Image
              src={village.image}
              alt={village.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-24 h-24 text-white opacity-30 mx-auto mb-4" />
                <h1 className="text-5xl font-bold text-white mb-2">{village.name}</h1>
                <p className="text-2xl text-white opacity-90">{village.nameTamil}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Hero + Sidebar Layout */}
        <div className={`mb-10 ${hasOverview ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}`}>
          {/* Main Content Column */}
          <div className={hasOverview ? "lg:col-span-2" : ""}>
            {/* Hero */}
            <section className="mb-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3 shrink-0">
                  <MapPin className="h-10 w-10 text-blue-600" aria-hidden />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{village.name}</h1>
                  <p className="mt-1 text-2xl text-gray-600">{village.nameTamil}</p>
                </div>
              </div>
            </section>

            {/* About this Village */}
            {village.description && (
              <section className="mb-8" aria-labelledby="about-heading">
                <Card>
                  <CardHeader>
                    <h2 id="about-heading" className="text-xl font-semibold">
                      About this Village
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-neutral max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: village.description
                          .split("\n\n")
                          .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
                          .join(""),
                      }}
                    />
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Village Overview Sidebar */}
          {hasOverview && (
            <aside className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-blue-600" aria-hidden />
                    Village Overview
                  </h2>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* President Info */}
                  {hasPresidentInfo && (
                    <div className="flex flex-col items-center text-center">
                      {village.presidentImage ? (
                        <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-blue-100 mb-3">
                          <Image
                            src={village.presidentImage}
                            alt={
                              locale === "ta" && village.presidentNameTamil
                                ? village.presidentNameTamil
                                : village.presidentName ?? "Village President"
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center ring-2 ring-blue-100 mb-3">
                          <UserCircle className="h-14 w-14 text-blue-300" aria-hidden />
                        </div>
                      )}
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                        {locale === "ta" ? "கிராம தலைவர்" : "Village President"}
                      </p>
                      {locale === "ta" && village.presidentNameTamil ? (
                        <>
                          <p className="text-base font-semibold text-gray-900">
                            {village.presidentNameTamil}
                          </p>
                          {village.presidentName && (
                            <p className="text-sm text-muted-foreground">
                              {village.presidentName}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {village.presidentName && (
                            <p className="text-base font-semibold text-gray-900">
                              {village.presidentName}
                            </p>
                          )}
                          {village.presidentNameTamil && (
                            <p className="text-sm text-muted-foreground">
                              {village.presidentNameTamil}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Divider between president and stats */}
                  {hasPresidentInfo && hasStats && (
                    <hr className="border-border" />
                  )}

                  {/* Village Statistics Grid */}
                  {hasStats && (
                    <div className="grid grid-cols-2 gap-3">
                      {village.population != null && (
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" aria-hidden />
                          <p className="text-lg font-bold text-gray-900">
                            {village.population.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {locale === "ta" ? "மக்கள் தொகை" : "Population"}
                          </p>
                        </div>
                      )}
                      {village.totalStreets != null && (
                        <div className="rounded-lg bg-emerald-50 p-3 text-center">
                          <Map className="h-5 w-5 text-emerald-600 mx-auto mb-1" aria-hidden />
                          <p className="text-lg font-bold text-gray-900">
                            {village.totalStreets}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {locale === "ta" ? "தெருக்கள்" : "Streets"}
                          </p>
                        </div>
                      )}
                      {village.wardCount != null && (
                        <div className="rounded-lg bg-amber-50 p-3 text-center col-span-2 sm:col-span-1 lg:col-span-2">
                          <LayoutGrid className="h-5 w-5 text-amber-600 mx-auto mb-1" aria-hidden />
                          <p className="text-lg font-bold text-gray-900">
                            {village.wardCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {locale === "ta" ? "வார்டுகள்" : "Wards"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>
          )}
        </div>

        {/* Related News */}
        <section className="mb-10" aria-labelledby="related-news-heading">
          <h2 id="related-news-heading" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Newspaper className="h-7 w-7 text-blue-600" aria-hidden />
            Related News
          </h2>
          {relatedNews.length === 0 ? (
            <p className="text-gray-500 py-6">No news articles found for this village yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <NewsCard
                  key={item.id}
                  news={{
                    id: item.id,
                    title: item.title,
                    titleTamil: item.titleTamil,
                    slug: item.slug,
                    excerpt: item.excerpt,
                    image: item.image,
                    category: item.category,
                    publishedAt: item.publishedAt,
                    views: item.views,
                    author: { name: item.author.name },
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Local Businesses */}
        <section className="mb-10" aria-labelledby="businesses-heading">
          <h2 id="businesses-heading" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="h-7 w-7 text-blue-600" aria-hidden />
            Local Businesses
          </h2>
          {localBusinesses.length === 0 ? (
            <p className="text-gray-500 py-6">No businesses listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {localBusinesses.map((item) => (
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
          <Link
            href="/directory"
            className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            View all businesses →
          </Link>
        </section>

        {/* Quick Facts */}
        <section className="mb-10" aria-labelledby="facts-heading">
          <Card>
            <CardHeader>
              <h2 id="facts-heading" className="text-xl font-semibold">
                Quick Facts
              </h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              {village.population != null && (
                <p>
                  <span className="font-medium text-gray-700">Population:</span>{" "}
                  {village.population.toLocaleString("en-IN")}
                </p>
              )}
              {village.totalStreets != null && (
                <p>
                  <span className="font-medium text-gray-700">Total Streets:</span>{" "}
                  {village.totalStreets}
                </p>
              )}
              {village.wardCount != null && (
                <p>
                  <span className="font-medium text-gray-700">Wards:</span>{" "}
                  {village.wardCount}
                </p>
              )}
              {hasPresidentInfo && (
                <p>
                  <span className="font-medium text-gray-700">President:</span>{" "}
                  {locale === "ta" && village.presidentNameTamil
                    ? village.presidentNameTamil
                    : village.presidentName}
                  {locale !== "ta" && village.presidentNameTamil && (
                    <span className="text-muted-foreground"> ({village.presidentNameTamil})</span>
                  )}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">Listed:</span>{" "}
                {formatDate(village.createdAt)}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Related Villages */}
        {relatedVillages.length > 0 && (
          <section className="mb-10" aria-labelledby="related-villages-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="related-villages-heading" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-7 w-7 text-blue-600" aria-hidden />
                Nearby Villages
              </h2>
              <Link
                href="/villages"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all villages
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedVillages.map((v) => (
                <VillageCard
                  key={v.id}
                  village={{
                    id: v.id,
                    name: v.name,
                    nameTamil: v.nameTamil,
                    slug: v.slug,
                    description: v.description,
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
