export function SkeletonCard() {
  return (
    <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
      <div className="aspect-[3/4] animate-shimmer" />
      <div className="p-3 space-y-3">
        <div className="h-4 rounded w-3/4 animate-shimmer" />
        <div className="space-y-2">
          <div className="h-3 rounded w-full animate-shimmer" />
          <div className="h-3 rounded w-1/2 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
