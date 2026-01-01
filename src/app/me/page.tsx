'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  User,
  Heart,
  Bookmark,
  Users,
  MessageCircle,
  Bell,
  Settings,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Edit3,
  Check,
  X
} from 'lucide-react'
import { useLikes } from '@/components/LikesProvider'
import { useBookmarks } from '@/components/BookmarksProvider'
import { useFollows } from '@/components/FollowsProvider'
import { useComments } from '@/components/CommentsProvider'
import { useNotifications } from '@/components/NotificationsProvider'
import { getPosts, getProfiles, getEras } from '@/lib/data'
import { cn } from '@/lib/utils'

// Get username from localStorage
function useUsername() {
  const [username, setUsernameState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tempus-username') || 'Time Traveler'
    }
    return 'Time Traveler'
  })

  const setUsername = (name: string) => {
    setUsernameState(name)
    if (typeof window !== 'undefined') {
      localStorage.setItem('tempus-username', name)
    }
  }

  return { username, setUsername }
}

function StatCard({ icon: Icon, label, value, href, color }: {
  icon: React.ElementType
  label: string
  value: number
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  )
}

function AchievementBadge({ icon: Icon, title, description, unlocked, color }: {
  icon: React.ElementType
  title: string
  description: string
  unlocked: boolean
  color: string
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border",
      unlocked ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        unlocked ? color : "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", !unlocked && "text-muted-foreground")}>{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      {unlocked && <Check className="h-4 w-4 text-green-500 shrink-0" />}
    </div>
  )
}

export default function UserProfilePage() {
  const { username, setUsername } = useUsername()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(username)
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'export'>('overview')

  const { likes } = useLikes()
  const { bookmarks } = useBookmarks()
  const { follows } = useFollows()
  const { comments } = useComments()
  const { notifications } = useNotifications()

  const allPosts = useMemo(() => getPosts(), [])
  const allProfiles = useMemo(() => getProfiles(), [])
  const allEras = useMemo(() => getEras(), [])

  // Calculate stats
  const stats = useMemo(() => {
    const likedPosts = allPosts.filter(p => likes.includes(p.id))
    const bookmarkedPosts = allPosts.filter(p => bookmarks.includes(p.id))
    const followedProfiles = allProfiles.filter(p => follows.includes(p.id))
    const userComments = comments // Already a flat array

    // Era breakdown for liked posts
    const eraBreakdown: Record<string, number> = {}
    likedPosts.forEach(post => {
      eraBreakdown[post.era] = (eraBreakdown[post.era] || 0) + 1
    })

    // Most engaged era
    const topEra = Object.entries(eraBreakdown).sort((a, b) => b[1] - a[1])[0]

    return {
      likesCount: likes.length,
      bookmarksCount: bookmarks.length,
      followsCount: follows.length,
      commentsCount: userComments.length,
      notificationsCount: notifications.length,
      unreadNotifications: notifications.filter(n => !n.read).length,
      eraBreakdown,
      topEra: topEra ? topEra[0] : null,
      likedPosts,
      bookmarkedPosts,
      followedProfiles
    }
  }, [likes, bookmarks, follows, comments, notifications, allPosts, allProfiles])

  // Calculate achievements
  const achievements = useMemo(() => [
    {
      id: 'first-like',
      icon: Heart,
      title: 'First Like',
      description: 'Liked your first historical post',
      unlocked: stats.likesCount >= 1,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'
    },
    {
      id: 'bookworm',
      icon: Bookmark,
      title: 'Bookworm',
      description: 'Saved 10 posts for later',
      unlocked: stats.bookmarksCount >= 10,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
    },
    {
      id: 'social-butterfly',
      icon: Users,
      title: 'Social Butterfly',
      description: 'Following 5 historical figures',
      unlocked: stats.followsCount >= 5,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
    },
    {
      id: 'conversationalist',
      icon: MessageCircle,
      title: 'Conversationalist',
      description: 'Left 5 comments on posts',
      unlocked: stats.commentsCount >= 5,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300'
    },
    {
      id: 'time-traveler',
      icon: Clock,
      title: 'Time Traveler',
      description: 'Engaged with 3 different eras',
      unlocked: Object.keys(stats.eraBreakdown).length >= 3,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300'
    },
    {
      id: 'historian',
      icon: Award,
      title: 'Historian',
      description: 'Liked 50 posts across history',
      unlocked: stats.likesCount >= 50,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
    },
    {
      id: 'era-expert',
      icon: TrendingUp,
      title: 'Era Expert',
      description: 'Liked 20 posts from a single era',
      unlocked: Object.values(stats.eraBreakdown).some(count => count >= 20),
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300'
    },
    {
      id: 'completionist',
      icon: Calendar,
      title: 'Completionist',
      description: 'Engaged with all 10 eras',
      unlocked: Object.keys(stats.eraBreakdown).length >= 10,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300'
    }
  ], [stats])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  // Handle name save
  const handleSaveName = () => {
    if (editedName.trim()) {
      setUsername(editedName.trim())
    }
    setIsEditingName(false)
  }

  // Export data - enhanced with full details
  const handleExport = (format: 'json' | 'csv', type: 'all' | 'likes' | 'bookmarks' | 'follows' | 'comments' = 'all') => {
    const dateStr = new Date().toISOString().split('T')[0]

    // Get full post details for likes and bookmarks
    const likedPostsDetailed = stats.likedPosts.map(p => ({
      id: p.id,
      author: allProfiles.find(pr => pr.id === p.authorId)?.displayName || p.authorId,
      content: p.content.slice(0, 200) + (p.content.length > 200 ? '...' : ''),
      date: p.displayDate,
      era: p.era,
      likes: p.likes,
      url: `/post/${p.id}`
    }))

    const bookmarkedPostsDetailed = stats.bookmarkedPosts.map(p => ({
      id: p.id,
      author: allProfiles.find(pr => pr.id === p.authorId)?.displayName || p.authorId,
      content: p.content.slice(0, 200) + (p.content.length > 200 ? '...' : ''),
      date: p.displayDate,
      era: p.era,
      likes: p.likes,
      url: `/post/${p.id}`
    }))

    const followedProfilesDetailed = stats.followedProfiles.map(p => ({
      id: p.id,
      name: p.displayName,
      handle: p.handle,
      bio: p.bio,
      era: p.era.join(', '),
      followers: p.followers,
      url: `/profile/${p.id}`
    }))

    const commentsDetailed = comments.map(c => {
      const post = allPosts.find(p => p.id === c.postId)
      return {
        id: c.id,
        postId: c.postId,
        postAuthor: post ? allProfiles.find(pr => pr.id === post.authorId)?.displayName : 'Unknown',
        content: c.content,
        timestamp: c.timestamp,
        replyTo: c.parentId || null
      }
    })

    let content: string
    let filename: string
    let mimeType: string

    if (format === 'json') {
      let data: any

      if (type === 'all') {
        data = {
          exportInfo: {
            username,
            exportedAt: new Date().toISOString(),
            source: 'Tempus - Historical Social Media',
            version: '1.0'
          },
          summary: {
            totalLikes: stats.likesCount,
            totalBookmarks: stats.bookmarksCount,
            totalFollows: stats.followsCount,
            totalComments: stats.commentsCount,
            achievementsUnlocked: achievements.filter(a => a.unlocked).length,
            favoriteEra: stats.topEra
          },
          likedPosts: likedPostsDetailed,
          bookmarkedPosts: bookmarkedPostsDetailed,
          followedProfiles: followedProfilesDetailed,
          comments: commentsDetailed,
          achievements: achievements.filter(a => a.unlocked).map(a => ({
            title: a.title,
            description: a.description
          })),
          eraBreakdown: stats.eraBreakdown
        }
        filename = `tempus-complete-export-${dateStr}.json`
      } else if (type === 'likes') {
        data = { exportedAt: new Date().toISOString(), likedPosts: likedPostsDetailed }
        filename = `tempus-likes-${dateStr}.json`
      } else if (type === 'bookmarks') {
        data = { exportedAt: new Date().toISOString(), bookmarkedPosts: bookmarkedPostsDetailed }
        filename = `tempus-bookmarks-${dateStr}.json`
      } else if (type === 'follows') {
        data = { exportedAt: new Date().toISOString(), followedProfiles: followedProfilesDetailed }
        filename = `tempus-follows-${dateStr}.json`
      } else {
        data = { exportedAt: new Date().toISOString(), comments: commentsDetailed }
        filename = `tempus-comments-${dateStr}.json`
      }

      content = JSON.stringify(data, null, 2)
      mimeType = 'application/json'
    } else {
      // CSV format with proper escaping
      const escapeCSV = (str: string) => {
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      let rows: string[][]

      if (type === 'all' || type === 'likes') {
        rows = [
          ['Type', 'ID', 'Author', 'Content', 'Date', 'Era', 'Likes', 'URL'],
          ...likedPostsDetailed.map(p => [
            'Like',
            p.id,
            escapeCSV(p.author),
            escapeCSV(p.content),
            p.date,
            p.era,
            String(p.likes),
            p.url
          ])
        ]
        if (type === 'likes') {
          filename = `tempus-likes-${dateStr}.csv`
        }
      }

      if (type === 'all' || type === 'bookmarks') {
        const bookmarkRows = bookmarkedPostsDetailed.map(p => [
          'Bookmark',
          p.id,
          escapeCSV(p.author),
          escapeCSV(p.content),
          p.date,
          p.era,
          String(p.likes),
          p.url
        ])
        if (type === 'bookmarks') {
          rows = [
            ['Type', 'ID', 'Author', 'Content', 'Date', 'Era', 'Likes', 'URL'],
            ...bookmarkRows
          ]
          filename = `tempus-bookmarks-${dateStr}.csv`
        } else if (type === 'all') {
          rows!.push(...bookmarkRows)
        }
      }

      if (type === 'all' || type === 'follows') {
        const followRows = followedProfilesDetailed.map(p => [
          'Follow',
          p.id,
          escapeCSV(p.name),
          escapeCSV(p.bio),
          '',
          p.era,
          String(p.followers),
          p.url
        ])
        if (type === 'follows') {
          rows = [
            ['Type', 'ID', 'Name', 'Bio', '', 'Era', 'Followers', 'URL'],
            ...followRows
          ]
          filename = `tempus-follows-${dateStr}.csv`
        } else if (type === 'all') {
          rows!.push(...followRows)
        }
      }

      if (type === 'all' || type === 'comments') {
        const commentRows = commentsDetailed.map(c => [
          'Comment',
          c.id,
          escapeCSV(c.postAuthor || ''),
          escapeCSV(c.content),
          c.timestamp,
          '',
          '',
          `/post/${c.postId}`
        ])
        if (type === 'comments') {
          rows = [
            ['Type', 'ID', 'Post Author', 'Comment', 'Timestamp', '', '', 'Post URL'],
            ...commentRows
          ]
          filename = `tempus-comments-${dateStr}.csv`
        } else if (type === 'all') {
          rows!.push(...commentRows)
        }
      }

      if (type === 'all') {
        filename = `tempus-complete-export-${dateStr}.csv`
      }

      content = rows!.map(row => row.join(',')).join('\n')
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename!
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-xl font-bold bg-muted px-2 py-1 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') {
                        setEditedName(username)
                        setIsEditingName(false)
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 hover:bg-muted rounded"
                    aria-label="Save name"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                  <button
                    onClick={() => {
                      setEditedName(username)
                      setIsEditingName(false)
                    }}
                    className="p-1 hover:bg-muted rounded"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{username}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 hover:bg-muted rounded"
                    aria-label="Edit name"
                  >
                    <Edit3 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {unlockedCount}/{achievements.length} achievements unlocked
              </p>
            </div>
            <Link
              href="/settings"
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          {(['overview', 'achievements', 'export'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-sm font-medium capitalize transition-colors",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-3">
              <StatCard
                icon={Heart}
                label="Posts Liked"
                value={stats.likesCount}
                href="/likes"
                color="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
              />
              <StatCard
                icon={Bookmark}
                label="Posts Saved"
                value={stats.bookmarksCount}
                href="/bookmarks"
                color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
              />
              <StatCard
                icon={Users}
                label="Following"
                value={stats.followsCount}
                href="/following"
                color="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
              />
              <StatCard
                icon={MessageCircle}
                label="Comments"
                value={stats.commentsCount}
                href="/"
                color="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
              />
              <StatCard
                icon={Bell}
                label="Notifications"
                value={stats.notificationsCount}
                href="/notifications"
                color="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
              />
            </div>

            {/* Era Breakdown */}
            {Object.keys(stats.eraBreakdown).length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Your Era Interests
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.eraBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([eraId, count]) => {
                      const era = allEras.find(e => e.id === eraId)
                      const maxCount = Math.max(...Object.values(stats.eraBreakdown))
                      const percentage = (count / maxCount) * 100

                      return (
                        <div key={eraId}>
                          <div className="flex justify-between text-sm mb-1">
                            <Link
                              href={`/era/${eraId}`}
                              className="hover:text-primary transition-colors"
                            >
                              {era?.name || eraId.replace(/-/g, ' ')}
                            </Link>
                            <span className="text-muted-foreground">{count} likes</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/explore"
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Explore Eras</span>
                </Link>
                <Link
                  href="/profiles"
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Find Figures</span>
                </Link>
                <Link
                  href="/trending"
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Trending</span>
                </Link>
                <Link
                  href="/on-this-day"
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">On This Day</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">{unlockedCount}</div>
              <p className="text-muted-foreground">of {achievements.length} achievements unlocked</p>
            </div>

            <div className="grid gap-2">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  title={achievement.title}
                  description={achievement.description}
                  unlocked={achievement.unlocked}
                  color={achievement.color}
                />
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Keep exploring history to unlock more achievements!
            </p>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-4">
            {/* Complete Export */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Complete Export
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your Tempus data with full details including post content, author info, and metadata.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExport('json', 'all')}
                  className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  JSON
                </button>
                <button
                  onClick={() => handleExport('csv', 'all')}
                  className="flex items-center justify-center gap-2 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </button>
              </div>
            </div>

            {/* Individual Exports */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Export Individual Data</h3>
              <div className="space-y-3">
                {/* Likes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{stats.likesCount} liked posts</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleExport('json', 'likes')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.likesCount === 0}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv', 'likes')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.likesCount === 0}
                    >
                      CSV
                    </button>
                  </div>
                </div>

                {/* Bookmarks */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{stats.bookmarksCount} bookmarks</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleExport('json', 'bookmarks')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.bookmarksCount === 0}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv', 'bookmarks')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.bookmarksCount === 0}
                    >
                      CSV
                    </button>
                  </div>
                </div>

                {/* Follows */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{stats.followsCount} followed profiles</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleExport('json', 'follows')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.followsCount === 0}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv', 'follows')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.followsCount === 0}
                    >
                      CSV
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{stats.commentsCount} comments</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleExport('json', 'comments')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.commentsCount === 0}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv', 'comments')}
                      className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      disabled={stats.commentsCount === 0}
                    >
                      CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Export Details</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Liked posts:</strong> Full content, author, date, era, like count</li>
                <li>• <strong>Bookmarks:</strong> Full content, author, date, era, like count</li>
                <li>• <strong>Follows:</strong> Profile name, handle, bio, era, follower count</li>
                <li>• <strong>Comments:</strong> Your comment, post reference, timestamp</li>
                <li>• <strong>Complete export:</strong> All above + achievements & era breakdown</li>
              </ul>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Your data is stored locally in your browser. We don't collect or store any personal information.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
