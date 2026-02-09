import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteVillageButton } from "./DeleteVillageButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);

  return (
    <div className="max-w-5xl">
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
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3 font-semibold text-left whitespace-nowrap">
                  Name (EN)
                </th>
                <th className="px-3 py-3 font-semibold text-left whitespace-nowrap">
                  Name (Tamil)
                </th>
                <th className="px-3 py-3 font-semibold text-left whitespace-nowrap">
                  Slug
                </th>
                <th className="px-3 py-3 font-semibold text-left whitespace-nowrap">
                  Created
                </th>
                <th className="px-3 py-3 font-semibold text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v) => (
                <tr
                  key={v.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-3 py-3 align-top">
                    <span className="block truncate" title={v.name}>
                      {v.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <span className="block truncate" title={v.nameTamil}>
                      {v.nameTamil}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top font-mono text-xs">
                    <span className="block truncate" title={v.slug}>
                      {v.slug}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-top">
                    {formatDate(v.createdAt)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap align-top">
                    <Link
                      href={`/admin/villages/edit/${v.id}`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <DeleteVillageButton id={v.id} />
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
