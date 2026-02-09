import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteBusButton } from "./DeleteBusButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminBusPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();

  const busTimings = await prisma.busTiming.findMany({
    where: search
      ? {
          OR: [
            { route: { contains: search, mode: "insensitive" as const } },
            { routeTamil: { contains: search, mode: "insensitive" as const } },
            { busNumber: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        <Link
          href="/admin/utilities/bus"
          className="border-b-2 border-primary pb-2 text-sm font-semibold text-foreground"
        >
          Bus Timings
        </Link>
        <Link
          href="/admin/utilities/helplines"
          className="border-b-2 border-transparent pb-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Helplines
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Bus Timings
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/utilities/bus/new"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Add Bus Timing
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="get" action="/admin/utilities/bus" className="mb-6 max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search by route or bus number..."
              className="pl-9"
              aria-label="Search bus timings"
            />
          </div>
          <Button type="submit" size="default">
            Search
          </Button>
        </div>
      </form>

      {busTimings.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No bus timings found.
          {search
            ? " Try a different search."
            : " Add your first bus timing."}
        </p>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table
            className="w-full text-left text-sm"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "23%" }} />
            </colgroup>
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Route</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Bus No.</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Type</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Departure</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busTimings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-3 py-3 align-top">
                    <span className="block truncate font-medium" title={b.route}>
                      {b.route}
                    </span>
                    {b.routeTamil && (
                      <span
                        className="block truncate text-xs text-muted-foreground"
                        title={b.routeTamil}
                      >
                        {b.routeTamil}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-muted-foreground">
                    {b.busNumber || "—"}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge variant="outline" className="text-xs">
                      {b.busType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 align-top font-mono text-sm">
                    {b.departureTime}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap align-top">
                    <Link
                      href={`/admin/utilities/bus/${b.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <DeleteBusButton id={b.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
