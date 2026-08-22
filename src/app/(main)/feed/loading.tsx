import { PostCardSkeleton } from "@/components/shared/SkeletonLoaders";

export default function FeedLoading() {
  return (
    <div className="flex justify-center">
      <div className="flex-1 max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-28 bg-muted rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
        </div>

        {/* Story bar */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex gap-3 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                <div className="h-3 w-14 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full bg-card border border-border rounded-xl h-11 p-1 mb-6 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Post cards */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
