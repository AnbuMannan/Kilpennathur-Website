import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bus, Plus } from "lucide-react";
import { BusListClient } from "./BusListClient";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminBusPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Feature flag guard
  try {
    const busSetting = await prisma.siteSetting.findFirst({
      where: { key: "enableBusTimings", category: "display" },
    });
    if (busSetting?.value === "false") redirect("/admin");
  } catch { /* allow access on error */ }

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
    orderBy: { departureTime: "asc" },
  });

  const items = busTimings.map((b) => ({
    id: b.id,
    route: b.route,
    routeTamil: b.routeTamil,
    busNumber: b.busNumber,
    busType: b.busType,
    departureTime: b.departureTime,
  }));

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <Link
          href="/admin/utilities/bus"
          className="px-4 py-2.5 text-sm font-semibold text-primary border-b-2 border-primary -mb-px"
        >
          Bus Timings
        </Link>
        <Link
          href="/admin/utilities/helplines"
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px transition-colors"
        >
          Helplines
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Bus Timings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {busTimings.length} route{busTimings.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Link
          href="/admin/utilities/bus/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Bus Timing
        </Link>
      </div>

      {/* Search */}
      <form method="get" action="/admin/utilities/bus" className="max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search by route or bus number..."
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
          {search && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/utilities/bus">Clear</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card">
          <Bus className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bus timings found</p>
          <p className="text-sm mt-1">
            {search ? "Try a different search." : "Add your first bus timing to get started."}
          </p>
        </div>
      ) : (
        <BusListClient items={items} />
      )}
    </div>
  );
}
