"use client";

import Image from "next/image";
import { RowActions } from "@/components/admin/RowActions";
import { DeleteClassifiedButton } from "./DeleteClassifiedButton";
import { Badge } from "@/components/ui/badge";

type ClassifiedItem = {
  id: string;
  title: string;
  titleTamil: string | null;
  type: string;
  price: number | null;
  priceLabel: string | null;
  status: string;
  isFeatured: boolean;
  images: string;
  contactName: string;
  contactPhone: string;
  location: string | null;
  createdAt: string;
};

function statusBadge(status: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize";
  if (status === "published") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "draft") return `${base} bg-amber-100 text-amber-700`;
  if (status === "closed") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
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

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function ClassifiedsListClient({ items }: { items: ClassifiedItem[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "60px" }} />
            <col />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Img</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Type</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Featured</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const firstImage = c.images
                .split(",")
                .map((u) => u.trim())
                .filter(Boolean)[0];
              return (
                <tr key={c.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2.5">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={c.title}
                        width={40}
                        height={40}
                        className="rounded object-cover w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 min-w-0">
                    <span className="block truncate font-medium" title={c.title}>
                      {c.title}
                    </span>
                    {c.titleTamil && (
                      <span className="block truncate text-xs text-muted-foreground">{c.titleTamil}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant="outline" className="text-xs capitalize">{c.type}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-sm tabular-nums">
                    {formatPrice(c.price, c.priceLabel)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={statusBadge(c.status)}>{c.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center">
                    {c.isFeatured ? (
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">Star</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <RowActions
                      editUrl={`/admin/classifieds/${c.id}/edit`}
                      title={c.title}
                      fields={[
                        { label: "Title", value: c.title },
                        { label: "Tamil Title", value: c.titleTamil },
                        { label: "Type", value: c.type },
                        { label: "Price", value: formatPrice(c.price, c.priceLabel) },
                        { label: "Status", value: c.status, type: "badge" },
                        { label: "Contact", value: `${c.contactName} (${c.contactPhone})` },
                        { label: "Location", value: c.location },
                        { label: "Image", value: firstImage ?? null, type: "image" },
                      ]}
                      deleteComponent={<DeleteClassifiedButton id={c.id} />}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
