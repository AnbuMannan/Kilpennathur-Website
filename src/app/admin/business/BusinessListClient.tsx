"use client";

import { RowActions } from "@/components/admin/RowActions";

type BusinessItem = {
  id: string;
  name: string;
  nameTamil: string | null;
  category: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function BusinessListClient({ items }: { items: BusinessItem[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "60px" }} />
            <col />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "56px" }} />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Img</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border hover:bg-muted/50 transition-colors">
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
                  <span className="block truncate font-medium" title={item.name}>
                    {item.name}
                  </span>
                  {item.nameTamil && (
                    <span className="block truncate text-xs text-muted-foreground">{item.nameTamil}</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{item.category}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-sm tabular-nums">{item.phone ?? "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-3 py-2.5">
                  <RowActions
                    editUrl={`/admin/business/${item.id}/edit`}
                    title={item.name}
                    fields={[
                      { label: "Name", value: item.name },
                      { label: "Tamil Name", value: item.nameTamil },
                      { label: "Category", value: item.category },
                      { label: "Phone", value: item.phone },
                      { label: "Image", value: item.image, type: "image" },
                      { label: "Created", value: formatDate(item.createdAt) },
                    ]}
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
