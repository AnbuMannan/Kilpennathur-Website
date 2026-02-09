import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Users,
  Mail,
  Download,
  TrendingUp,
  Send,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { NewsletterFilters } from "./NewsletterFilters";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

type Props = { searchParams: Promise<{ search?: string }> };

export default async function AdminNewsletterPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = toStr(params.search).trim().toLowerCase();

  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const [subscribers, totalCount, thisMonthCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    }),
  ]);

  // Calculate growth percentage based on last month
  const lastMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  );
  const lastMonthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const lastMonthCount = await prisma.newsletterSubscriber.count({
    where: {
      createdAt: { gte: lastMonthStart, lt: lastMonthEnd },
    },
  });

  const growthPercent =
    lastMonthCount > 0
      ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
      : thisMonthCount > 0
        ? 100
        : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Audience Growth</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Newsletter subscribers and engagement
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Subscribers
            </p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">{totalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              This Month
            </p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-3xl font-bold">{thisMonthCount}</p>
            {growthPercent !== 0 && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full mb-1 ${
                  growthPercent > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <ArrowUpRight
                  className={`h-3 w-3 ${growthPercent < 0 ? "rotate-90" : ""}`}
                />
                {growthPercent > 0 ? "+" : ""}
                {growthPercent}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">vs last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Month
            </p>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">{lastMonthCount}</p>
          <p className="text-xs text-muted-foreground mt-1">New subscribers</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <NewsletterFilters />
        <div className="flex items-center gap-2 shrink-0">
          {totalCount > 0 && (
            <Link
              href="/api/admin/newsletter/export"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-input bg-background hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Link>
          )}
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-not-allowed opacity-60"
            title="Coming soon"
            disabled
          >
            <Send className="h-4 w-4" />
            Compose Blast
          </button>
        </div>
      </div>

      {/* Subscriber Table */}
      {subscribers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No subscribers found</p>
          <p className="text-sm mt-1">
            Newsletter signups from the footer will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="max-h-[50vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                    #
                  </TableHead>
                  <TableHead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                    Email
                  </TableHead>
                  <TableHead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                    Joined Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub, i) => (
                  <TableRow key={sub.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground w-12">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${sub.email}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1.5"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {sub.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(sub.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
