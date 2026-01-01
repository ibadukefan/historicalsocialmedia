'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Users, Home } from 'lucide-react'
import Link from 'next/link'

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Profile page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />

      <h1 className="text-xl font-bold mb-2">Profile Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        This historical figure seems to have stepped away from the timeline.
        They may not exist in our records or there was an error.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/profiles"
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Users className="h-4 w-4" />
          Browse Figures
        </Link>
      </div>
    </div>
  )
}
