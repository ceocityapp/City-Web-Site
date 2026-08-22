import { ShopCardSkeleton } from "@/components/shared/SkeletonLoaders";

export default function MarketplaceLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6 mt-6">
        <div className="h-10 flex-1 bg-muted rounded-full animate-pulse" />
        <div className="h-10 w-24 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Featured heading */}
      <div className="mb-8">
        <div className="h-6 w-56 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ShopCardSkeleton key={`featured-${i}`} />
          ))}
        </div>
      </div>

      {/* All shops */}
      <div>
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShopCardSkeleton key={`shop-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
