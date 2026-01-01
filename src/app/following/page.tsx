'use client'

import { UserCheck, Users, Info, Trash2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useFollows } from '@/components/FollowsProvider'
import { getProfile, getPosts } from '@/lib/data'
import { PostCard } from '@/components/feed/PostCard'

export default function FollowingPage() {
  const { follows, removeFollow } = useFollows()

  // Get the actual profiles for followed IDs
  const followedProfiles = follows
    .map(id => getProfile(id))
    .filter((profile): profile is NonNullable<typeof profile> => profile !== undefined)

  // Get posts from followed profiles
  const allPosts = getPosts()
  const followedPosts = allPosts
    .filter(post => follows.includes(post.authorId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Following
            </h1>
            <p className="text-sm text-muted-foreground">
              {follows.length} historical figure{follows.length !== 1 ? 's' : ''}
            </p>
          </div>
          {follows.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Unfollow everyone?')) {
                  follows.forEach(id => removeFollow(id))
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

      {followedProfiles.length > 0 ? (
        <>
          {/* Followed Profiles */}
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              People You Follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {followedProfiles.map(profile => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                      {profile.displayName.charAt(0)}
                    </div>
                    {profile.isVerified && (
                      <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-primary fill-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${profile.id}`}
                      className="font-semibold hover:underline block truncate"
                    >
                      {profile.displayName}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate">
                      {profile.handle}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {profile.title}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFollow(profile.id)}
                    className="shrink-0 px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Posts from Followed */}
          <div className="border-b border-border">
            <div className="p-4 pb-2">
              <h2 className="font-semibold">Recent Posts</h2>
              <p className="text-sm text-muted-foreground">
                Posts from people you follow
              </p>
            </div>
            {followedPosts.length > 0 ? (
              <div>
                {followedPosts.map(post => {
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
              <div className="p-4 text-center text-muted-foreground">
                <p>No posts yet from people you follow.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Not following anyone yet</h2>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Follow historical figures to see their posts here.
            It's like subscribing to history!
          </p>
          <Link
            href="/profiles"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Discover historical figures
          </Link>
        </div>
      )}

      {/* Info */}
      <div className="p-4 border-t border-border">
        <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">About Following</h3>
            <p className="text-sm text-muted-foreground">
              Follow historical figures to curate your own personalized feed.
              Your follows are stored locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
