import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Clock,
  Share2,
} from "lucide-react";
import { format } from "date-fns";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    select: { title: true, company: true, description: true },
  });
  if (!job) {
    return { title: "Not Found" };
  }
  const description =
    job.description?.slice(0, 160) ??
    `${job.title} at ${job.company} - Jobs in Kilpennathur`;
  return {
    title: `${job.title} - Jobs | Kilpennathur`,
    description,
    openGraph: {
      title: job.title,
      description,
    },
  };
}

/* Map jobType to Schema.org employmentType */
function mapEmploymentType(jobType: string): string {
  const map: Record<string, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACTOR",
    internship: "INTERN",
    temporary: "TEMPORARY",
  };
  return map[jobType.toLowerCase()] ?? "OTHER";
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) notFound();

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline)
    : null;
  const isOpen = !deadline || deadline >= new Date();

  /* ── JSON-LD Structured Data (Google Jobs Rich Snippet) ── */
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://kilpennathur.com";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobPostingLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ?? job.title,
    datePosted: (job.publishedAt ?? job.createdAt).toISOString(),
    employmentType: mapEmploymentType(job.jobType),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location ?? "Kilpennathur",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/jobs/${job.id}`,
    },
  };
  if (deadline) {
    jobPostingLd.validThrough = deadline.toISOString();
  }
  if (job.salaryDescription) {
    jobPostingLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.salaryDescription,
      },
    };
  }
  if (job.applicationUrl) {
    jobPostingLd.directApply = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* JSON-LD Structured Data for Google Jobs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
      />

      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: "Jobs", href: "/jobs" },
            { label: job.title },
          ]}
        />

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{job.jobType}</Badge>
            <Badge variant="outline">{job.category}</Badge>
            {!isOpen && (
              <Badge variant="destructive">Application Closed</Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{job.title}</h1>
          {job.titleTamil && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {job.titleTamil}
            </p>
          )}

          <p className="text-lg font-semibold text-blue-600 flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5" />
            {job.company}
          </p>
          {job.companyTamil && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {job.companyTamil}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}
            {job.experience && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {job.experience}
              </span>
            )}
            {deadline && isOpen && (
              <span className="flex items-center gap-1.5 text-amber-700">
                <Calendar className="w-4 h-4" />
                Apply by {format(deadline, "MMMM dd, yyyy")}
              </span>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.qualifications && (
            <>
              <Separator className="my-6" />
              <h2 className="text-xl font-bold mb-3">Qualifications</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.qualifications}
              </p>
            </>
          )}

          {job.salaryDescription && (
            <>
              <Separator className="my-6" />
              <h2 className="text-xl font-bold mb-3">Salary</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {job.salaryDescription}
              </p>
            </>
          )}

          {job.benefits && (
            <>
              <Separator className="my-6" />
              <h2 className="text-xl font-bold mb-3">Benefits</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.benefits}
              </p>
            </>
          )}

          {(job.contactEmail || job.contactPhone || job.applicationUrl) &&
            isOpen && (
              <>
                <Separator className="my-8" />
                <h2 className="text-xl font-bold mb-4">How to Apply</h2>
                <div className="flex flex-col gap-3">
                  {job.contactEmail && (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Mail className="w-5 h-5" />
                      {job.contactEmail}
                    </a>
                  )}
                  {job.contactPhone && (
                    <a
                      href={`tel:${job.contactPhone.replace(/\D/g, "")}`}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Phone className="w-5 h-5" />
                      {job.contactPhone}
                    </a>
                  )}
                  {job.applicationUrl && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Globe className="w-5 h-5" />
                      Apply Online
                    </a>
                  )}
                </div>
              </>
            )}

          <div className="flex items-center gap-4 mt-8 pt-8 border-t">
            <Share2 className="w-5 h-5 text-gray-500 shrink-0" aria-hidden />
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Share this job:
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
