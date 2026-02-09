import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/frontend/EventCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import Pagination from "@/components/frontend/Pagination";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

/** Next.js can pass searchParams values as string | string[]; normalize to string. */
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type SearchParams = { page?: string | string[]; pastPage?: string | string[] };
type Props = { searchParams?: Promise<SearchParams> };

export const metadata: Metadata = generateMetadata({
  title: "Events",
  description:
    "Upcoming and past events in Kilpennathur and surrounding areas. சமூக நிகழ்வுகள் மற்றும் கொண்டாட்டங்கள்.",
  path: "/events",
  keywords: ["events", "நிகழ்வுகள்", "community events", "festivals"],
});

/** Revalidate events page every 5 minutes */
export const revalidate = 300;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function EventsListPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const upcomingPage = Math.max(
    1,
    parseInt(toStr(params.page) || "1", 10) || 1
  );
  const pastPage = Math.max(
    1,
    parseInt(toStr(params.pastPage) || "1", 10) || 1
  );

  const eventsPerPageSetting = await prisma.siteSetting.findUnique({
    where: { key: "events_per_page" },
  });
  const limit = parseInt(eventsPerPageSetting?.value || "8", 10) || 8;

  const allEvents = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  const today = startOfToday();
  const upcomingAll = allEvents
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAll = allEvents
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingTotalPages = Math.max(
    1,
    Math.ceil(upcomingAll.length / limit)
  );
  const pastTotalPages = Math.max(1, Math.ceil(pastAll.length / limit));

  const upcomingCurrentPage = Math.min(upcomingPage, upcomingTotalPages);
  const pastCurrentPage = Math.min(pastPage, pastTotalPages);

  const upcomingEvents = upcomingAll.slice(
    (upcomingCurrentPage - 1) * limit,
    upcomingCurrentPage * limit
  );
  const pastEvents = pastAll.slice(
    (pastCurrentPage - 1) * limit,
    pastCurrentPage * limit
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('/images/events-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Calendar className="w-3.5 h-3.5" aria-hidden />
            Events & Festivals
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">
            Events
          </h1>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-purple-200/80">
            நிகழ்வுகள்
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Upcoming and past events in Kilpennathur and surrounding areas.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              {upcomingAll.length} upcoming
            </Badge>
            <Badge
              variant="outline"
              className="text-sm px-4 py-1.5 border-white/30 text-white bg-white/10"
            >
              {pastAll.length} past
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: "Events" }]} />

        {/* ── Upcoming Events ── */}
        {upcomingAll.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2.5 mb-6">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50">
                Upcoming Events
              </h2>
              <span className="font-tamil text-sm text-gray-500 dark:text-gray-400 ml-1">
                வரவிருக்கும் நிகழ்வுகள்
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {upcomingTotalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={upcomingCurrentPage}
                  totalPages={upcomingTotalPages}
                  basePath="/events"
                  searchParams={
                    pastPage > 1
                      ? { pastPage: String(pastPage) }
                      : undefined
                  }
                />
              </div>
            )}
          </section>
        )}

        {/* ── Past Events ── */}
        {pastAll.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-6">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="font-serif text-xl font-bold text-gray-600 dark:text-gray-400">
                Past Events
              </h2>
              <span className="font-tamil text-sm text-gray-400 dark:text-gray-500 ml-1">
                கடந்த நிகழ்வுகள்
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {pastTotalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pastCurrentPage}
                  totalPages={pastTotalPages}
                  basePath="/events"
                  pageParamName="pastPage"
                  searchParams={
                    upcomingPage > 1
                      ? { page: String(upcomingPage) }
                      : undefined
                  }
                />
              </div>
            )}
          </section>
        )}

        {/* ── Empty State ── */}
        {upcomingAll.length === 0 && pastAll.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="There are no upcoming or past events listed. Check back later for community events and festivals."
          />
        )}
      </div>
    </div>
  );
}
