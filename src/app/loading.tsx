import { SkeletonGrid } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="h-10 bg-gray-800 rounded-lg w-48 animate-pulse" />
      <SkeletonGrid />
    </div>
  );
}

