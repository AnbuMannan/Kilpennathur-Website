import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteSchemeButton } from "./DeleteSchemeButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
            {
              titleTamil: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);

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
          {search
            ? " Try a different search."
            : " Create your first scheme."}
        </p>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table
            className="w-full text-left text-sm"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Title
                </th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Sponsor
                </th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Beneficiary
                </th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Created
                </th>
                <th className="px-3 py-3 font-semibold whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-3 py-3 align-top">
                    <span className="block truncate font-medium" title={s.title}>
                      {s.title}
                    </span>
                    {s.titleTamil && (
                      <span
                        className="block truncate text-xs text-muted-foreground"
                        title={s.titleTamil}
                      >
                        {s.titleTamil}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge variant="outline" className="text-xs">
                      {s.sponsor}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge variant="secondary" className="text-xs">
                      {s.beneficiaryType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge
                      variant={
                        s.status === "published" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-top">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap align-top">
                    <Link
                      href={`/admin/schemes/${s.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <DeleteSchemeButton id={s.id} />
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
