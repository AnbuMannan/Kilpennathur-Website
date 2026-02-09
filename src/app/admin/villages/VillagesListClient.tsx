"use client";

import { RowActions } from "@/components/admin/RowActions";
import { DeleteVillageButton } from "./DeleteVillageButton";

type VillageItem = {
  id: string;
  name: string;
  nameTamil: string;
  slug: string;
  description: string | null;
  image: string | null;
  presidentName: string | null;
  population: number | null;
  totalStreets: number | null;
  wardCount: number | null;
  createdAt: string;
};

function computeCompletion(v: VillageItem): number {
  const fields = [v.description, v.image, v.presidentName, v.population];
  const filled = fields.filter((f) => f != null && f !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function completionColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function completionTextColor(pct: number) {
  if (pct >= 100) return "text-emerald-700";
  if (pct >= 50) return "text-amber-700";
  return "text-red-700";
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function VillagesListClient({ items }: { items: VillageItem[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name (EN)</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name (Tamil)</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Completion</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Population</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => {
              const pct = computeCompletion(v);
              return (
                <tr key={v.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <span className="block truncate font-medium" title={v.name}>
                      {v.name}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="block truncate text-muted-foreground" title={v.nameTamil}>
                      {v.nameTamil}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${completionColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium tabular-nums ${completionTextColor(pct)}`}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                    {v.population != null ? v.population.toLocaleString("en-IN") : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                    {formatDate(v.createdAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <RowActions
                      editUrl={`/admin/villages/edit/${v.id}`}
                      title={v.name}
                      fields={[
                        { label: "Name", value: v.name },
                        { label: "Tamil Name", value: v.nameTamil },
                        { label: "Slug", value: v.slug },
                        { label: "Population", value: v.population },
                        { label: "President", value: v.presidentName },
                        { label: "Streets", value: v.totalStreets },
                        { label: "Wards", value: v.wardCount },
                        { label: "Image", value: v.image, type: "image" },
                        { label: "Completion", value: `${pct}%` },
                      ]}
                      deleteComponent={<DeleteVillageButton id={v.id} />}
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
