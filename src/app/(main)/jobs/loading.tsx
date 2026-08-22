import { JobCardSkeleton } from "@/components/shared/SkeletonLoaders";

export default function JobsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-28 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-56 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Search */}
      <div className="h-10 w-full bg-muted rounded-full animate-pulse mb-6" />

      {/* Job cards */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
