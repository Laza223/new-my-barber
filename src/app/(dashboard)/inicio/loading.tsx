/**
 * Skeleton loading for Inicio (Hoy) page.
 */
export default function InicioLoading() {
  return (
    <div className="flex h-[calc(100dvh-208px)] flex-col overflow-hidden md:h-[calc(100dvh-112px)]">
      {/* Header */}
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <div>
          <div className="bg-muted h-6 w-16 animate-pulse rounded" />
          <div className="bg-muted mt-1 h-3 w-32 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-28 animate-pulse rounded-lg" />
      </div>

      {/* Stats cards */}
      <div className="mt-2 grid shrink-0 grid-cols-2 gap-3 md:grid-cols-4">
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

      {/* Sales list placeholder */}
      <div className="mt-4 flex-1 space-y-2 overflow-hidden">
        <div className="bg-muted h-4 w-32 animate-pulse rounded" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card flex animate-pulse items-center gap-3 rounded-lg border p-3"
          >
            <div className="bg-muted h-4 w-12 rounded" />
            <div className="bg-muted h-4 flex-1 rounded" />
            <div className="bg-muted h-4 w-16 rounded" />
            <div className="bg-muted h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
