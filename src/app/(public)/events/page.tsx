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
  const upcomingPage = Math.max(1, parseInt(toStr(params.page) || "1", 10) || 1);
  const pastPage = Math.max(1, parseInt(toStr(params.pastPage) || "1", 10) || 1);

  const eventsPerPageSetting = await prisma.siteSetting.findUnique({
    where: { key: "events_per_page" },
  });
  const limit = parseInt(eventsPerPageSetting?.value || "6", 10) || 6;

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

  const upcomingTotalPages = Math.max(1, Math.ceil(upcomingAll.length / limit));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/events-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-900/50 via-pink-800/55 to-purple-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Calendar className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Events</h1>
          <p className="text-xl md:text-2xl mb-2">நிகழ்வுகள்</p>
          <p className="text-base md:text-lg text-orange-100 text-center max-w-3xl">
            Upcoming and past events in Kilpennathur and surrounding areas.
          </p>
          <div className="mt-4 flex gap-3">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              {upcomingAll.length} upcoming
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-1.5 border-2 border-white text-white bg-white/10">
              {pastAll.length} past
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "Events" }]} />

        {/* Upcoming Events */}
        {upcomingAll.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Upcoming Events / வரவிருக்கும் நிகழ்வுகள்
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {upcomingTotalPages > 1 && (
              <Pagination
                currentPage={upcomingCurrentPage}
                totalPages={upcomingTotalPages}
                basePath="/events"
                searchParams={pastPage > 1 ? { pastPage: String(pastPage) } : undefined}
              />
            )}
          </section>
        )}

        {/* Past Events */}
        {pastAll.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-600">
              <Clock className="w-6 h-6" />
              Past Events / கடந்த நிகழ்வுகள்
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {pastTotalPages > 1 && (
              <Pagination
                currentPage={pastCurrentPage}
                totalPages={pastTotalPages}
                basePath="/events"
                pageParamName="pastPage"
                searchParams={upcomingPage > 1 ? { page: String(upcomingPage) } : undefined}
              />
            )}
          </section>
        )}

        {/* Empty State */}
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
