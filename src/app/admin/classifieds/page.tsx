import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClassifiedsListClient } from "./ClassifiedsListClient";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function AdminClassifiedsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = toStr(params.search).trim();

  const classifieds = await prisma.classified.findMany({
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
          Manage Classifieds
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/classifieds/new"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Add Listing
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="get" action="/admin/classifieds" className="mb-6 max-w-md">
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
              aria-label="Search classifieds"
            />
          </div>
          <Button type="submit" size="default">
            Search
          </Button>
        </div>
      </form>

      {classifieds.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No listings found.
          {search ? " Try a different search." : " Create your first listing."}
        </p>
      ) : (
        <ClassifiedsListClient
          items={classifieds.map((c) => ({
            id: c.id,
            title: c.title,
            titleTamil: c.titleTamil,
            type: c.type,
            price: c.price,
            priceLabel: c.priceLabel,
            status: c.status,
            isFeatured: c.isFeatured,
            images: c.images,
            contactName: c.contactName,
            contactPhone: c.contactPhone,
            location: c.location,
            createdAt: c.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
