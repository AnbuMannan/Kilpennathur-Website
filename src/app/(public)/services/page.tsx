import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { ShieldCheck, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services | Kilpennathur",
  description:
    "Professional services offered in Kilpennathur — Insurance, GST filing, Tax consulting, and more.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { posts: { where: { status: "published" } } } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Our Services" }]} />

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            எங்கள் சேவைகள் — Professional services to help you with Insurance, Taxation, GST filing, and more.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            Services coming soon. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.id}
                href={`/services/${svc.slug}`}
                className="group rounded-xl border border-border bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2.5 shrink-0">
                    <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {svc.title}
                    </h2>
                    {svc.titleTamil && (
                      <p className="text-sm text-muted-foreground">{svc.titleTamil}</p>
                    )}
                  </div>
                </div>

                {svc.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {svc.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    {svc._count.posts} update{svc._count.posts !== 1 ? "s" : ""}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                    View
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
