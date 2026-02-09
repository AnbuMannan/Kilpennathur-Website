import Link from "next/link";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    titleTamil?: string | null;
    company: string;
    location?: string | null;
    jobType: string;
    category: string;
    applicationDeadline?: Date | null;
    publishedAt?: Date | null;
  };
}

export function JobCard({ job }: JobCardProps) {
  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline)
    : null;
  const isOpen = !deadline || deadline >= new Date();

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {job.jobType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {job.category}
            </Badge>
            {!isOpen && (
              <Badge variant="destructive" className="text-xs">
                Closed
              </Badge>
            )}
          </div>

          <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>

          {job.titleTamil && (
            <p className="text-gray-600 text-sm mb-2">{job.titleTamil}</p>
          )}

          <p className="text-gray-700 font-medium mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="line-clamp-1">{job.company}</span>
          </p>

          {job.location && (
            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="line-clamp-1">{job.location}</span>
            </p>
          )}

          {deadline && isOpen && (
            <p className="text-sm text-amber-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              Apply by {format(deadline, "MMM dd, yyyy")}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0">
          <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
