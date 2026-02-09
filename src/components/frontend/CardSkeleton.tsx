import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function NewsCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-[75%]" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BusinessCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export function VillageCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
