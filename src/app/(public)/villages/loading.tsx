import { Skeleton } from "@/components/ui/skeleton";
import { VillageCardSkeleton } from "@/components/frontend/CardSkeleton";

export default function VillagesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-40 w-full rounded-xl mb-8" />
        <Skeleton className="h-11 max-w-2xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <VillageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
