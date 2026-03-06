/**
 * Skeleton loading for Sales page.
 */
export default function SalesLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-muted h-7 w-28 animate-pulse rounded" />
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Sales table */}
      <div className="animate-pulse overflow-hidden rounded-xl border">
        <div className="bg-muted/30 border-b p-3">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-muted h-4 flex-1 rounded" />
            ))}
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 border-b p-3 last:border-0">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="bg-muted h-3 flex-1 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
