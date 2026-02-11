import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Hero Skeleton */}
      <div className="relative h-[350px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Skeleton className="h-10 w-3/4 max-w-lg mb-2 bg-white/20" />
          <Skeleton className="h-6 w-1/2 max-w-md bg-white/20" />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton (70%) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>

          {/* Sidebar Skeleton (30%) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 h-[400px]">
              <Skeleton className="h-8 w-1/2 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
