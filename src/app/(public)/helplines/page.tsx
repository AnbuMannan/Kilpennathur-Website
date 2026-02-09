import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { locales, defaultLocale, type Locale } from "@/i18n";
import {
  Phone,
  Siren,
  Stethoscope,
  Zap,
  Droplets,
  Building,
  Flame,
  Ambulance as AmbulanceIcon,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
      ? "அவசர எண்கள் | கீழ்பென்னாத்தூர்"
      : "Emergency Helplines | Kilpennathur",
    description: isTamil
      ? "கீழ்பென்னாத்தூர் அவசர எண்கள் மற்றும் முக்கிய தொடர்பு எண்கள்"
      : "Emergency helpline numbers and important contacts for Kilpennathur",
  };
}

/* ---------- Category config ---------- */

type CategoryConfig = {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  labelTa: string;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Emergency: {
    icon: Siren,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Emergency",
    labelTa: "அவசரம்",
  },
  Medical: {
    icon: Stethoscope,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    label: "Medical",
    labelTa: "மருத்துவம்",
  },
  EB: {
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    label: "Electricity Board",
    labelTa: "மின்சார வாரியம்",
  },
  Water: {
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    label: "Water Supply",
    labelTa: "குடிநீர்",
  },
  Panchayat: {
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
    label: "Panchayat",
    labelTa: "பஞ்சாயத்து",
  },
  Fire: {
    icon: Flame,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
    label: "Fire Station",
    labelTa: "தீயணைப்பு",
  },
  Ambulance: {
    icon: AmbulanceIcon,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
    label: "Ambulance",
    labelTa: "ஆம்புலன்ஸ்",
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  icon: Phone,
  color: "text-gray-600",
  bgColor: "bg-gray-50 dark:bg-gray-950",
  borderColor: "border-gray-200 dark:border-gray-800",
  label: "Other",
  labelTa: "பிற",
};

/* ---------- Quick Dial numbers ---------- */

const QUICK_DIAL = [
  { label: "Police", labelTa: "காவல்துறை", number: "100", color: "bg-red-600 hover:bg-red-700", icon: ShieldAlert },
  { label: "Ambulance", labelTa: "ஆம்புலன்ஸ்", number: "108", color: "bg-red-600 hover:bg-red-700", icon: AmbulanceIcon },
  { label: "Fire", labelTa: "தீயணைப்பு", number: "101", color: "bg-orange-600 hover:bg-orange-700", icon: Flame },
];

/* ---------- Page ---------- */

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function HelplinesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string | string[] }>;
}) {
  const locale = await getLocale();
  const isTamil = locale === "ta";
  const params = searchParams ? await searchParams : {};
  const search = toStr(params.search).trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { titleTamil: { contains: search, mode: "insensitive" } },
      { number: { contains: search, mode: "insensitive" } },
    ];
  }

  const helplines = await prisma.helpline.findMany({
    where,
    orderBy: { category: "asc" },
  });

  // Group by category
  const grouped = helplines.reduce<Record<string, typeof helplines>>(
    (acc, h) => {
      const key = h.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(h);
      return acc;
    },
    {}
  );

  // Sort categories: Emergency first, then others alphabetically
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    if (a === "Emergency") return -1;
    if (b === "Emergency") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Phone className="w-3.5 h-3.5" aria-hidden />
            {isTamil ? "அவசர எண்கள்" : "Emergency"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            {isTamil ? "அவசர எண்கள்" : "Emergency Helplines"}
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-red-200/80">
            {isTamil ? "Emergency Helplines" : "அவசர எண்கள்"}
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            {isTamil
              ? "கீழ்பென்னாத்தூர் மற்றும் சுற்றுவட்டார முக்கிய தொடர்பு எண்கள்"
              : "Important contact numbers for Kilpennathur and surrounding areas"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: isTamil ? "அவசர எண்கள்" : "Helplines" }]} />

        {/* ── Quick Dial — 3 large emergency buttons ── */}
        <section className="mb-10">
          <div className="grid grid-cols-3 gap-3">
            {QUICK_DIAL.map((qd) => {
              const Icon = qd.icon;
              return (
                <a
                  key={qd.number}
                  href={`tel:${qd.number}`}
                  className={cn(
                    "flex flex-col items-center justify-center py-6 md:py-8 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                    qd.color
                  )}
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 mb-2" />
                  <span className="text-2xl md:text-3xl font-mono">{qd.number}</span>
                  <span className="text-xs md:text-sm font-semibold mt-1 opacity-90">
                    {isTamil ? qd.labelTa : qd.label}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Search ── */}
        <section className="mb-8">
          <form
            method="get"
            action="/helplines"
            className="flex gap-2 max-w-xl"
          >
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
                    ? "உதவி தேடுங்கள்... (எ.கா. மருத்துவமனை)"
                    : "Search for help... (e.g. hospital, snake)"
                }
                className="pl-9"
                aria-label="Search helplines"
              />
            </div>
            <Button type="submit" size="default">
              {isTamil ? "தேடு" : "Search"}
            </Button>
          </form>
          {search && (
            <div className="mt-2">
              <a
                href="/helplines"
                className="text-xs text-blue-600 hover:underline"
              >
                {isTamil ? "வடிகட்டிகளை அழிக்கவும்" : "Clear search"}
              </a>
            </div>
          )}
        </section>

        {/* ── Helpline Cards grouped by category ── */}
        {helplines.length === 0 ? (
          <div className="text-center py-16">
            <Phone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {isTamil
                ? "எண்கள் எதுவும் இல்லை"
                : "No helplines found"}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat] ?? DEFAULT_CONFIG;
              const Icon = config.icon;
              const items = grouped[cat];

              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-lg",
                        config.bgColor,
                        config.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50">
                      {isTamil ? config.labelTa : config.label}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({items.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((h) => {
                      const displayTitle =
                        isTamil && h.titleTamil ? h.titleTamil : h.title;
                      const altTitle =
                        isTamil && h.titleTamil ? h.title : h.titleTamil;

                      return (
                        <a
                          key={h.id}
                          href={`tel:${h.number.replace(/\s/g, "")}`}
                          className={cn(
                            "group flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                            "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                            config.borderColor,
                            config.bgColor
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-gray-900 shadow-sm",
                              config.color,
                              "group-hover:shadow-md transition-shadow"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-50 truncate">
                              {displayTitle}
                            </h3>
                            {altTitle && (
                              <p className="font-tamil text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                {altTitle}
                              </p>
                            )}
                            <p className={cn("text-base font-bold font-mono mt-1", config.color)}>
                              {h.number}
                            </p>
                          </div>

                          {/* Call icon */}
                          <div
                            className={cn(
                              "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                              "bg-white dark:bg-gray-900 shadow-sm group-hover:shadow-md transition-shadow",
                              config.color
                            )}
                          >
                            <Phone className="w-4 h-4" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
