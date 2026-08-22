import { CommunityCardSkeleton } from "@/components/shared/SkeletonLoaders";

export default function CommunitiesLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-40 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Search */}
      <div className="h-10 w-full bg-muted rounded-full animate-pulse mb-6" />

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-28 bg-muted rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Featured */}
      <div className="mb-8">
        <div className="h-6 w-56 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommunityCardSkeleton key={`featured-${i}`} />
          ))}
        </div>
      </div>

      {/* All communities */}
      <div>
        <div className="h-6 w-56 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CommunityCardSkeleton key={`community-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
