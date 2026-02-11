import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Briefcase, Plus, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteService } from "./actions";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  const settings = await prisma.siteSetting.findFirst({
    where: { key: "enableAddService" },
  });

  const canAddService = settings?.value === "true";

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">My Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage professional service categories and their posts.
          </p>
        </div>
        {canAddService && (
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No services created yet. Add your first service category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{svc.title}</h2>
                    {svc.titleTamil && (
                      <p className="text-xs text-muted-foreground">{svc.titleTamil}</p>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  <FileText className="h-3 w-3" />
                  {svc._count.posts} post{svc._count.posts !== 1 ? "s" : ""}
                </span>
              </div>

              {svc.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {svc.description}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Link
                  href={`/admin/services/${svc.id}/posts`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Manage Posts
                </Link>
                <Link
                  href={`/admin/services/${svc.id}/edit`}
                  className="inline-flex items-center justify-center rounded-md border border-border p-1.5 hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteService(svc.id);
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-border p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
