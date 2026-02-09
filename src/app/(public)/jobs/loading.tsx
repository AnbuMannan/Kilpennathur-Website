import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse mb-2" />
        <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-80 md:h-96 overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
          <div className="h-8 w-32 rounded bg-gray-300 animate-pulse mb-2" />
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
