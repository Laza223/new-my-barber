/**
 * Skeleton loading for New Sale page.
 */
export default function NewSaleLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div>
        <div className="bg-muted h-7 w-36 animate-pulse rounded" />
        <div className="bg-muted mt-1 h-4 w-48 animate-pulse rounded" />
      </div>

      {/* Step 1: Professional selector */}
      <div className="space-y-3">
        <div className="bg-muted h-4 w-28 animate-pulse rounded" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card flex animate-pulse items-center gap-3 rounded-xl border p-3"
            >
              <div className="bg-muted h-8 w-8 rounded-full" />
              <div className="bg-muted h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Service selector */}
      <div className="space-y-3">
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card flex animate-pulse items-center justify-between rounded-xl border p-3"
            >
              <div className="bg-muted h-4 w-28 rounded" />
              <div className="bg-muted h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="bg-muted h-11 w-full animate-pulse rounded-lg" />
    </div>
  );
}
