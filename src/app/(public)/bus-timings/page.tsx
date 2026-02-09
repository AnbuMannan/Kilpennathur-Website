import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, Search, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

/* ---------- Locale helper ---------- */

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value ?? "";
  if (locales.includes(raw as Locale)) return raw as Locale;
  return defaultLocale;
}

/* ---------- SEO ---------- */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isTamil = locale === "ta";

  return {
    title: isTamil
      ? "பேருந்து நேரம் | கீழ்பென்னாத்தூர்"
      : "Bus Timings | Kilpennathur",
    description: isTamil
      ? "கீழ்பென்னாத்தூர் பேருந்து நேரங்கள் மற்றும் வழித்தடங்கள்"
      : "Bus timings and routes from Kilpennathur to nearby towns",
  };
}

/* ---------- Bus type colors ---------- */

const busTypeConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Town Bus": { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  Private: { bg: "bg-orange-50 dark:bg-orange-950", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  SETC: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  "SETC AC": { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  "SETC Ultra Deluxe": { bg: "bg-teal-50 dark:bg-teal-950", text: "text-teal-700 dark:text-teal-400", dot: "bg-teal-500" },
  Express: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
  Mofussil: { bg: "bg-cyan-50 dark:bg-cyan-950", text: "text-cyan-700 dark:text-cyan-400", dot: "bg-cyan-500" },
  Interstate: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  "Mini Bus": { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
};

const defaultBusConfig = { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", dot: "bg-gray-500" };

/* ---------- Page ---------- */

type SearchParams = { search?: string | string[]; type?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function BusTimingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();
  const busTypeFilter = toStr(params.type).trim();
  const locale = await getLocale();
  const isTamil = locale === "ta";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { AND: [] };

  if (search) {
    where.AND.push({
      OR: [
        { route: { contains: search, mode: "insensitive" } },
        { routeTamil: { contains: search, mode: "insensitive" } },
        { busNumber: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (busTypeFilter) {
    where.AND.push({ busType: busTypeFilter });
  }

  if (where.AND.length === 0) delete where.AND;

  const busTimings = await prisma.busTiming.findMany({
    where: where.AND ? where : {},
    orderBy: { departureTime: "asc" },
  });

  const allBusTypes = await prisma.busTiming.findMany({
    select: { busType: true },
    distinct: ["busType"],
    orderBy: { busType: "asc" },
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Bus className="w-3.5 h-3.5" aria-hidden />
            {isTamil ? "பேருந்து நேரம்" : "Bus Timings"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            {isTamil ? "பேருந்து நேரம்" : "Bus Timings"}
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-blue-200/80">
            {isTamil ? "Bus Timings" : "பேருந்து நேரம்"}
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            {isTamil
              ? "கீழ்பென்னாத்தூரிலிருந்து அருகிலுள்ள நகரங்களுக்கான பேருந்து நேரங்கள்"
              : "Bus schedules from Kilpennathur to nearby towns and cities"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: isTamil ? "பேருந்து நேரம்" : "Bus Timings" }]} />

        {/* ── Search ── */}
        <section className="mb-6">
          <form
            method="get"
            action="/bus-timings"
            className="flex gap-2 max-w-2xl"
          >
            {busTypeFilter && (
              <input type="hidden" name="type" value={busTypeFilter} />
            )}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                aria-hidden
              />
              <Input
                type="search"
                name="search"
                defaultValue={search}
                placeholder={
                  isTamil
                    ? "வழித்தடம் அல்லது பேருந்து எண் தேடுக..."
                    : "Search route or bus number..."
                }
                className="pl-9"
                aria-label={isTamil ? "பேருந்துகளை தேடுக" : "Search bus timings"}
              />
            </div>
            <Button type="submit" size="default">
              {isTamil ? "தேடு" : "Search"}
            </Button>
          </form>
        </section>

        {/* ── Bus Type Pills ── */}
        {allBusTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={
                search
                  ? `/bus-timings?search=${encodeURIComponent(search)}`
                  : "/bus-timings"
              }
              className={cn(
                "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                !busTypeFilter
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
              )}
            >
              {isTamil ? "அனைத்தும்" : "All"}
            </a>
            {allBusTypes.map((bt) => {
              const conf = busTypeConfig[bt.busType] ?? defaultBusConfig;
              return (
                <a
                  key={bt.busType}
                  href={
                    search
                      ? `/bus-timings?search=${encodeURIComponent(search)}&type=${encodeURIComponent(bt.busType)}`
                      : `/bus-timings?type=${encodeURIComponent(bt.busType)}`
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    busTypeFilter === bt.busType
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", conf.dot)} />
                  {bt.busType}
                </a>
              );
            })}
          </div>
        )}

        {/* ── Results ── */}
        {busTimings.length === 0 ? (
          <div className="text-center py-16">
            <Bus className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {isTamil ? "பேருந்துகள் எதுவும் இல்லை" : "No bus timings found"}
            </p>
            {search && (
              <a
                href="/bus-timings"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                {isTamil ? "வடிகட்டிகளை அழிக்கவும்" : "Clear filters"}
              </a>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {busTimings.length} {isTamil ? "பேருந்துகள்" : "bus timings"}
            </p>
            <div className="space-y-3">
              {busTimings.map((b) => {
                const conf = busTypeConfig[b.busType] ?? defaultBusConfig;
                const displayRoute =
                  isTamil && b.routeTamil ? b.routeTamil : b.route;
                const altRoute =
                  isTamil && b.routeTamil ? b.route : b.routeTamil;

                return (
                  <article
                    key={b.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                      "border-l-4 transition-all hover:shadow-md",
                      conf.bg
                    )}
                    style={{ borderLeftColor: conf.dot.replace("bg-", "").includes("blue") ? "#3b82f6" : undefined }}
                  >
                    {/* Left — Departure time */}
                    <div className="sm:w-28 shrink-0 text-center sm:text-left">
                      <p className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-50 leading-none">
                        {b.departureTime}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 font-semibold">
                        {isTamil ? "புறப்படும் நேரம்" : "Departure"}
                      </p>
                    </div>

                    {/* Separator */}
                    <div className="hidden sm:block w-px h-12 bg-gray-200 dark:bg-gray-700 mx-1" />

                    {/* Center — Route info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Kilpennathur</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-50 truncate">
                          {displayRoute}
                        </span>
                      </div>
                      {altRoute && (
                        <p className="font-tamil text-xs text-gray-500 dark:text-gray-400 leading-relaxed ml-5">
                          {altRoute}
                        </p>
                      )}
                      {b.busNumber && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 ml-5 mt-0.5">
                          <span className="font-medium">{isTamil ? "பேருந்து எண்" : "Bus No"}:</span> {b.busNumber}
                        </p>
                      )}
                    </div>

                    {/* Right — Type badge */}
                    <div className="shrink-0 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold border-0",
                          conf.bg,
                          conf.text
                        )}
                      >
                        <Bus className="w-3 h-3 mr-1" />
                        {b.busType}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        Daily
                      </Badge>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
