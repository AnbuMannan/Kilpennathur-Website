import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { VillagesListClient } from "./VillagesListClient";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminVillagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();

  const villages = await prisma.village.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { nameTamil: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {},
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Villages
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/villages/create"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Add Village
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="get" action="/admin/villages" className="mb-6 max-w-md">
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
              placeholder="Search by name..."
              className="pl-9"
              aria-label="Search villages"
            />
          </div>
          <Button type="submit" size="default">
            Search
          </Button>
        </div>
      </form>

      {villages.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No villages found.
          {search ? " Try a different search." : " Create your first village."}
        </p>
      ) : (
        <VillagesListClient
          items={villages.map((v) => ({
            id: v.id,
            name: v.name,
            nameTamil: v.nameTamil,
            slug: v.slug,
            description: v.description,
            image: v.image,
            presidentName: v.presidentName,
            population: v.population,
            totalStreets: v.totalStreets,
            wardCount: v.wardCount,
            createdAt: v.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
