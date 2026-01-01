'use client'

import { Heart, Info, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useLikes } from '@/components/LikesProvider'
import { PostCard } from '@/components/feed/PostCard'
import { getPost, getProfile } from '@/lib/data'

export default function LikesPage() {
  const { likes, removeLike } = useLikes()

  // Get the actual posts for liked IDs
  const likedPosts = likes
    .map(id => getPost(id))
    .filter((post): post is NonNullable<typeof post> => post !== undefined)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
              Liked Posts
            </h1>
            <p className="text-sm text-muted-foreground">
              {likes.length} liked moment{likes.length !== 1 ? 's' : ''} from history
            </p>
          </div>
          {likes.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Remove all likes?')) {
                  likes.forEach(id => removeLike(id))
                }
              }}
              className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Liked Posts */}
      {likedPosts.length > 0 ? (
        <div>
          {likedPosts.map(post => {
            const author = getProfile(post.authorId)
            return (
              <PostCard
                key={post.id}
                post={post}
                author={author}
              />
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No liked posts yet</h2>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            When you like posts, they'll appear here so you can easily find them later.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Browse the feed
          </Link>
        </div>
      )}

      {/* Info */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Your likes are saved</h3>
            <p className="text-sm text-muted-foreground">
              Liked posts are stored locally in your browser and will persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
