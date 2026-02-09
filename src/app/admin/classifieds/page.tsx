import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DeleteClassifiedButton } from "./DeleteClassifiedButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type SearchParams = { search?: string | string[] };

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function formatPrice(price: number | null, label: string | null): string {
  if (price == null) return "—";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  return label ? `${formatted} ${label}` : formatted;
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
        <div className="border border-border rounded-md overflow-hidden">
          <table
            className="w-full text-left text-sm"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3 font-semibold">Img</th>
                <th className="px-3 py-3 font-semibold">Title</th>
                <th className="px-3 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Featured</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classifieds.map((c) => {
                const firstImage = c.images
                  .split(",")
                  .map((u) => u.trim())
                  .filter(Boolean)[0];
                return (
                  <tr
                    key={c.id}
                    className="border-t border-border hover:bg-muted/50"
                  >
                    <td className="px-3 py-2 align-middle">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={c.title}
                          width={48}
                          height={48}
                          className="rounded object-cover w-12 h-12"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span
                        className="block truncate font-medium"
                        title={c.title}
                      >
                        {c.title}
                      </span>
                      {c.titleTamil && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {c.titleTamil}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <Badge variant="outline" className="text-xs capitalize">
                        {c.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 align-top text-sm">
                      {formatPrice(c.price, c.priceLabel)}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <Badge
                        variant={
                          c.status === "published" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 align-top text-xs">
                      {c.isFeatured ? "⭐ Yes" : "No"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap align-top">
                      <Link
                        href={`/admin/classifieds/${c.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <span className="text-muted-foreground">|</span>
                      <DeleteClassifiedButton id={c.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
