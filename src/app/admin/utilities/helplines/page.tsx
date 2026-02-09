import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteHelplineButton } from "./DeleteHelplineButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
    orderBy: { createdAt: "desc" },
  });

  const categoryColor: Record<string, string> = {
    Emergency: "bg-red-100 text-red-700 border-red-200",
    Medical: "bg-green-100 text-green-700 border-green-200",
    EB: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Water: "bg-blue-100 text-blue-700 border-blue-200",
    Panchayat: "bg-purple-100 text-purple-700 border-purple-200",
    Fire: "bg-orange-100 text-orange-700 border-orange-200",
    Ambulance: "bg-pink-100 text-pink-700 border-pink-200",
  };

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        <Link
          href="/admin/utilities/bus"
          className="border-b-2 border-transparent pb-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Bus Timings
        </Link>
        <Link
          href="/admin/utilities/helplines"
          className="border-b-2 border-primary pb-2 text-sm font-semibold text-foreground"
        >
          Helplines
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" aria-hidden />
        <h1 className="text-4xl font-bold text-center flex-none">
          Manage Helplines
        </h1>
        <div className="flex-1 flex justify-end">
          <Link
            href="/admin/utilities/helplines/new"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            Add Helpline
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="get" action="/admin/utilities/helplines" className="mb-6 max-w-md">
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
              placeholder="Search by title or number..."
              className="pl-9"
              aria-label="Search helplines"
            />
          </div>
          <Button type="submit" size="default">
            Search
          </Button>
        </div>
      </form>

      {helplines.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No helplines found.
          {search
            ? " Try a different search."
            : " Add your first helpline number."}
        </p>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table
            className="w-full text-left text-sm"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Title</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Number</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Category</th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {helplines.map((h) => (
                <tr
                  key={h.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-3 py-3 align-top">
                    <span className="block truncate font-medium" title={h.title}>
                      {h.title}
                    </span>
                    {h.titleTamil && (
                      <span
                        className="block truncate text-xs text-muted-foreground"
                        title={h.titleTamil}
                      >
                        {h.titleTamil}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top font-mono">
                    {h.number}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge
                      variant="outline"
                      className={`text-xs ${categoryColor[h.category] ?? ""}`}
                    >
                      {h.category}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap align-top">
                    <Link
                      href={`/admin/utilities/helplines/${h.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <DeleteHelplineButton id={h.id} />
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
