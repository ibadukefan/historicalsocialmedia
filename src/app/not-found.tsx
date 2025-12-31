import Link from 'next/link'
import { Clock, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <Clock className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">Lost in Time</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you're looking for doesn't exist in any era we've documented yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
      >
        <Home className="h-4 w-4" />
        Return to the Feed
      </Link>
    </div>
  )
}
