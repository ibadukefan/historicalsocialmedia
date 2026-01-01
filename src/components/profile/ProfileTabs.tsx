'use client'

import { useState, useMemo } from 'react'
import { FileText, MessageSquare, Image, Heart } from 'lucide-react'
import { Post, Profile } from '@/types'
import { SimpleFeed } from '@/components/feed/Feed'
import { cn } from '@/lib/utils'

type TabType = 'posts' | 'replies' | 'media' | 'likes'

interface ProfileTabsProps {
  profile: Profile
  posts: Post[]
  allPosts: Post[]
  profiles: Record<string, Profile>
}

export function ProfileTabs({ profile, posts, allPosts, profiles }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts')

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case 'posts':
        // All posts by this author that are NOT replies
        return posts.filter(p => !p.replyToId)

      case 'replies':
        // Posts that are replies to other posts
        return posts.filter(p => p.replyToId)

      case 'media':
        // Posts with media attachments
        return posts.filter(p => p.media && p.media.length > 0)

      case 'likes':
        // Posts this historical figure "would have liked"
        // Based on: same era, mentions of them, related topics
        return getSimulatedLikes(profile, allPosts, posts)

      default:
        return posts
    }
  }, [activeTab, posts, allPosts, profile])

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'posts', label: 'Posts', icon: FileText, count: posts.filter(p => !p.replyToId).length },
    { id: 'replies', label: 'Replies', icon: MessageSquare, count: posts.filter(p => p.replyToId).length },
    { id: 'media', label: 'Media', icon: Image, count: posts.filter(p => p.media && p.media.length > 0).length },
    { id: 'likes', label: 'Likes', icon: Heart },
  ]

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-4 text-center font-medium transition-colors relative",
                "hover:bg-muted/50",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-selected={isActive}
              role="tab"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {filteredPosts.length > 0 ? (
          <SimpleFeed posts={filteredPosts} profiles={profiles} />
        ) : (
          <EmptyState tab={activeTab} profileName={profile.displayName} />
        )}
      </div>
    </>
  )
}

function EmptyState({ tab, profileName }: { tab: TabType; profileName: string }) {
  const messages: Record<TabType, { title: string; description: string }> = {
    posts: {
      title: 'No posts yet',
      description: `${profileName} hasn't posted anything yet.`,
    },
    replies: {
      title: 'No replies',
      description: `${profileName} hasn't replied to any posts.`,
    },
    media: {
      title: 'No media',
      description: `${profileName} hasn't shared any photos or videos.`,
    },
    likes: {
      title: 'No likes to show',
      description: `We couldn't determine which posts ${profileName} would have liked.`,
    },
  }

  const { title, description } = messages[tab]

  return (
    <div className="py-12 text-center">
      <p className="font-medium text-lg">{title}</p>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

/**
 * Generate simulated "likes" for a historical figure
 * Based on: same era, relationships, mentions, related topics
 */
function getSimulatedLikes(profile: Profile, allPosts: Post[], ownPosts: Post[]): Post[] {
  const ownPostIds = new Set(ownPosts.map(p => p.id))

  // Get posts from the same era(s) that this person didn't write
  const eraMatches = allPosts.filter(p =>
    !ownPostIds.has(p.id) &&
    profile.era.includes(p.era)
  )

  // Score posts based on relevance
  const scoredPosts = eraMatches.map(post => {
    let score = 0

    // Higher score for posts that mention this person
    if (post.mentions?.includes(profile.id)) {
      score += 100
    }

    // Higher score for posts with related hashtags
    if (post.hashtags) {
      const profileTags = profile.tags || []
      const occupationTags = profile.occupation || []
      const allProfileTags = [...profileTags, ...occupationTags].map(t => t.toLowerCase())

      post.hashtags.forEach(tag => {
        if (allProfileTags.some(pt => tag.toLowerCase().includes(pt) || pt.includes(tag.toLowerCase()))) {
          score += 20
        }
      })
    }

    // Higher score for posts from related profiles (if relationships exist)
    if (profile.relationships) {
      const relatedIds = profile.relationships.map(r => r.profileId)
      if (relatedIds.includes(post.authorId)) {
        score += 50
      }
    }

    // Bonus for high engagement posts
    score += Math.min(post.likes / 1000, 20) // Cap at 20 points

    // Bonus for verified accuracy
    if (post.accuracy === 'verified' || post.accuracy === 'documented') {
      score += 10
    }

    return { post, score }
  })

  // Sort by score and return top posts
  return scoredPosts
    .filter(sp => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(sp => sp.post)
}
