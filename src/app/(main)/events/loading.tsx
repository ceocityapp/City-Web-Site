import { EventCardSkeleton } from "@/components/shared/SkeletonLoaders";

export default function EventsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-60 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Event cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
