import Link from "next/link";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  Eye,
  Clock,
  Users,
  Activity,
  Plus,
  Newspaper,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  Landmark,
  ShoppingBag,
  Pencil,
  AlertTriangle,
} from "lucide-react";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(date);
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(date);
}

/** Convert a Date to YYYY-MM-DD string in Asia/Kolkata timezone */
function toISTDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  href?: string;
};

function MetricCard({ title, value, subtitle, icon, gradient, href }: MetricCardProps) {
  const inner = (
    <div className={`rounded-xl p-6 ${gradient} text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs opacity-70">{subtitle}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-2.5">{icon}</div>
      </div>
    </div>
  );
  if (href) return <Link href={href} className="block">{inner}</Link>;
  return inner;
}

type AttentionItem = {
  type: string;
  id: string;
  title: string;
  createdAt: Date;
  editUrl: string;
  icon: React.ReactNode;
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // Feature flags
  let enableSchemes = true;
  let enableClassifieds = true;

  try {
    const displaySettings = await prisma.siteSetting.findMany({
      where: { category: "display" },
    });
    const getFlag = (key: string) =>
      displaySettings.find((s) => s.key === key)?.value !== "false";
    enableSchemes = getFlag("enableSchemes");
    enableClassifieds = getFlag("enableClassifieds");
  } catch {
    // Default: enabled
  }

  let dbError: string | null = null;

  let totalViews = 0;
  let pendingCount = 0;
  let subscriberCount = 0;
  let draftNews: { id: string; title: string; createdAt: Date }[] = [];
  let draftJobs: { id: string; title: string; createdAt: Date }[] = [];
  let draftSchemes: { id: string; title: string; createdAt: Date }[] = [];
  let draftClassifieds: { id: string; title: string; createdAt: Date }[] = [];
  let viewsPerDay: { date: string; count: number }[] = [];

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      viewsAgg,
      draftNewsCount,
      draftJobsCount,
      draftSchemesCount,
      draftClassifiedsCount,
      subscribers,
      recentDraftNews,
      recentDraftJobs,
      recentDraftSchemes,
      recentDraftClassifieds,
      recentPublishedNews,
    ] = await Promise.all([
      prisma.news.aggregate({ _sum: { views: true } }),
      prisma.news.count({ where: { status: "draft" } }),
      prisma.job.count({ where: { status: "draft" } }),
      prisma.scheme.count({ where: { status: "draft" } }),
      prisma.classified.count({ where: { status: "draft" } }),
      "newsletterSubscriber" in prisma && prisma.newsletterSubscriber
        ? prisma.newsletterSubscriber.count()
        : Promise.resolve(0),
      prisma.news.findMany({
        where: { status: "draft" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.job.findMany({
        where: { status: "draft" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.scheme.findMany({
        where: { status: "draft" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.classified.findMany({
        where: { status: "draft" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.news.findMany({
        where: {
          status: "published",
          publishedAt: { gte: sevenDaysAgo },
        },
        select: { publishedAt: true, views: true },
        orderBy: { publishedAt: "asc" },
      }),
    ]);

    totalViews = viewsAgg._sum.views ?? 0;
    pendingCount = draftNewsCount + draftJobsCount
      + (enableSchemes ? draftSchemesCount : 0)
      + (enableClassifieds ? draftClassifiedsCount : 0);
    subscriberCount = subscribers;
    draftNews = recentDraftNews;
    draftJobs = recentDraftJobs;
    draftSchemes = enableSchemes ? recentDraftSchemes : [];
    draftClassifieds = enableClassifieds ? recentDraftClassifieds : [];

    // Build views-per-day data for last 7 days (IST timezone)
    const dayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toISTDateKey(d);
      dayMap.set(key, 0);
    }
    for (const item of recentPublishedNews) {
      if (item.publishedAt) {
        const key = toISTDateKey(item.publishedAt);
        if (dayMap.has(key)) {
          dayMap.set(key, (dayMap.get(key) ?? 0) + item.views);
        }
      }
    }
    viewsPerDay = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Cannot connect to database";
  }

  const userName =
    (session?.user as { name?: string })?.name ||
    (session?.user?.email ?? "Admin").split("@")[0];
  const currentDate = formatDate(new Date());

  if (dbError) {
    return (
      <div className="max-w-7xl space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="font-medium text-destructive">Database connection error</p>
          <p className="mt-2 text-sm text-muted-foreground">{dbError}</p>
        </div>
      </div>
    );
  }

  // Merge attention items
  const attentionItems: AttentionItem[] = [
    ...draftNews.map((n) => ({
      type: "News",
      id: n.id,
      title: n.title,
      createdAt: n.createdAt,
      editUrl: `/admin/news/${n.id}/edit`,
      icon: <Newspaper className="h-4 w-4 text-blue-500" />,
    })),
    ...draftJobs.map((j) => ({
      type: "Job",
      id: j.id,
      title: j.title,
      createdAt: j.createdAt,
      editUrl: `/admin/jobs/edit/${j.id}`,
      icon: <Briefcase className="h-4 w-4 text-orange-500" />,
    })),
    ...draftSchemes.map((s) => ({
      type: "Scheme",
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      editUrl: `/admin/schemes/${s.id}/edit`,
      icon: <Landmark className="h-4 w-4 text-indigo-500" />,
    })),
    ...draftClassifieds.map((c) => ({
      type: "Classified",
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
      editUrl: `/admin/classifieds/${c.id}/edit`,
      icon: <ShoppingBag className="h-4 w-4 text-pink-500" />,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  const maxViews = Math.max(...viewsPerDay.map((d) => d.count), 1);

  return (
    <div className="max-w-7xl space-y-8">
      {/* Welcome */}
      <section>
        <h1 className="text-2xl font-bold text-foreground">
          Mission Control
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Welcome back, {userName} &mdash; {currentDate}
        </p>
      </section>

      {/* 4 Metric Cards */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Views"
            value={totalViews.toLocaleString("en-IN")}
            subtitle="All-time article views"
            icon={<Eye className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            href="/admin/news"
          />
          <MetricCard
            title="Pending Listings"
            value={pendingCount}
            subtitle="Items awaiting review"
            icon={<Clock className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <MetricCard
            title="Subscribers"
            value={subscriberCount.toLocaleString("en-IN")}
            subtitle="Newsletter sign-ups"
            icon={<Users className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            href="/admin/newsletter"
          />
          <MetricCard
            title="System Health"
            value="Operational"
            subtitle="All services running"
            icon={<Activity className="h-6 w-6" />}
            gradient="bg-gradient-to-br from-emerald-500 to-green-600"
          />
        </div>
      </section>

      {/* Two-column: Chart + Needs Attention */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Views per Day Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Views by Publish Date (Last 7 Days)</h2>
          <div className="flex items-end gap-2 h-40">
            {viewsPerDay.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {day.count > 0 ? day.count : ""}
                </span>
                <div className="w-full relative rounded-t-md bg-muted overflow-hidden" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ height: `${Math.max(4, (day.count / maxViews) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatShortDate(new Date(day.date + "T00:00:00"))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Needs Attention</h2>
            </div>
            <span className="text-xs text-muted-foreground">{attentionItems.length} draft items</span>
          </div>
          {attentionItems.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">All caught up! No drafts pending.</p>
          ) : (
            <div className="divide-y divide-border max-h-[280px] overflow-auto">
              {attentionItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors"
                >
                  {item.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type} &middot; {formatDate(item.createdAt)}</p>
                  </div>
                  <Link
                    href={item.editUrl}
                    className="shrink-0 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="text-sm font-semibold mb-3 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: "/admin/news/new", label: "New Article", icon: Newspaper, bg: "bg-blue-50 text-blue-600" },
            { href: "/admin/jobs/create", label: "New Job", icon: Briefcase, bg: "bg-orange-50 text-orange-600" },
            { href: "/admin/business/new", label: "Add Business", icon: Building2, bg: "bg-violet-50 text-violet-600" },
            { href: "/admin/events/create", label: "New Event", icon: Calendar, bg: "bg-pink-50 text-pink-600" },
            { href: "/admin/villages/create", label: "Add Village", icon: MapPin, bg: "bg-teal-50 text-teal-600" },
            ...(enableSchemes ? [{ href: "/admin/schemes/new", label: "New Scheme", icon: Landmark, bg: "bg-indigo-50 text-indigo-600" }] : []),
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className={`rounded-md p-1.5 ${action.bg}`}>
                <action.icon className="h-4 w-4" />
              </div>
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
