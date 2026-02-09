import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBusinessPage() {
  const businessList = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(date);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Manage Business</h1>
        <Link
          href="/admin/business/new"
          className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Add Business
        </Link>
      </div>

      {businessList.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No businesses found. Create the first one.
        </p>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessList.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/business/${item.id}/edit`}
                      className="text-primary hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:underline ml-3"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
