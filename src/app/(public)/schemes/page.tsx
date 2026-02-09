import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { SchemeFilters } from "@/components/frontend/SchemeFilters";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  ExternalLink,
  FileText,
  Users,
  Heart,
  Sprout,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    ? "அரசு திட்டங்கள் - கீழ்பென்னாத்தூர்"
    : "Government Schemes | Kilpennathur";
  const description = isTamil
    ? "மத்திய மற்றும் மாநில அரசு திட்டங்களை கண்டறியுங்கள்."
    : "Find central and state government schemes available for citizens.";

  return {
    title: `${title} - Kilpennathur Community Portal`,
    description,
    keywords: [
      "government schemes",
      "அரசு திட்டங்கள்",
      "welfare",
      "subsidies",
      "Kilpennathur",
    ],
    openGraph: { title, description },
  };
}

/* ---------- Revalidate ---------- */

export const revalidate = 300;

/* ---------- Sponsor labels ---------- */

const SPONSOR_LABELS_TA: Record<string, string> = {
  "Central Govt": "மத்திய அரசு",
  "State Govt": "மாநில அரசு",
  District: "மாவட்டம்",
  Other: "பிற",
};

const BENEFICIARY_LABELS_TA: Record<string, string> = {
  Farmers: "விவசாயிகள்",
  Students: "மாணவர்கள்",
  Women: "பெண்கள்",
  "Senior Citizens": "மூத்த குடிமக்கள்",
  "SC/ST": "SC/ST",
  "BPL Families": "BPL குடும்பங்கள்",
  "Differently Abled": "மாற்றுத்திறனாளிகள்",
  General: "பொது",
  Health: "சுகாதாரம்",
};

/* ---------- Beneficiary badge color ---------- */

function getBeneficiaryColor(type: string): string {
  const map: Record<string, string> = {
    Farmers: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    Students: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Women: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    "Senior Citizens": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    General: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    Health: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return map[type] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
}

/* ---------- Page ---------- */

type Props = {
  searchParams: Promise<{
    q?: string;
    beneficiary?: string;
    sponsor?: string;
  }>;
};

export default async function SchemesPage({ searchParams }: Props) {
  const locale = await getLocale();
  const isTamil = locale === "ta";
  const params = await searchParams;

  const searchQuery = typeof params.q === "string" ? params.q.trim() : "";
  const beneficiaryFilter =
    typeof params.beneficiary === "string" ? params.beneficiary.trim() : "";
  const sponsorFilter =
    typeof params.sponsor === "string" ? params.sponsor.trim() : "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "published" };

  if (beneficiaryFilter) {
    where.beneficiaryType = beneficiaryFilter;
  }

  if (sponsorFilter) {
    where.sponsor = sponsorFilter;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { titleTamil: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Fetch all published schemes + stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [schemes, allSchemes]: [any[], any[]] = await Promise.all([
    (prisma as any).scheme.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).scheme.findMany({
      where: { status: "published" },
      select: { beneficiaryType: true },
    }),
  ]);

  // Compute quick stats
  const totalSchemes = allSchemes.length;
  const farmersCount = allSchemes.filter(
    (s: any) => s.beneficiaryType === "Farmers"
  ).length;
  const womenCount = allSchemes.filter(
    (s: any) => s.beneficiaryType === "Women"
  ).length;
  const studentsCount = allSchemes.filter(
    (s: any) => s.beneficiaryType === "Students"
  ).length;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Landmark className="w-3.5 h-3.5" aria-hidden />
            {isTamil ? "அரசு திட்டங்கள்" : "Government Schemes"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            {isTamil ? "அரசு திட்டங்கள்" : "Government Schemes"}
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-emerald-200/80">
            {isTamil ? "Government Schemes" : "அரசு திட்டங்கள்"}
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            {isTamil
              ? "மத்திய மற்றும் மாநில அரசு திட்டங்கள் பற்றிய தகவல்கள்"
              : "Information about central and state government welfare schemes"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            {
              label: isTamil ? "அரசு திட்டங்கள்" : "Schemes",
            },
          ]}
        />

        {/* ── Quick Stat Cards ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {totalSchemes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTamil ? "மொத்த திட்டங்கள்" : "Total Schemes"}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {farmersCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTamil ? "விவசாயிகளுக்கு" : "For Farmers"}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {womenCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTamil ? "பெண்களுக்கு" : "For Women"}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {studentsCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTamil ? "மாணவர்களுக்கு" : "For Students"}
              </p>
            </div>
          </div>
        </section>

        {/* ── Filters (Pill Tabs) ── */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <SchemeFilters />
          </Suspense>
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {schemes.length}
            </span>{" "}
            {isTamil ? "திட்டங்கள்" : "schemes"}
          </p>
        </div>

        {/* ── Scheme Cards (Ticket Style) ── */}
        {schemes.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title={
              isTamil
                ? "திட்டங்கள் எதுவும் கிடைக்கவில்லை"
                : "No schemes found"
            }
            description={
              searchQuery || beneficiaryFilter || sponsorFilter
                ? isTamil
                  ? "உங்கள் வடிகட்டிகளுக்கு பொருந்தக்கூடிய திட்டங்கள் இல்லை."
                  : "No schemes match your current filters. Try adjusting your search."
                : isTamil
                  ? "தற்போது திட்டங்கள் எதுவும் பதிவு செய்யப்படவில்லை."
                  : "No schemes are listed at the moment. Check back later."
            }
          />
        ) : (
          <div className="space-y-3">
            {schemes.map((s) => {
              const displayTitle =
                isTamil && s.titleTamil ? s.titleTamil : s.title;
              const displaySub =
                isTamil && s.titleTamil ? s.title : s.titleTamil;
              const displayDesc =
                isTamil && s.descriptionTamil
                  ? s.descriptionTamil
                  : s.description;

              const sponsorLabel = isTamil
                ? SPONSOR_LABELS_TA[s.sponsor] ?? s.sponsor
                : s.sponsor;
              const beneficiaryLabel = isTamil
                ? BENEFICIARY_LABELS_TA[s.beneficiaryType] ??
                  s.beneficiaryType
                : s.beneficiaryType;

              return (
                <article
                  key={s.id}
                  className={cn(
                    "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
                    "border-l-4 border-l-emerald-500",
                    "flex flex-col sm:flex-row sm:items-center gap-4 p-5",
                    "transition-all hover:shadow-md hover:border-l-emerald-600"
                  )}
                >
                  {/* Left — Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-50 leading-snug">
                        {displayTitle}
                      </h3>
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold border-0",
                          s.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        )}
                      >
                        {s.status === "published"
                          ? isTamil
                            ? "செயலில்"
                            : "Active"
                          : isTamil
                            ? "மூடப்பட்டது"
                            : "Closed"}
                      </Badge>
                    </div>
                    {displaySub && (
                      <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1">
                        {displaySub}
                      </p>
                    )}
                    {displayDesc && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium",
                          getBeneficiaryColor(s.beneficiaryType)
                        )}
                      >
                        {beneficiaryLabel}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {sponsorLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right — Action */}
                  <div className="shrink-0">
                    {s.applicationLink ? (
                      <Button size="sm" className="gap-1.5" asChild>
                        <a
                          href={s.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isTamil ? "விண்ணப்பிக்க" : "Apply Now"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                      >
                        {isTamil ? "விவரங்கள்" : "View"}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
