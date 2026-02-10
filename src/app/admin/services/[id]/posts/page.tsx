import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, ArrowLeft, Pencil, Trash2, Eye } from "lucide-react";
import { deleteServicePost } from "../../actions";

function statusBadge(status: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium";
  if (status === "published") return `${base} bg-emerald-100 text-emerald-700`;
  return `${base} bg-amber-100 text-amber-700`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

export default async function AdminServicePostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!service) notFound();

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/services" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          All Services
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">{service.title}</h1>
          {service.titleTamil && (
            <p className="text-muted-foreground text-sm mt-1">{service.titleTamil}</p>
          )}
          <p className="text-muted-foreground text-sm mt-1">
            {service.posts.length} post{service.posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/admin/services/${id}/posts/new`}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      {service.posts.length === 0 ? (
        <p className="text-muted-foreground py-8">
          No posts yet. Create your first post for this service.
        </p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 sticky top-0">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Created</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {service.posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      {post.titleTamil && (
                        <p className="text-xs text-muted-foreground">{post.titleTamil}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={statusBadge(post.status)}>{post.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/services/${service.slug}/posts/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-md border border-border p-1.5 hover:bg-muted transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/services/${id}/posts/${post.id}/edit`}
                        className="inline-flex items-center justify-center rounded-md border border-border p-1.5 hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteServicePost(post.id);
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
