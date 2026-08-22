import { SearchResultRowSkeleton } from "@/components/shared/SkeletonLoaders";

export default function SearchLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="h-12 w-full bg-muted rounded-full animate-pulse mb-6" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Result count line */}
      <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4" />

      {/* Result sections */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, section) => (
          <section key={section}>
            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SearchResultRowSkeleton key={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
