import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCardSkeleton } from "@/components/frontend/CardSkeleton";

export default function DirectoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-40 w-full rounded-xl mb-8" />
        <Skeleton className="h-11 max-w-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <BusinessCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
