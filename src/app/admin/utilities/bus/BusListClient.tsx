"use client";

import { RowActions } from "@/components/admin/RowActions";
import { DeleteBusButton } from "./DeleteBusButton";

type BusItem = {
  id: string;
  route: string;
  routeTamil: string | null;
  busNumber: string | null;
  busType: string;
  departureTime: string;
};

function busTypeBadge(type: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium";
  const t = type.toLowerCase();
  if (t.includes("town")) return `${base} bg-blue-100 text-blue-700`;
  if (t.includes("private")) return `${base} bg-amber-100 text-amber-700`;
  if (t.includes("moffusil") || t.includes("mofussil"))
    return `${base} bg-purple-100 text-purple-700`;
  if (t.includes("setc") && t.includes("ultra"))
    return `${base} bg-emerald-100 text-emerald-700`;
  if (t.includes("setc")) return `${base} bg-teal-100 text-teal-700`;
  if (t.includes("mini")) return `${base} bg-cyan-100 text-cyan-700`;
  if (t.includes("interstate")) return `${base} bg-indigo-100 text-indigo-700`;
  return `${base} bg-gray-100 text-gray-700`;
}

export function BusListClient({ items }: { items: BusItem[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <tr>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Route</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Bus No.</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Type</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Departure</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap text-center">
                Total
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((b, i) => (
              <tr
                key={b.id}
                className="border-t border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-3 py-3 align-top">
                  <span className="block truncate font-medium" title={b.route}>
                    {b.route}
                  </span>
                  {b.routeTamil && (
                    <span
                      className="block truncate text-xs text-muted-foreground"
                      title={b.routeTamil}
                    >
                      {b.routeTamil}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 align-top text-muted-foreground font-mono text-xs">
                  {b.busNumber || "—"}
                </td>
                <td className="px-3 py-3 align-top">
                  <span className={busTypeBadge(b.busType)}>{b.busType}</span>
                </td>
                <td className="px-3 py-3 align-top">
                  <span className="font-mono text-sm font-medium text-primary">
                    {b.departureTime}
                  </span>
                </td>
                <td className="px-3 py-3 align-top text-center text-xs text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-3 py-3 align-top text-right">
                  <RowActions
                    editUrl={`/admin/utilities/bus/${b.id}/edit`}
                    title={b.route}
                    fields={[
                      { label: "Route", value: b.route },
                      { label: "Route (Tamil)", value: b.routeTamil },
                      { label: "Bus Number", value: b.busNumber },
                      { label: "Type", value: b.busType, type: "badge" },
                      { label: "Departure", value: b.departureTime },
                    ]}
                    deleteComponent={<DeleteBusButton id={b.id} />}
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
