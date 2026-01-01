'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function EraError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Era page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />

      <h1 className="text-xl font-bold mb-2">Era Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        This era seems to be outside our timeline coverage.
        It may not exist yet or there was an error loading it.
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
          href="/explore"
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          Explore Eras
        </Link>
      </div>
    </div>
  )
}
