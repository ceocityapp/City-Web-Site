export default function MainLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-28 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
          </div>
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}
