"use client";

import { RowActions } from "@/components/admin/RowActions";
import { DeleteSchemeButton } from "./DeleteSchemeButton";
import { Badge } from "@/components/ui/badge";

type SchemeItem = {
  id: string;
  title: string;
  titleTamil: string | null;
  sponsor: string;
  beneficiaryType: string;
  status: string;
  createdAt: string;
};

function statusBadge(status: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize";
  if (status === "published") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "draft") return `${base} bg-amber-100 text-amber-700`;
  if (status === "closed") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-700`;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function SchemesListClient({ items }: { items: SchemeItem[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sponsor</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Beneficiary</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-3 py-2.5 min-w-0">
                  <span className="block truncate font-medium" title={s.title}>
                    {s.title}
                  </span>
                  {s.titleTamil && (
                    <span className="block truncate text-xs text-muted-foreground">{s.titleTamil}</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className="text-xs">{s.sponsor}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="secondary" className="text-xs">{s.beneficiaryType}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <span className={statusBadge(s.status)}>{s.status}</span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                  {formatDate(s.createdAt)}
                </td>
                <td className="px-3 py-2.5">
                  <RowActions
                    editUrl={`/admin/schemes/${s.id}/edit`}
                    title={s.title}
                    fields={[
                      { label: "Title", value: s.title },
                      { label: "Tamil Title", value: s.titleTamil },
                      { label: "Sponsor", value: s.sponsor },
                      { label: "Beneficiary", value: s.beneficiaryType },
                      { label: "Status", value: s.status, type: "badge" },
                      { label: "Created", value: formatDate(s.createdAt) },
                    ]}
                    deleteComponent={<DeleteSchemeButton id={s.id} />}
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
