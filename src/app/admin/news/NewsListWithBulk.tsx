"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { NewsBulkActions } from "./NewsBulkActions";

type NewsItem = {
  id: string;
  title: string;
  image: string | null;
  category: string;
  status: string;
  createdAt: Date;
};

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
    <div className="border border-border rounded-md overflow-hidden">
      <NewsBulkActions
        selectedIds={Array.from(selected)}
        onClear={() => setSelected(new Set())}
      />
      <table className="w-full text-left" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "90px" }} />
          <col />
          <col style={{ width: "12%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>
        <thead className="bg-muted">
          <tr>
            <th className="px-3 py-3">
              <input
                type="checkbox"
                checked={items.length > 0 && selected.size === items.length}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </th>
            <th className="px-3 py-3 font-semibold">Thumbnail</th>
            <th className="px-3 py-3 font-semibold">Title</th>
            <th className="px-3 py-3 font-semibold">Category</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-3 py-3 font-semibold">Created</th>
            <th className="px-3 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border hover:bg-muted/50">
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggle(item.id)}
                  aria-label={`Select ${item.title}`}
                />
              </td>
              <td className="px-3 py-3 w-[90px] shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover shrink-0"
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </td>
              <td className="px-3 py-3 min-w-0">
                <span className="block truncate" title={item.title}>
                  {item.title}
                </span>
              </td>
              <td className="px-3 py-3">{item.category}</td>
              <td className="px-3 py-3 capitalize">
                {item.status === "published" || item.status === "draft"
                  ? item.status
                  : "-"}
              </td>
              <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                {formatDate(item.createdAt)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <Link href={`/admin/news/${item.id}/edit`} className="text-primary hover:underline mr-3">
                  Edit
                </Link>
                <span className="text-muted-foreground">|</span>
                <DeleteNewsButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
