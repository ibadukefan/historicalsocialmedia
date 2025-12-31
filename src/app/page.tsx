import { SimpleFeed } from '@/components/feed/Feed'
import { getPosts, getProfiles } from '@/lib/data'
import { Profile } from '@/types'

export default function HomePage() {
  const posts = getPosts()
  const profilesList = getProfiles()

  // Convert profiles array to record for quick lookup
  const profiles: Record<string, Profile> = {}
  profilesList.forEach(p => {
    profiles[p.id] = p
  })

  return (
    <div className="min-h-screen">
      {/* Feed Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl">Home</h1>
        <p className="text-sm text-muted-foreground">
          July 1776 &middot; American Revolution
        </p>
      </div>

      {/* Feed */}
      <SimpleFeed posts={posts} profiles={profiles} />

      {/* End of feed message */}
      <div className="py-8 text-center border-t border-border">
        <p className="text-muted-foreground">
          More historical periods coming soon
        </p>
      </div>
    </div>
  )
}
