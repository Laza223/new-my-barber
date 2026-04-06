/**
 * Skeleton loading for Services page.
 */
export default function ServicesLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-muted h-7 w-32 animate-pulse rounded" />
          <div className="bg-muted mt-1 h-4 w-48 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Service list */}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card flex animate-pulse items-center gap-3 rounded-xl border p-4"
          >
            <div className="bg-muted h-4 w-4 rounded" />
            <div className="flex-1 space-y-1">
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted h-3 w-20 rounded" />
            </div>
            <div className="bg-muted h-5 w-16 rounded" />
            <div className="bg-muted h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
