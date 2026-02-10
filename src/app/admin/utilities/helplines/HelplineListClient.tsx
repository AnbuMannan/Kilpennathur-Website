"use client";

import { RowActions } from "@/components/admin/RowActions";
import { DeleteHelplineButton } from "./DeleteHelplineButton";

type HelplineItem = {
  id: string;
  title: string;
  titleTamil: string | null;
  number: string;
  category: string;
};

function categoryBadge(category: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium";
  const c = category.toLowerCase();
  if (c === "emergency") return `${base} bg-red-100 text-red-700`;
  if (c === "medical") return `${base} bg-emerald-100 text-emerald-700`;
  if (c === "electricity" || c === "eb") return `${base} bg-amber-100 text-amber-700`;
  if (c === "water") return `${base} bg-blue-100 text-blue-700`;
  if (c === "government") return `${base} bg-purple-100 text-purple-700`;
  if (c === "panchayat") return `${base} bg-indigo-100 text-indigo-700`;
  if (c === "fire") return `${base} bg-orange-100 text-orange-700`;
  return `${base} bg-gray-100 text-gray-700`;
}

export function HelplineListClient({ items }: { items: HelplineItem[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <tr>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Title</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Number</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Category</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap text-center">
                #
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((h, i) => (
              <tr
                key={h.id}
                className="border-t border-border hover:bg-muted/50 transition-colors"
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
                <td className="px-3 py-3 align-top">
                  <a
                    href={`tel:${h.number}`}
                    className="font-mono text-sm font-medium text-primary hover:underline"
                  >
                    {h.number}
                  </a>
                </td>
                <td className="px-3 py-3 align-top">
                  <span className={categoryBadge(h.category)}>{h.category}</span>
                </td>
                <td className="px-3 py-3 align-top text-center text-xs text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-3 py-3 align-top text-right">
                  <RowActions
                    editUrl={`/admin/utilities/helplines/${h.id}/edit`}
                    title={h.title}
                    fields={[
                      { label: "Title", value: h.title },
                      { label: "Title (Tamil)", value: h.titleTamil },
                      { label: "Number", value: h.number },
                      { label: "Category", value: h.category, type: "badge" },
                    ]}
                    deleteComponent={<DeleteHelplineButton id={h.id} />}
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
