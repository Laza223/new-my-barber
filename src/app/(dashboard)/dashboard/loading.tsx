/**
 * Skeleton loading for Dashboard (Reportes) page.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-muted h-7 w-40 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="bg-muted h-9 w-24 animate-pulse rounded-lg" />
          <div className="bg-muted h-9 w-24 animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card animate-pulse space-y-2 rounded-xl border p-5"
          >
            <div className="bg-muted h-3 w-20 rounded" />
            <div className="bg-muted h-7 w-24 rounded" />
            <div className="bg-muted h-2 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card animate-pulse rounded-xl border p-5">
          <div className="bg-muted mb-4 h-4 w-28 rounded" />
          <div className="bg-muted h-[200px] rounded-lg" />
        </div>
        <div className="bg-card animate-pulse rounded-xl border p-5">
          <div className="bg-muted mb-4 h-4 w-28 rounded" />
          <div className="bg-muted mx-auto h-[140px] w-[140px] rounded-full" />
        </div>
      </div>

      {/* Top services + recent sales */}
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-card animate-pulse space-y-3 rounded-xl border p-5"
          >
            <div className="bg-muted h-4 w-32 rounded" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="bg-muted h-3 flex-1 rounded" />
                <div className="bg-muted h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
