import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 bg-white/20" />
              <Skeleton className="h-6 w-1/2 bg-white/20" />
              <Skeleton className="h-20 w-full bg-white/20" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-32 bg-white/20" />
                <Skeleton className="h-12 w-40 bg-white/20" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-5 w-24 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
