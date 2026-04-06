/**
 * Skeleton loading for Professionals page.
 */
export default function ProfessionalsLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-muted h-7 w-40 animate-pulse rounded" />
          <div className="bg-muted mt-1 h-4 w-56 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card animate-pulse rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-28 rounded" />
                <div className="bg-muted h-3 w-20 rounded" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="bg-muted h-3 w-12 rounded" />
                  <div className="bg-muted h-5 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
