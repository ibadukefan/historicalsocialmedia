'use client'

import { ErrorBoundary, PostErrorFallback } from '@/components/ErrorBoundary'
import { PostCard } from './PostCard'
import { Post, Profile } from '@/types'

interface SafePostCardProps {
  post: Post
  author?: Profile
  isThreaded?: boolean
  showThreadLine?: boolean
}

export function SafePostCard(props: SafePostCardProps) {
  return (
    <ErrorBoundary
      fallback={<PostErrorFallback />}
      onError={(error) => {
        console.error(`Error rendering post ${props.post.id}:`, error)
      }}
    >
      <PostCard {...props} />
    </ErrorBoundary>
  )
}
