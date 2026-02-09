import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/frontend/JobCard";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { EmptyState } from "@/components/frontend/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Jobs",
  description:
    "Find job opportunities in Kilpennathur and surrounding areas. வேலைவாய்ப்புகளை கண்டறியுங்கள்.",
  path: "/jobs",
  keywords: ["jobs", "வேலைகள்", "employment", "careers", "Kilpennathur jobs"],
});

/** Revalidate jobs page every 5 minutes */
export const revalidate = 300;

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  const now = new Date();
  const openJobs = jobs.filter(
    (j) => !j.applicationDeadline || new Date(j.applicationDeadline) >= now
  );
  const closedJobs = jobs.filter(
    (j) => j.applicationDeadline && new Date(j.applicationDeadline) < now
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/jobs-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-indigo-800/55 to-purple-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Briefcase className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Jobs</h1>
          <p className="text-xl md:text-2xl mb-2">வேலைகள்</p>
          <p className="text-base md:text-lg text-blue-100 text-center max-w-3xl">
            Find job opportunities in Kilpennathur and surrounding areas
          </p>
          <div className="mt-4 flex gap-3">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              {openJobs.length} open
            </Badge>
            <Badge
              variant="outline"
              className="text-base px-4 py-1.5 border-2 border-white text-white bg-white/10"
            >
              {closedJobs.length} closed
            </Badge>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "Jobs" }]} />

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="No job listings are available at the moment. Check back later for new opportunities."
          />
        ) : (
          <section aria-label="Job listings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={{
                    id: job.id,
                    title: job.title,
                    titleTamil: job.titleTamil,
                    company: job.company,
                    location: job.location,
                    jobType: job.jobType,
                    category: job.category,
                    applicationDeadline: job.applicationDeadline,
                    publishedAt: job.publishedAt,
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
