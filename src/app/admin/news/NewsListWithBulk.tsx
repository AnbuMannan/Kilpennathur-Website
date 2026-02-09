"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { NewsBulkActions } from "./NewsBulkActions";
import { RowActions } from "@/components/admin/RowActions";

type NewsItem = {
  id: string;
  title: string;
  titleTamil?: string | null;
  image: string | null;
  category: string;
  status: string;
  views?: number;
  createdAt: Date;
};

function statusBadge(status: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize";
  if (status === "published") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "draft") return `${base} bg-amber-100 text-amber-700`;
  if (status === "closed") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
}

export function NewsListWithBulk({ items }: { items: NewsItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <NewsBulkActions
        selectedIds={Array.from(selected)}
        onClear={() => setSelected(new Set())}
      />
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "60px" }} />
            <col />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selected.size === items.length}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="rounded"
                />
              </th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Img</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Views</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                    aria-label={`Select ${item.title}`}
                    className="rounded"
                  />
                </td>
                <td className="px-3 py-2.5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5 min-w-0">
                  <Link href={`/admin/news/${item.id}/edit`} className="hover:underline">
                    <span className="block truncate font-medium" title={item.title}>
                      {item.title}
                    </span>
                  </Link>
                  {item.titleTamil && (
                    <span className="block truncate text-xs text-muted-foreground" title={item.titleTamil}>
                      {item.titleTamil}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{item.category}</td>
                <td className="px-3 py-2.5">
                  <span className={statusBadge(item.status)}>{item.status}</span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                  {item.views ?? 0}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-3 py-2.5">
                  <RowActions
                    editUrl={`/admin/news/${item.id}/edit`}
                    title={item.title}
                    fields={[
                      { label: "Title", value: item.title },
                      { label: "Tamil Title", value: item.titleTamil },
                      { label: "Category", value: item.category },
                      { label: "Status", value: item.status, type: "badge" },
                      { label: "Views", value: item.views ?? 0 },
                      { label: "Image", value: item.image, type: "image" },
                      { label: "Created", value: formatDate(item.createdAt) },
                    ]}
                    deleteComponent={<DeleteNewsButton id={item.id} />}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
