import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { NewsCard } from "@/components/frontend/NewsCard";
import { BusinessCard } from "@/components/frontend/BusinessCard";
import { VillageViewTracker } from "@/components/frontend/VillageViewTracker";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  Newspaper,
  Users,
  LayoutGrid,
  Map as MapIcon,
  UserCircle,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  Info,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      village.description ??
      `${village.name} (${village.nameTamil}) - Village in Kilpennathur area.`,
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
      take: 4,
      include: { author: true },
    }),
    prisma.business.findMany({
      orderBy: { name: "asc" },
      take: 6,
    }),
    prisma.village.findMany({
      where: { id: { not: village.id } },
      orderBy: { name: "asc" },
      take: 5,
    }),
  ]);

  // Placeholder data for missing fields
  const pincode = "606611"; // Default Kilpennathur pincode
  const status = "Active Panchayat";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20">
      <VillageViewTracker slug={slug} />

      {/* 1. Immersive Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900 overflow-hidden group">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={village.image || "/images/villages-hero.jpg"} // Fallback image needed
            alt={village.name}
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 container max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center pt-10 md:pt-20">
          <Badge
            variant="outline"
            className="mb-4 text-white border-white/20 bg-white/10 backdrop-blur-sm"
          >
            Village Panchayat
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2 font-serif">
            {village.name}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-bold font-tamil tracking-wide">
            {village.nameTamil}
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* 2. Floating Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatsCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Population"
            value={village.population?.toLocaleString() ?? "N/A"}
            subLabel="Approximate"
          />
          <StatsCard
            icon={<MapIcon className="w-5 h-5 text-emerald-600" />}
            label="Wards"
            value={village.wardCount?.toString() ?? "N/A"}
            subLabel="Constituencies"
          />
          <StatsCard
            icon={<MapPin className="w-5 h-5 text-red-600" />}
            label="Pincode"
            value={pincode}
            subLabel="Postal Code"
          />
          <StatsCard
            icon={<ShieldCheck className="w-5 h-5 text-amber-600" />}
            label="Status"
            value={status}
            subLabel="Verified"
          />
        </div>

        {/* 3. Structured Layout (70/30 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Main Content) - 70% */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="infrastructure"
                  className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400"
                >
                  Infrastructure
                </TabsTrigger>
                <TabsTrigger
                  value="directory"
                  className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400"
                >
                  Local Directory
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400"
                >
                  News
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="flex items-center gap-2">
                      &nbsp;&nbsp;&nbsp;<Info className="w-5 h-5 text-blue-600" />
                      About {village.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white dark:bg-slate-900">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {village.description ? (
                        <p className="leading-relaxed text-lg text-slate-600 dark:text-slate-300">
                          {village.description}
                        </p>
                      ) : (
                        <p className="text-slate-500 italic">
                          No description available for this village yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* President Info Block */}
                {(village.presidentName || village.presidentNameTamil) && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-slate-700 flex items-center gap-6 shadow-sm">
                    <div className="h-20 w-20 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-700 shadow-md">
                      {village.presidentImage ? (
                        <Image
                          src={village.presidentImage}
                          alt="President"
                          width={80}
                          height={80}
                          className="rounded-full object-cover h-full w-full"
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                        Village President
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {village.presidentName || "Name Not Available"}
                      </h3>
                      {village.presidentNameTamil && (
                        <p className="text-lg text-slate-600 dark:text-slate-300 font-tamil mt-1">
                          {village.presidentNameTamil}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="infrastructure" className="mt-6">
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-8 text-center bg-white dark:bg-slate-900">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      Infrastructure Details
                    </h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                      Detailed information about streets, water supply, and public
                      facilities will be updated soon.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                       <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                         <span className="block text-sm text-slate-500">Total Streets</span>
                         <span className="text-xl font-bold text-slate-900 dark:text-white">{village.totalStreets || "N/A"}</span>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                         <span className="block text-sm text-slate-500">Ward Count</span>
                         <span className="text-xl font-bold text-slate-900 dark:text-white">{village.wardCount || "N/A"}</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="directory" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localBusinesses.length > 0 ? (
                    localBusinesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-slate-500">No local businesses listed yet.</p>
                      <Button variant="link" className="mt-2 text-blue-600">
                        Add a Business
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.length > 0 ? (
                    relatedNews.map((item) => (
                      <NewsCard key={item.id} news={item} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-slate-500">No recent news updates for this village.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column (Sidebar) - 30% */}
          <div className="lg:col-span-4 space-y-6">
            {/* Village Administration Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-slate-900 sticky top-24">
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader>
                <CardTitle className="text-lg">&nbsp;Administration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Panchayat Office
                      </p>
                      <p className="text-slate-900 dark:text-white font-medium">
                        Main Road, {village.name}
                        <br />
                        Kilpennathur Taluk
                        <br />
                        Tiruvannamalai - {pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Post Office
                      </p>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {village.name} B.O
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 shadow-md transition-all hover:shadow-lg group">
                    Report an Issue
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-3">
                    Report civic issues directly to the panchayat.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Villages (Mini List) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-slate-500" />
                Nearby Villages
              </h4>
              <ul className="space-y-3">
                {relatedVillages.map((v) => (
                  <li key={v.id}>
                    <Link
                      href={`/villages/${v.slug}`}
                      className="flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">
                        {v.name}
                      </span>
                      <span className="text-xs text-slate-400 font-tamil">
                        {v.nameTamil}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                 <Link href="/villages" className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center">
                    View All Villages
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="fixed bottom-0 right-0 pointer-events-none opacity-[0.03] z-0">
        <MapIcon className="w-96 h-96 text-slate-900 dark:text-white" />
      </div>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  subLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subLabel: string;
}) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
          {value}
        </p>
        <p className="text-[10px] text-slate-400 font-medium">{subLabel}</p>
      </div>
    </div>
  );
}
