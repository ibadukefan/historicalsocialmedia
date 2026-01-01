'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console (in production, you'd send to error tracking service)
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-10 w-10 text-primary" />
        <span className="text-2xl font-bold">Tempus</span>
      </div>

      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />

      <h1 className="text-2xl font-bold mb-2">A Temporal Anomaly Occurred</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Something unexpected happened while loading this page.
        The timeline may have gotten a bit tangled.
      </p>

      <div className="flex gap-3 mb-8">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Error ID: {error.digest || 'unknown'}
      </p>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Error Details (development only)
          </summary>
          <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
            <code>{error.message}</code>
            {error.stack && (
              <>
                {'\n\n'}
                <code className="text-muted-foreground">{error.stack}</code>
              </>
            )}
          </pre>
        </details>
      )}
    </div>
  )
}
