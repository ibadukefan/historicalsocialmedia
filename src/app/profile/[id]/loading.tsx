import { Skeleton, FeedSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Cover image skeleton */}
      <div className="h-48 bg-muted animate-pulse" />

      {/* Profile header skeleton */}
      <div className="px-4 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16">
          <div className="flex items-end gap-4">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
            <div className="mb-4 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-sm" />
        </div>

        <div className="flex gap-6 mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Posts skeleton */}
      <FeedSkeleton count={4} />
    </div>
  )
}
