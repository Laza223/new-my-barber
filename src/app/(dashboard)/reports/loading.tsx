/**
 * Skeleton loading for Reports page.
 */
export default function ReportsLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="bg-muted h-7 w-28 animate-pulse rounded" />
        <div className="bg-muted mt-1 h-4 w-48 animate-pulse rounded" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card animate-pulse space-y-2 rounded-xl border p-4"
          >
            <div className="bg-muted h-3 w-16 rounded" />
            <div className="bg-muted h-6 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-card animate-pulse rounded-xl border p-6">
        <div className="bg-muted h-4 w-32 rounded" />
        <div className="bg-muted mt-4 h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}
