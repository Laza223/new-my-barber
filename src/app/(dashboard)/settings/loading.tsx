/**
 * Skeleton loading for Settings page.
 */
export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-muted h-8 w-40 animate-pulse rounded" />

      {/* Tab navigation */}
      <div className="flex gap-1 border-b pb-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-muted h-10 w-24 animate-pulse rounded-t" />
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card animate-pulse space-y-4 rounded-xl border p-5"
          >
            <div className="bg-muted h-5 w-24 rounded" />
            <div className="bg-muted h-3 w-32 rounded" />
            <div className="bg-muted h-8 w-20 rounded" />
            <div className="bg-muted h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Feature table */}
      <div className="animate-pulse overflow-hidden rounded-xl border">
        <div className="bg-muted/30 border-b p-3">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted h-4 flex-1 rounded" />
            ))}
          </div>
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 border-b p-3 last:border-0">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="bg-muted h-3 flex-1 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
