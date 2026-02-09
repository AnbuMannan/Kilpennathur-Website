"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteEventButton } from "./DeleteEventButton";
import { EventsBulkActions } from "./EventsBulkActions";

type EventItem = {
  id: string;
  title: string;
  titleTamil: string | null;
  image: string | null;
  date: Date;
};

export function EventsListWithBulk({ items }: { items: EventItem[] }) {
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
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <EventsBulkActions
        selectedIds={Array.from(selected)}
        onClear={() => setSelected(new Set())}
      />
      <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "32%" }} />
          <col style={{ width: "32%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
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
            <th className="px-3 py-3 font-semibold">Image</th>
            <th className="px-3 py-3 font-semibold">Title (EN)</th>
            <th className="px-3 py-3 font-semibold">Title (Tamil)</th>
            <th className="px-3 py-3 font-semibold">Date</th>
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
              <td className="px-3 py-3 min-w-0">
                <span className="block truncate" title={item.titleTamil ?? ""}>
                  {item.titleTamil ?? "—"}
                </span>
              </td>
              <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                {formatDate(item.date)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <Link
                  href={`/admin/events/edit/${item.id}`}
                  className="text-primary hover:underline"
                >
                  Edit
                </Link>
                <span className="text-muted-foreground">|</span>
                <DeleteEventButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
