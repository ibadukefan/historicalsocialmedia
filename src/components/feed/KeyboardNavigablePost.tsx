'use client'

import { useEffect, useRef } from 'react'
import { useKeyboardShortcuts } from '@/components/KeyboardShortcutsProvider'
import { useBookmarks } from '@/components/BookmarksProvider'
import { useLikes } from '@/components/LikesProvider'
import { cn } from '@/lib/utils'

interface KeyboardNavigablePostProps {
  postId: string
  index: number
  children: React.ReactNode
  onComment?: () => void
  onShare?: () => void
  onContext?: () => void
}

export function KeyboardNavigablePost({
  postId,
  index,
  children,
  onComment,
  onShare,
  onContext
}: KeyboardNavigablePostProps) {
  const {
    focusedPostIndex,
    registerActionHandler,
    unregisterActionHandler
  } = useKeyboardShortcuts()
  const { toggleBookmark } = useBookmarks()
  const { toggleLike } = useLikes()
  const containerRef = useRef<HTMLDivElement>(null)

  const isFocused = focusedPostIndex === index

  // Register action handlers when this post is focused
  useEffect(() => {
    if (isFocused) {
      registerActionHandler('like', () => toggleLike(postId))
      registerActionHandler('bookmark', () => toggleBookmark(postId))
      if (onComment) registerActionHandler('comment', onComment)
      if (onShare) registerActionHandler('share', onShare)
      if (onContext) registerActionHandler('context', onContext)
    }

    return () => {
      if (isFocused) {
        unregisterActionHandler('like')
        unregisterActionHandler('bookmark')
        unregisterActionHandler('comment')
        unregisterActionHandler('share')
        unregisterActionHandler('context')
      }
    }
  }, [isFocused, postId, toggleLike, toggleBookmark, onComment, onShare, onContext, registerActionHandler, unregisterActionHandler])

  return (
    <div
      ref={containerRef}
      data-post-index={index}
      tabIndex={isFocused ? 0 : -1}
      className={cn(
        "outline-none transition-all",
        isFocused && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg"
      )}
    >
      {children}
    </div>
  )
}
