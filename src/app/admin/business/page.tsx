import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BusinessListClient } from "./BusinessListClient";

export default async function AdminBusinessPage() {
  const businessList = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Manage Business</h1>
        <Link
          href="/admin/business/new"
          className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Add Business
        </Link>
      </div>

      <p className="text-muted-foreground mb-4 text-sm">
        {businessList.length} listing(s) total
      </p>

      {businessList.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No businesses found. Create the first one.
        </p>
      ) : (
        <BusinessListClient
          items={businessList.map((item) => ({
            id: item.id,
            name: item.name,
            nameTamil: item.nameTamil,
            category: item.category,
            phone: item.phone,
            image: item.image,
            createdAt: item.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
