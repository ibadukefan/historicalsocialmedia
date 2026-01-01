import { TimelineSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="p-4">
        <TimelineSkeleton />
      </div>
    </div>
  )
}
