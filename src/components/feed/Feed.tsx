'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2, Calendar } from 'lucide-react'
import { Post, Profile } from '@/types'
import { PostCard } from './PostCard'
import { cn } from '@/lib/utils'

interface FeedProps {
  initialPosts: Post[]
  profiles: Record<string, Profile>
  hasMore?: boolean
  loadMore?: () => Promise<Post[]>
}

export function Feed({ initialPosts, profiles, hasMore = false, loadMore }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(hasMore)
  const parentRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Group posts by date for date headers
  const postsWithDates = groupPostsByDate(posts)

  // Virtual list for performance
  const virtualizer = useVirtualizer({
    count: postsWithDates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index) => {
      const item = postsWithDates[index]
      if (item.type === 'date-header') return 40
      return 200 // Estimate for post card
    }, [postsWithDates]),
    overscan: 5,
  })

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !loadMore || !canLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && canLoadMore) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [loading, canLoadMore, loadMore])

  const handleLoadMore = async () => {
    if (!loadMore || loading) return

    setLoading(true)
    try {
      const newPosts = await loadMore()
      if (newPosts.length === 0) {
        setCanLoadMore(false)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="feed-container">
      {/* Era Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl">Your Feed</h1>
        <p className="text-sm text-muted-foreground">American Revolution Era</p>
      </div>

      {/* Virtualized List */}
      <div
        ref={parentRef}
        className="h-[calc(100vh-8rem)] overflow-auto"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = postsWithDates[virtualItem.index]

            if (item.type === 'date-header') {
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <DateHeader date={item.date} />
                </div>
              )
            }

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                data-index={virtualItem.index}
              >
                <PostCard
                  post={item.post}
                  author={profiles[item.post.authorId]}
                />
              </div>
            )
          })}
        </div>

        {/* Load more trigger */}
        {canLoadMore && (
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more history...</span>
              </div>
            ) : (
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Load more
              </button>
            )}
          </div>
        )}

        {/* End of feed */}
        {!canLoadMore && posts.length > 0 && (
          <div className="py-12 text-center border-t border-border">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              You&apos;ve reached the end of this era.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              More historical periods coming soon!
            </p>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No posts to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DateHeader({ date }: { date: string }) {
  return (
    <div className="sticky top-28 z-[5] flex items-center justify-center py-2">
      <div className="date-badge">
        <Calendar className="h-3 w-3" />
        <span>{date}</span>
      </div>
    </div>
  )
}

type FeedItem =
  | { type: 'date-header'; date: string }
  | { type: 'post'; post: Post }

function groupPostsByDate(posts: Post[]): FeedItem[] {
  const items: FeedItem[] = []
  let currentDate = ''

  for (const post of posts) {
    const postDate = post.displayDate

    if (postDate !== currentDate) {
      currentDate = postDate
      items.push({ type: 'date-header', date: postDate })
    }

    items.push({ type: 'post', post })
  }

  return items
}

// Non-virtualized feed for simpler use cases
export function SimpleFeed({ posts, profiles }: { posts: Post[]; profiles: Record<string, Profile> }) {
  const postsWithDates = groupPostsByDate(posts)

  return (
    <div className="feed-simple">
      {postsWithDates.map((item, index) => {
        if (item.type === 'date-header') {
          return <DateHeader key={`date-${item.date}-${index}`} date={item.date} />
        }
        return (
          <PostCard
            key={item.post.id}
            post={item.post}
            author={profiles[item.post.authorId]}
          />
        )
      })}
    </div>
  )
}
