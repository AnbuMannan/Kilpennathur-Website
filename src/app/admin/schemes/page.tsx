import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SchemesListClient } from "./SchemesListClient";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminSchemesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();

  const schemes = await prisma.scheme.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { titleTamil: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Schemes
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/schemes/new"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Add Scheme
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="get" action="/admin/schemes" className="mb-6 max-w-md">
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
              placeholder="Search by title..."
              className="pl-9"
              aria-label="Search schemes"
            />
          </div>
          <Button type="submit" size="default">
            Search
          </Button>
        </div>
      </form>

      {schemes.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No schemes found.
          {search ? " Try a different search." : " Create your first scheme."}
        </p>
      ) : (
        <SchemesListClient
          items={schemes.map((s) => ({
            id: s.id,
            title: s.title,
            titleTamil: s.titleTamil,
            sponsor: s.sponsor,
            beneficiaryType: s.beneficiaryType,
            status: s.status,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
