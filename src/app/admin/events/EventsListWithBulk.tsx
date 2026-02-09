"use client";

import { useState } from "react";
import { DeleteEventButton } from "./DeleteEventButton";
import { EventsBulkActions } from "./EventsBulkActions";
import { RowActions } from "@/components/admin/RowActions";

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
    <div className="border border-border rounded-lg overflow-hidden">
      <EventsBulkActions
        selectedIds={Array.from(selected)}
        onClear={() => setSelected(new Set())}
      />
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "18%" }} />
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
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title (EN)</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title (Tamil)</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
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
                  <span className="block truncate font-medium" title={item.title}>
                    {item.title}
                  </span>
                </td>
                <td className="px-3 py-2.5 min-w-0">
                  <span className="block truncate text-muted-foreground" title={item.titleTamil ?? ""}>
                    {item.titleTamil ?? "—"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                  {formatDate(item.date)}
                </td>
                <td className="px-3 py-2.5">
                  <RowActions
                    editUrl={`/admin/events/edit/${item.id}`}
                    title={item.title}
                    fields={[
                      { label: "Title", value: item.title },
                      { label: "Tamil Title", value: item.titleTamil },
                      { label: "Date", value: formatDate(item.date) },
                      { label: "Image", value: item.image, type: "image" },
                    ]}
                    deleteComponent={<DeleteEventButton id={item.id} />}
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
