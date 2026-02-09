"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Briefcase,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  IndianRupee,
  Clock,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    titleTamil?: string | null;
    company: string;
    companyTamil?: string | null;
    location?: string | null;
    locationTamil?: string | null;
    jobType: string;
    category: string;
    salaryDescription?: string | null;
    applicationDeadline?: Date | null;
    applicationUrl?: string | null;
    publishedAt?: Date | null;
  };
}

/* ---------- Helpers ---------- */

const JOB_TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  "full-time": {
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  "part-time": {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
  },
  contract: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
  },
  internship: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  temporary: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
};

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return format(d, "MMM dd, yyyy");
}

/* ---------- Component ---------- */

export function JobCard({ job }: JobCardProps) {
  const locale = useLocale();
  const isTamil = locale === "ta";

  const displayTitle =
    isTamil && job.titleTamil ? job.titleTamil : job.title;
  const displaySubtitle =
    isTamil && job.titleTamil ? job.title : job.titleTamil;

  const displayCompany =
    isTamil && job.companyTamil ? job.companyTamil : job.company;
  const displayCompanySub =
    isTamil && job.companyTamil ? job.company : job.companyTamil;

  const displayLocation =
    isTamil && job.locationTamil ? job.locationTamil : job.location;

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline)
    : null;
  const isOpen = !deadline || deadline >= new Date();

  const typeConf = JOB_TYPE_CONFIG[job.jobType.toLowerCase()] ?? {
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-400",
  };

  return (
    <article
      className={cn(
        "group flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "overflow-hidden h-full transition-all duration-300",
        "hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700",
        !isOpen && "opacity-70"
      )}
    >
      {/* Left — Company Logo Placeholder */}
      <div className="hidden sm:flex items-center justify-center w-24 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r border-gray-100 dark:border-gray-700">
        <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center">
          <Building2 className="w-7 h-7 text-blue-500/60 dark:text-blue-400/60" />
        </div>
      </div>

      {/* Middle — Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-5">
        {/* Top row: Title + Badges */}
        <div className="flex flex-wrap items-start gap-2 mb-1.5">
          <Link
            href={`/jobs/${job.id}`}
            className="font-serif font-bold text-base sm:text-lg leading-snug text-gray-900 dark:text-gray-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors hover:underline underline-offset-2 line-clamp-2"
          >
            {displayTitle}
          </Link>
          {!isOpen && (
            <Badge variant="destructive" className="text-[10px] shrink-0">
              {isTamil ? "முடிவடைந்தது" : "Closed"}
            </Badge>
          )}
        </div>

        {/* Tamil subtitle */}
        {displaySubtitle && (
          <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 line-clamp-1 leading-relaxed mb-2">
            {displaySubtitle}
          </p>
        )}

        {/* Company */}
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="line-clamp-1">{displayCompany}</span>
          {displayCompanySub && (
            <span className="font-tamil text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              &middot; {displayCompanySub}
            </span>
          )}
        </p>

        {/* Tags row: Job Type, Category, Location, Salary */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider border-0",
              typeConf.bg,
              typeConf.text
            )}
          >
            {job.jobType}
          </Badge>
          <Badge
            variant="secondary"
            className="text-[10px] font-semibold border-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            {job.category}
          </Badge>
          {displayLocation && (
            <Badge
              variant="secondary"
              className="text-[10px] font-medium border-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 gap-0.5"
            >
              <MapPin className="w-2.5 h-2.5" /> {displayLocation}
            </Badge>
          )}
          {job.salaryDescription && (
            <Badge
              variant="secondary"
              className="text-[10px] font-medium border-0 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 gap-0.5"
            >
              <IndianRupee className="w-2.5 h-2.5" /> {job.salaryDescription}
            </Badge>
          )}
        </div>

        {/* Deadline */}
        {deadline && isOpen && (
          <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            {isTamil ? "கடைசி நாள்: " : "Apply by "}
            {format(deadline, "MMM dd, yyyy")}
          </p>
        )}
      </div>

      {/* Right — Time + Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 px-4 pb-4 sm:pb-0 sm:px-5 sm:w-44 shrink-0 sm:border-l border-gray-100 dark:border-gray-700">
        {/* Posted time */}
        {job.publishedAt && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3 h-3 shrink-0" />
            {timeAgo(job.publishedAt)}
          </span>
        )}

        {/* Apply button */}
        {isOpen && job.applicationUrl ? (
          <Button size="sm" className="gap-1.5 w-full sm:w-auto" asChild>
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isTamil ? "விண்ணப்பிக்க" : "Apply Now"}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 w-full sm:w-auto"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              {isTamil ? "விவரங்கள்" : "View Details"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
