import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/components/frontend/BusinessCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(date);
}

function telHref(phone: string): string {
  const cleaned = phone.replace(/[\s\-\.()]/g, "");
  return `tel:${cleaned.startsWith("+") ? cleaned : `+${cleaned}`}`;
}

function whatsappHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id },
    select: { name: true, description: true, image: true },
  });
  if (!business) {
    return { title: "Not Found" };
  }
  return {
    title: `${business.name} - Business Directory | Kilpennathur`,
    description: business.description ?? undefined,
    openGraph: {
      title: business.name,
      description: business.description ?? undefined,
      images: business.image ? [business.image] : [],
    },
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
  });

  if (!business) notFound();

  const [relatedBusinesses, categoryRecord] = await Promise.all([
    prisma.business.findMany({
      where: {
        category: business.category,
        id: { not: business.id },
      },
      orderBy: { name: "asc" },
      take: 3,
    }),
    prisma.category.findFirst({
      where: { name: business.category, type: "business" },
      select: { slug: true },
    }),
  ]);

  const categorySlug = categoryRecord?.slug ?? null;
  const moreInCategoryHref = categorySlug
    ? `/directory?category=${categorySlug}`
    : "/directory";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Business Directory", href: "/directory" },
            { label: business.name },
          ]}
        />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {business.image ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={business.image}
                  alt={business.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                aria-hidden
              >
                <Building2 className="h-20 w-20 shrink-0 opacity-90" />
              </div>
            )}

            {/* Business info */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {business.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
              {business.nameTamil && (
                <p className="mt-1 text-xl text-gray-600">{business.nameTamil}</p>
              )}
              {business.description && (
                <div
                  className="mt-4 prose prose-neutral max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: business.description
                      .split("\n\n")
                      .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
                      .join(""),
                  }}
                />
              )}
            </div>
          </div>

          {/* Right column */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.phone && (
                  <a
                    href={telHref(business.phone)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden />
                    {business.phone}
                  </a>
                )}
                {business.whatsapp && (
                  <a
                    href={whatsappHref(business.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {business.whatsapp}
                  </a>
                )}
                {business.website && (
                  <a
                    href={
                      business.website.startsWith("http")
                        ? business.website
                        : `https://${business.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Globe className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{business.website}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                    <span className="whitespace-pre-line">{business.address}</span>
                  </div>
                )}
                {!business.phone && !business.whatsapp && !business.website && !business.address && (
                  <p className="text-sm text-muted-foreground">No contact details listed.</p>
                )}
              </CardContent>
            </Card>

            {/* Business details */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Business Details</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  {business.category}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Listed:</span>{" "}
                  {formatDate(business.createdAt)}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related businesses */}
        {relatedBusinesses.length > 0 && (
          <section className="mt-12" aria-label="Related businesses">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                More in {business.category}
              </h2>
              <Link
                href={moreInCategoryHref}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all in {business.category}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBusinesses.map((item) => (
                <BusinessCard
                  key={item.id}
                  business={{
                    id: item.id,
                    name: item.name,
                    nameTamil: item.nameTamil,
                    category: item.category,
                    phone: item.phone,
                    whatsapp: item.whatsapp,
                    address: item.address,
                    description: item.description,
                    image: item.image,
                    website: item.website,
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
