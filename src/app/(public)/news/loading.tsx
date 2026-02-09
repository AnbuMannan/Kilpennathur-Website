import { Skeleton } from "@/components/ui/skeleton";
import { NewsCardSkeleton } from "@/components/frontend/CardSkeleton";

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-48 mb-6" />
        <header className="mb-8">
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </header>
        <section className="mb-8 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-24" />
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </section>
      </div>
    </div>
  );
}
