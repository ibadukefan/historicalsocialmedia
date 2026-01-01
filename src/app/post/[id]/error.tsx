'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Post page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />

      <h1 className="text-xl font-bold mb-2">Couldn&apos;t Load This Post</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        This historical moment seems to be lost in time.
        It may have been removed or there was an error loading it.
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
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
      </div>
    </div>
  )
}
