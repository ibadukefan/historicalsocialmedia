import { ProfileListSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-muted rounded mb-2" />
          <div className="h-4 w-56 bg-muted rounded" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 animate-pulse">
          <div className="h-8 w-20 bg-muted rounded-full" />
          <div className="h-8 w-24 bg-muted rounded-full" />
          <div className="h-8 w-16 bg-muted rounded-full" />
          <div className="h-8 w-28 bg-muted rounded-full" />
        </div>
      </div>

      {/* Profile list skeleton */}
      <div className="p-4">
        <ProfileListSkeleton count={8} />
      </div>
    </div>
  )
}
