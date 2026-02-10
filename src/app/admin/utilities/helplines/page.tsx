import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Phone, Plus } from "lucide-react";
import { HelplineListClient } from "./HelplineListClient";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminHelplinesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();

  const helplines = await prisma.helpline.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { titleTamil: { contains: search, mode: "insensitive" as const } },
            { number: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {},
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  const items = helplines.map((h) => ({
    id: h.id,
    title: h.title,
    titleTamil: h.titleTamil,
    number: h.number,
    category: h.category,
  }));

  // Count by category
  const categoryCounts: Record<string, number> = {};
  for (const h of helplines) {
    categoryCounts[h.category] = (categoryCounts[h.category] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <Link
          href="/admin/utilities/bus"
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px transition-colors"
        >
          Bus Timings
        </Link>
        <Link
          href="/admin/utilities/helplines"
          className="px-4 py-2.5 text-sm font-semibold text-primary border-b-2 border-primary -mb-px"
        >
          Helplines
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Helplines</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {helplines.length} number{helplines.length !== 1 ? "s" : ""} across{" "}
            {Object.keys(categoryCounts).length} categories
          </p>
        </div>
        <Link
          href="/admin/utilities/helplines/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Helpline
        </Link>
      </div>

      {/* Category summary chips */}
      {Object.keys(categoryCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([cat, count]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
              >
                {cat}
                <span className="bg-background rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  {count}
                </span>
              </span>
            ))}
        </div>
      )}

      {/* Search */}
      <form method="get" action="/admin/utilities/helplines" className="max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search by title or number..."
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
          {search && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/utilities/helplines">Clear</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card">
          <Phone className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No helplines found</p>
          <p className="text-sm mt-1">
            {search ? "Try a different search." : "Add your first helpline number to get started."}
          </p>
        </div>
      ) : (
        <HelplineListClient items={items} />
      )}
    </div>
  );
}
