'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Hash, MessageCircle, Heart, Repeat2, Clock, Users, ChevronDown, Flame, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { getPosts, getProfiles, getProfile, getEras } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Post, Profile, Era } from '@/types'

export default function TrendingPage() {
  const [selectedEra, setSelectedEra] = useState<string>('')
  const [showEraDropdown, setShowEraDropdown] = useState(false)

  const allPosts = getPosts()
  const allProfiles = getProfiles()
  const allEras = getEras()

  // Filter posts by era if selected
  const posts = useMemo(() => {
    if (!selectedEra) return allPosts
    return allPosts.filter(p => p.era === selectedEra)
  }, [allPosts, selectedEra])

  // Calculate real trending hashtags from posts
  const trendingTopics = useMemo(() => {
    const tagStats: Record<string, { count: number; totalLikes: number; totalComments: number; posts: Post[] }> = {}

    posts.forEach(post => {
      post.hashtags?.forEach(tag => {
        if (!tagStats[tag]) {
          tagStats[tag] = { count: 0, totalLikes: 0, totalComments: 0, posts: [] }
        }
        tagStats[tag].count++
        tagStats[tag].totalLikes += post.likes || 0
        tagStats[tag].totalComments += post.comments || 0
        tagStats[tag].posts.push(post)
      })
    })

    return Object.entries(tagStats)
      .map(([tag, stats]) => ({
        tag: `#${tag}`,
        rawTag: tag,
        postCount: stats.count,
        totalLikes: stats.totalLikes,
        totalComments: stats.totalComments,
        engagement: stats.totalLikes + stats.totalComments * 2, // Comments weighted more
        topPost: stats.posts.sort((a, b) => (b.likes || 0) - (a.likes || 0))[0],
        era: stats.posts[0]?.era || 'unknown'
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 15)
  }, [posts])

  // Get most engaged posts
  const topPosts = useMemo(() => {
    return [...posts]
      .map(post => ({
        ...post,
        engagement: (post.likes || 0) + (post.comments || 0) * 2 + (post.shares || 0) * 3
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10)
  }, [posts])

  // Get most active profiles (filtered by era)
  const topProfiles = useMemo(() => {
    const profileStats = allProfiles
      .map(profile => {
        const profilePosts = posts.filter(p => p.authorId === profile.id)
        return {
          ...profile,
          postCount: profilePosts.length,
          totalLikes: profilePosts.reduce((sum, p) => sum + (p.likes || 0), 0),
          totalComments: profilePosts.reduce((sum, p) => sum + (p.comments || 0), 0),
          engagement: profilePosts.reduce((sum, p) =>
            sum + (p.likes || 0) + (p.comments || 0) * 2 + (p.shares || 0) * 3, 0
          )
        }
      })
      .filter(p => p.postCount > 0)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10)

    return profileStats
  }, [allProfiles, posts])

  // Stats summary
  const stats = useMemo(() => ({
    totalPosts: posts.length,
    totalHashtags: new Set(posts.flatMap(p => p.hashtags || [])).size,
    totalEngagement: posts.reduce((sum, p) =>
      sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0
    ),
    avgLikesPerPost: Math.round(posts.reduce((sum, p) => sum + (p.likes || 0), 0) / posts.length) || 0
  }), [posts])

  const selectedEraName = selectedEra
    ? allEras.find(e => e.id === selectedEra)?.name
    : 'All Eras'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending
          </h1>
          <p className="text-sm text-muted-foreground">
            What's happening across history
          </p>
        </div>

        {/* Era Filter */}
        <div className="px-4 pb-3">
          <div className="relative inline-block">
            <button
              onClick={() => setShowEraDropdown(!showEraDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80"
              aria-expanded={showEraDropdown}
              aria-haspopup="listbox"
            >
              <Clock className="h-4 w-4" />
              {selectedEraName}
              <ChevronDown className={cn("h-4 w-4 transition-transform", showEraDropdown && "rotate-180")} />
            </button>
            {showEraDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-auto">
                <button
                  onClick={() => { setSelectedEra(''); setShowEraDropdown(false) }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                    !selectedEra && "bg-muted font-medium"
                  )}
                >
                  All Eras ({allPosts.length} posts)
                </button>
                {allEras.map(era => (
                  <button
                    key={era.id}
                    onClick={() => { setSelectedEra(era.id); setShowEraDropdown(false) }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                      selectedEra === era.id && "bg-muted font-medium"
                    )}
                  >
                    <span className="block">{era.name}</span>
                    <span className="text-xs text-muted-foreground">{era.postCount} posts</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-border">
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-2xl font-bold">{stats.totalHashtags.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Hashtags</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-2xl font-bold">{stats.totalEngagement.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Engagements</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-2xl font-bold">{stats.avgLikesPerPost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Avg. Likes</p>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Trending Hashtags
          <span className="text-sm font-normal text-muted-foreground">
            (by engagement)
          </span>
        </h2>
        {trendingTopics.length > 0 ? (
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => {
              const eraName = allEras.find(e => e.id === topic.era)?.shortName || topic.era
              return (
                <Link
                  key={topic.tag}
                  href={`/search?q=${topic.rawTag}`}
                  className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-muted-foreground/50 w-6 shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-bold text-primary">{topic.tag}</p>
                        <p className="text-xs text-muted-foreground">
                          {eraName} · {topic.postCount} posts
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Heart className="h-3 w-3" />
                        {topic.totalLikes.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <MessageCircle className="h-3 w-3" />
                        {topic.totalComments.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {/* Engagement bar */}
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${Math.min(100, (topic.engagement / (trendingTopics[0]?.engagement || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-4">
            No hashtags found for this era.
          </p>
        )}
      </div>

      {/* Top Posts */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Most Engaging Posts
        </h2>
        {topPosts.length > 0 ? (
          <div className="space-y-3">
            {topPosts.map((post, index) => {
              const profile = getProfile(post.authorId)
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-bold text-muted-foreground/50 w-6 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                          {profile?.displayName?.charAt(0) || '?'}
                        </div>
                        <span className="font-semibold text-sm truncate">{profile?.displayName || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{post.displayDate}</span>
                      </div>
                      <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" fill={post.likes > 100 ? "currentColor" : "none"} />
                          {(post.likes || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat2 className="h-3 w-3" />
                          {post.shares || 0}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 bg-muted rounded">
                          {post.era.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-4">
            No posts found for this era.
          </p>
        )}
      </div>

      {/* Top Profiles */}
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Most Influential Figures
          <span className="text-sm font-normal text-muted-foreground">
            (by engagement)
          </span>
        </h2>
        {topProfiles.length > 0 ? (
          <div className="space-y-2">
            {topProfiles.map((profile, index) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-lg font-bold text-muted-foreground/50 w-6 shrink-0">{index + 1}</span>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold shrink-0">
                  {profile.displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{profile.displayName}</p>
                  <p className="text-sm text-muted-foreground truncate">{profile.title}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <p className="flex items-center gap-1 justify-end">
                    <BarChart3 className="h-3 w-3" />
                    {profile.postCount} posts
                  </p>
                  <p className="flex items-center gap-1 justify-end">
                    <Heart className="h-3 w-3" />
                    {profile.totalLikes.toLocaleString()} likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-4">
            No profiles found for this era.
          </p>
        )}
      </div>
    </div>
  )
}
