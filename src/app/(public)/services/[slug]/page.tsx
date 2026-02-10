import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceHero } from "@/components/frontend/ServiceHero";
import { DynamicIcon } from "@/lib/icons";
import {
  Calendar,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    select: { title: true, titleTamil: true, description: true },
  });
  if (!service) return { title: "Not Found" };

  return {
    title: `${service.title} | Kilpennathur Services`,
    description:
      service.description ??
      `${service.title} - Professional service offered in Kilpennathur.`,
  };
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

export default async function ServiceLandingPage({ params }: Props) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Banner */}
      <ServiceHero
        title={service.title}
        titleTamil={service.titleTamil}
        subtitle={service.description}
        iconName={service.icon}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <div className="container max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: Posts Grid */}
          <main className="lg:col-span-2">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Latest Updates
            </h2>

            {service.posts.length === 0 ? (
              <div className="rounded-xl border border-border bg-white dark:bg-gray-900 p-8 text-center">
                <p className="text-muted-foreground">
                  No updates posted yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/services/${service.slug}/posts/${post.slug}`}
                    className="group rounded-xl border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {post.image ? (
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 flex items-center justify-center">
                        <DynamicIcon name={service.icon} className="h-10 w-10 text-indigo-300 dark:text-indigo-700" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.titleTamil && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {post.titleTamil}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Read
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar: Quick Contact */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="rounded-xl border border-border bg-white dark:bg-gray-900 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Contact for Service
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2">
                      <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Call Us
                      </p>
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        WhatsApp
                      </p>
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

                <div className="mt-5 pt-4 border-t border-border">
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

              {/* All Services Sidebar */}
              <div className="rounded-xl border border-border bg-white dark:bg-gray-900 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  All Services
                </h3>
                <AllServicesLinks currentSlug={service.slug} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

async function AllServicesLinks({ currentSlug }: { currentSlug: string }) {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <ul className="space-y-1">
      {services.map((s) => (
        <li key={s.id}>
          <Link
            href={`/services/${s.slug}`}
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              s.slug === currentSlug
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {s.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
