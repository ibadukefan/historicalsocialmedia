'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronUp, MessageCircle } from 'lucide-react'
import { Post, Profile } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { cn } from '@/lib/utils'

interface ThreadViewProps {
  posts: Post[]
  profiles: Record<string, Profile>
  highlightPostId?: string // Which post to highlight (the one user clicked on)
}

export function ThreadView({ posts, profiles, highlightPostId }: ThreadViewProps) {
  // Sort posts by thread position
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => (a.threadPosition || 0) - (b.threadPosition || 0))
  }, [posts])

  if (sortedPosts.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-3" />
        <p>No posts in this thread.</p>
      </div>
    )
  }

  return (
    <div className="thread-view">
      {sortedPosts.map((post, index) => {
        const isHighlighted = post.id === highlightPostId
        const isFirst = index === 0
        const isLast = index === sortedPosts.length - 1
        const author = profiles[post.authorId]

        return (
          <div
            key={post.id}
            className={cn(
              "relative",
              isHighlighted && "bg-primary/5"
            )}
          >
            {/* Thread connector line */}
            {!isFirst && (
              <div
                className="absolute left-[34px] top-0 w-0.5 h-4 bg-border"
                aria-hidden="true"
              />
            )}
            {!isLast && (
              <div
                className="absolute left-[34px] bottom-0 top-[60px] w-0.5 bg-border"
                aria-hidden="true"
              />
            )}

            {/* Thread position indicator */}
            <div className="absolute left-2 top-4 text-xs text-muted-foreground font-mono">
              {index + 1}/{sortedPosts.length}
            </div>

            <div className={cn(
              "pl-2",
              isHighlighted && "ring-2 ring-primary ring-inset"
            )}>
              <PostCard
                post={post}
                author={author}
                isThreaded={true}
                showThreadLine={!isLast}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Compact thread preview shown in feed
interface ThreadPreviewProps {
  threadId: string
  posts: Post[]
  profiles: Record<string, Profile>
}

export function ThreadPreview({ threadId, posts, profiles }: ThreadPreviewProps) {
  const sortedPosts = useMemo(() => {
    return [...posts]
      .filter(p => p.threadId === threadId)
      .sort((a, b) => (a.threadPosition || 0) - (b.threadPosition || 0))
  }, [posts, threadId])

  if (sortedPosts.length <= 1) return null

  const firstPost = sortedPosts[0]
  const author = profiles[firstPost?.authorId]

  return (
    <Link
      href={`/thread/${threadId}`}
      className="block mt-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <MessageCircle className="h-4 w-4" />
        <span>Thread · {sortedPosts.length} posts</span>
      </div>
      <div className="space-y-1">
        {sortedPosts.slice(0, 3).map((post, index) => (
          <div key={post.id} className="flex items-start gap-2">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                {profiles[post.authorId]?.displayName?.charAt(0) || '?'}
              </div>
              {index < Math.min(sortedPosts.length - 1, 2) && (
                <div className="w-0.5 h-4 bg-border mt-1" />
              )}
            </div>
            <p className="text-sm line-clamp-1 flex-1">
              {post.content.slice(0, 100)}{post.content.length > 100 ? '...' : ''}
            </p>
          </div>
        ))}
        {sortedPosts.length > 3 && (
          <p className="text-xs text-primary ml-8">
            +{sortedPosts.length - 3} more in thread
          </p>
        )}
      </div>
    </Link>
  )
}

// "Show this thread" button for posts that are part of a thread
interface ShowThreadButtonProps {
  threadId: string
  postId: string
  position?: number
  total?: number
}

export function ShowThreadButton({ threadId, postId, position, total }: ShowThreadButtonProps) {
  return (
    <Link
      href={`/thread/${threadId}?highlight=${postId}`}
      className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
    >
      <ChevronUp className="h-3 w-3" />
      <span>
        Show this thread
        {position && total && ` (${position}/${total})`}
      </span>
    </Link>
  )
}
