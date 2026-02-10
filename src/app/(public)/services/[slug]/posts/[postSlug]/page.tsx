import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import {
  Calendar,
  ArrowLeft,
  Phone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string; postSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const post = await prisma.servicePost.findFirst({
    where: { slug: postSlug, status: "published", service: { slug } },
    include: { service: { select: { title: true } } },
  });
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | ${post.service.title} | Kilpennathur`,
    description: `${post.title} - ${post.service.title} service update on Kilpennathur.com`,
    openGraph: {
      title: post.title,
      description: `${post.title} - ${post.service.title}`,
      type: "article",
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p.replace(/\n/g, "<br />"))}</p>`)
    .join("");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}

export default async function ServicePostDetailPage({ params }: Props) {
  const { slug, postSlug } = await params;

  const post = await prisma.servicePost.findFirst({
    where: { slug: postSlug, status: "published", service: { slug } },
    include: { service: true },
  });

  if (!post) notFound();

  // Related posts from same service
  const relatedPosts = await prisma.servicePost.findMany({
    where: {
      serviceId: post.serviceId,
      status: "published",
      id: { not: post.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href={`/services/${slug}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {post.service.title}
        </Link>

        <Breadcrumbs
          items={[
            { label: "Services", href: "/services" },
            { label: post.service.title, href: `/services/${slug}` },
            { label: post.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-6">
          {/* Main Content */}
          <main className="lg:col-span-3">
            <article>
              <header className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {post.service.title}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h1>
                {post.titleTamil && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {post.titleTamil}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800 mt-4" />
              </header>

              {post.image && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted mb-8">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div
                className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />

              {post.contentTamil && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-8" />
                  <div
                    className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(post.contentTamil),
                    }}
                  />
                </>
              )}
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="rounded-xl border border-border bg-white dark:bg-gray-900 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Contact for Service
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2">
                    <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <a
                      href="tel:+919876543210"
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                    <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">WhatsApp</p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Chat Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 text-white py-2.5 text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Get a Free Consultation
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              More from {post.service.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/services/${slug}/posts/${rp.slug}`}
                  className="group rounded-xl border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-all"
                >
                  {rp.image ? (
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 flex items-center justify-center">
                      <ShieldCheck className="h-8 w-8 text-indigo-300 dark:text-indigo-700" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 transition-colors">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(rp.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
