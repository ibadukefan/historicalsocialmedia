import { Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getPosts, getProfile } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Timeline View | Tempus',
  description: 'View historical events in chronological order on an interactive timeline.',
}

export default function TimelinePage() {
  const posts = getPosts()

  // Group posts by month/year
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.timestamp)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  // Sort keys chronologically (oldest first for timeline)
  const sortedKeys = Object.keys(groupedPosts).sort()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline View
        </h1>
        <p className="text-sm text-muted-foreground">
          {posts.length} moments across history
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="py-6">
          {sortedKeys.map((key) => {
            const [year, month] = key.split('-')
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })
            const monthPosts = groupedPosts[key]

            return (
              <div key={key} className="relative mb-8">
                {/* Month marker */}
                <div className="flex items-center gap-4 mb-4 pl-4">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{monthName} {year}</h2>
                    <p className="text-sm text-muted-foreground">{monthPosts.length} posts</p>
                  </div>
                </div>

                {/* Posts for this month */}
                <div className="ml-16 space-y-3">
                  {monthPosts.slice(0, 10).map((post) => {
                    const profile = getProfile(post.authorId)
                    const date = new Date(post.timestamp)

                    return (
                      <div
                        key={post.id}
                        className="relative"
                      >
                        {/* Connector dot */}
                        <div className="absolute -left-10 top-3 w-2 h-2 rounded-full bg-muted-foreground/30" />

                        <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {profile?.displayName || 'Unknown'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            {post.location && (
                              <span className="text-xs text-muted-foreground">
                                · {post.location.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                    )
                  })}

                  {monthPosts.length > 10 && (
                    <Link
                      href={`/?month=${key}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline ml-2"
                    >
                      View all {monthPosts.length} posts
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">About the Timeline</h3>
          <p className="text-sm text-muted-foreground">
            This timeline shows posts from across human history - from Ancient Greece to the 20th century.
            Events are shown chronologically, with the oldest first. Each era brings its own voices:
            philosophers, emperors, revolutionaries, soldiers, inventors, and ordinary people living through extraordinary times.
          </p>
        </div>
      </div>
    </div>
  )
}
