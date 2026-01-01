'use client'

import { AlertTriangle, RefreshCw, Clock } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background text-foreground">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Tempus</span>
          </div>

          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />

          <h1 className="text-2xl font-bold mb-2">Critical Error</h1>
          <p className="text-gray-500 mb-6 max-w-md">
            A serious error occurred. We apologize for the inconvenience.
          </p>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <p className="text-xs text-gray-400 mt-8">
            Error ID: {error.digest || 'unknown'}
          </p>
        </div>
      </body>
    </html>
  )
}
