import { Skeleton } from "@/components/ui/skeleton";
import { EventCardSkeleton } from "@/components/frontend/CardSkeleton";

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-40 w-full rounded-xl mb-10" />
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
