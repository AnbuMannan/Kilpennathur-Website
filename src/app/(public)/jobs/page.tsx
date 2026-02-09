import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { JobCard } from "@/components/frontend/JobCard";
import { JobSidebar } from "@/components/frontend/JobSidebar";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { Suspense } from "react";

/* ---------- Locale helper ---------- */

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const val = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(val as Locale) ? (val as Locale) : defaultLocale;
}

/* ---------- Metadata (locale-aware) ---------- */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isTamil = locale === "ta";

  const title = isTamil
    ? "வேலைவாய்ப்புகள் - கீழ்பென்னாத்தூர்"
    : "Jobs in Kilpennathur";
  const description = isTamil
    ? "கீழ்பென்னாத்தூர் மற்றும் சுற்றுப்புற பகுதிகளில் வேலைவாய்ப்புகளை கண்டறியுங்கள்."
    : "Find job opportunities in Kilpennathur and surrounding areas.";

  return {
    title: `${title} - Kilpennathur Community Portal`,
    description,
    keywords: [
      "jobs",
      "வேலைகள்",
      "employment",
      "careers",
      "Kilpennathur jobs",
      "வேலைவாய்ப்பு",
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
    type?: string | string[];
    category?: string;
    days?: string;
  }>;
};

export default async function JobsPage({ searchParams }: Props) {
  const locale = await getLocale();
  const isTamil = locale === "ta";
  const params = await searchParams;

  /* Parse filters from URL */
  const searchQuery = typeof params.q === "string" ? params.q.trim() : "";
  const typeFilters: string[] = Array.isArray(params.type)
    ? params.type
    : typeof params.type === "string"
      ? [params.type]
      : [];
  const categoryFilter =
    typeof params.category === "string" ? params.category.trim() : "";
  const daysFilter =
    typeof params.days === "string" ? parseInt(params.days, 10) : 0;

  /* Build Prisma where clause */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "published" };

  if (typeFilters.length > 0) {
    where.jobType = { in: typeFilters };
  }

  if (categoryFilter) {
    where.category = categoryFilter;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { titleTamil: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (daysFilter > 0) {
    const since = new Date();
    since.setDate(since.getDate() - daysFilter);
    where.publishedAt = { gte: since };
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  const now = new Date();
  const openJobs = jobs.filter(
    (j) => !j.applicationDeadline || new Date(j.applicationDeadline) >= now
  );
  const closedJobs = jobs.filter(
    (j) => j.applicationDeadline && new Date(j.applicationDeadline) < now
  );

  const hasFilters =
    searchQuery || typeFilters.length > 0 || categoryFilter || daysFilter > 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-blue-200 text-xs font-semibold mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            {isTamil ? "வேலை வாய்ப்புகள்" : "Job Opportunities"}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight">
            {isTamil ? "வேலைவாய்ப்புகள்" : "Jobs in Kilpennathur"}
          </h1>
          <p className="font-tamil text-lg text-blue-200/80 mt-2 leading-relaxed">
            {isTamil
              ? "கீழ்பென்னாத்தூர் மற்றும் சுற்றுப்புற பகுதிகளில் வேலைவாய்ப்புகள்"
              : "வேலைகள்"}
          </p>
          <p className="text-sm text-blue-100/70 mt-2 max-w-2xl mx-auto leading-relaxed">
            {isTamil
              ? "கீழ்பென்னாத்தூர் மற்றும் சுற்றுப்புற பகுதிகளில் வேலை வாய்ப்புகளை கண்டறியுங்கள்"
              : "Find job opportunities in Kilpennathur and surrounding areas"}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1.5 bg-green-500/20 text-green-200 border-0"
            >
              {openJobs.length} {isTamil ? "திறந்தவை" : "open"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1.5 bg-white/10 text-white/70 border-0"
            >
              {closedJobs.length} {isTamil ? "முடிவடைந்தவை" : "closed"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: isTamil ? "வேலைகள்" : "Jobs" }]} />

        {/* ── Sidebar + Main Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar (filters + CTA) */}
          <Suspense fallback={null}>
            <JobSidebar />
          </Suspense>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isTamil ? "காட்டுகிறது" : "Showing"}{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {jobs.length}
                </span>{" "}
                {isTamil ? "வேலைகள்" : "jobs"}
                {hasFilters && (
                  <span className="text-gray-400">
                    {" "}
                    ({isTamil ? "வடிகட்டப்பட்டது" : "filtered"})
                  </span>
                )}
              </p>
            </div>

            {jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title={
                  isTamil
                    ? "வேலைகள் எதுவும் கிடைக்கவில்லை"
                    : "No jobs found"
                }
                description={
                  hasFilters
                    ? isTamil
                      ? "உங்கள் வடிகட்டிகளுக்கு பொருந்தக்கூடிய வேலைகள் இல்லை. வடிகட்டிகளை மாற்றி முயற்சிக்கவும்."
                      : "No jobs match your current filters. Try adjusting your search or filters."
                    : isTamil
                      ? "தற்போது வேலை வாய்ப்புகள் இல்லை. பின்னர் மீண்டும் பாருங்கள்."
                      : "No job listings are available at the moment. Check back later for new opportunities."
                }
              />
            ) : (
              <section aria-label="Job listings">
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={{
                        id: job.id,
                        title: job.title,
                        titleTamil: job.titleTamil,
                        company: job.company,
                        companyTamil: job.companyTamil,
                        location: job.location,
                        locationTamil: job.locationTamil,
                        jobType: job.jobType,
                        category: job.category,
                        salaryDescription: job.salaryDescription,
                        applicationDeadline: job.applicationDeadline,
                        applicationUrl: job.applicationUrl,
                        publishedAt: job.publishedAt,
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
