import Link from "next/link";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  Newspaper,
  FileCheck,
  FileEdit,
  Building2,
  MapPin,
  Calendar,
  Tags,
  Plus,
  ExternalLink,
  Pencil,
  Users,
  MessageSquare,
} from "lucide-react";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

type StatCardProps = {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

function StatCard({ title, value, href, icon, gradient }: StatCardProps) {
  return (
    <Link
      href={href}
      className={`block rounded-xl p-6 ${gradient} text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm font-medium opacity-90">{title}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-2">{icon}</div>
      </div>
      <span className="mt-3 inline-block text-xs font-medium opacity-90 hover:underline">
        Manage →
      </span>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();

  let totalNews = 0;
  let publishedNews = 0;
  let draftNews = 0;
  let totalBusinesses = 0;
  let totalVillages = 0;
  let totalEvents = 0;
  let totalCategories = 0;
  let contactUnread = 0;
  let newsletterCount = 0;
  let recentNews: Awaited<ReturnType<typeof prisma.news.findMany>> = [];
  let recentEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let dbError: string | null = null;

  try {
    [
      totalNews,
      publishedNews,
      draftNews,
      totalBusinesses,
      totalVillages,
      totalEvents,
      totalCategories,
      contactUnread,
      newsletterCount,
      recentNews,
      recentEvents,
    ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "published" } }),
    prisma.news.count({ where: { status: "draft" } }),
    prisma.business.count(),
    prisma.village.count(),
    prisma.event.count(),
    prisma.category.count(),
    "contactMessage" in prisma && prisma.contactMessage
      ? prisma.contactMessage.count({ where: { read: false } })
      : Promise.resolve(0),
    "newsletterSubscriber" in prisma && prisma.newsletterSubscriber
      ? prisma.newsletterSubscriber.count()
      : Promise.resolve(0),
    prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { date: "asc" },
    }),
  ]);
  } catch (err) {
    dbError =
      err instanceof Error ? err.message : "Cannot connect to database";
  }

  const maxCount = Math.max(
    totalNews,
    totalBusinesses,
    totalVillages,
    totalEvents,
    1
  );

  const userName =
    (session?.user as { name?: string })?.name ||
    (session?.user?.email ?? "Admin").split("@")[0];
  const currentDate = formatDate(new Date());

  if (dbError) {
    return (
      <div className="max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="font-medium text-destructive">Database connection error</p>
          <p className="mt-2 text-sm text-muted-foreground">{dbError}</p>
          <p className="mt-4 text-sm">
            Check your database URL, network connectivity, and ensure the database
            server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-10">
      {/* Welcome */}
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-muted-foreground">{currentDate}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Here’s an overview of your content and quick actions.
        </p>
      </section>

      {/* Stats grid */}
      <section aria-label="Statistics">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total News"
            value={totalNews}
            href="/admin/news"
            icon={<Newspaper className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Published"
            value={publishedNews}
            href="/admin/news"
            icon={<FileCheck className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="Drafts"
            value={draftNews}
            href="/admin/news"
            icon={<FileEdit className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          />
          <StatCard
            title="Businesses"
            value={totalBusinesses}
            href="/admin/business"
            icon={<Building2 className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-violet-500 to-violet-600"
          />
          <StatCard
            title="Villages"
            value={totalVillages}
            href="/admin/villages"
            icon={<MapPin className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-teal-500 to-teal-600"
          />
          <StatCard
            title="Events"
            value={totalEvents}
            href="/admin/events"
            icon={<Calendar className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-pink-500 to-pink-600"
          />
          <StatCard
            title="Categories"
            value={totalCategories}
            href="/admin/categories"
            icon={<Tags className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-slate-600 to-slate-700"
          />
          <StatCard
            title="Contact (unread)"
            value={contactUnread}
            href="/admin/contact"
            icon={<MessageSquare className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
          <StatCard
            title="Newsletter"
            value={newsletterCount}
            href="/admin/newsletter"
            icon={<Users className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Simple chart: content distribution */}
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Content distribution</h3>
          <div className="space-y-2">
            {[
              { label: "News", value: totalNews, color: "bg-blue-500" },
              { label: "Businesses", value: totalBusinesses, color: "bg-violet-500" },
              { label: "Villages", value: totalVillages, color: "bg-teal-500" },
              { label: "Events", value: totalEvents, color: "bg-pink-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-24 text-sm text-muted-foreground">{item.label}</span>
                <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${Math.max(4, (item.value / maxCount) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section aria-label="Recent news">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent News</h2>
          <Link
            href="/admin/news"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {recentNews.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">
              No news yet. Create your first article.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold w-24">Status</th>
                  <th className="px-4 py-3 font-semibold w-32">Author</th>
                  <th className="px-4 py-3 font-semibold w-28">Date</th>
                  <th className="px-4 py-3 font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium">
                      <span className="line-clamp-1">{item.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.author.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <span className="text-muted-foreground">|</span>
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Recent events */}
      <section aria-label="Recent events">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Link
            href="/admin/events"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {recentEvents.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">
              No events scheduled.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold w-36">Date</th>
                  <th className="px-4 py-3 font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium line-clamp-1">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/events/edit/${item.id}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/news/new"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-medium">Create News</span>
          </Link>
          <Link
            href="/admin/business/new"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-medium">Add Business</span>
          </Link>
          <Link
            href="/admin/events/create"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="rounded-lg bg-pink-100 p-2 text-pink-600">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="font-medium">Create Event</span>
          </Link>
          <Link
            href="/admin/villages/create"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="rounded-lg bg-teal-100 p-2 text-teal-600">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-medium">Add Village</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Tags className="h-5 w-5" />
            </div>
            <span className="font-medium">Manage Categories</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
