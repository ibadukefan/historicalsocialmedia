'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react'
import { getPosts, getProfiles } from '@/lib/data'
import { PostCard } from '@/components/feed/PostCard'
import { cn, getAccuracyColor } from '@/lib/utils'
import { Post, Profile, PostType, AccuracyLevel } from '@/types'

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: 'event', label: 'Events' },
  { value: 'status', label: 'Status' },
  { value: 'tweet', label: 'Tweets' },
  { value: 'quote', label: 'Quotes' },
  { value: 'photo', label: 'Photos' },
  { value: 'article', label: 'Articles' },
  { value: 'thread', label: 'Threads' },
]

const ACCURACY_LEVELS: { value: AccuracyLevel; label: string }[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'documented', label: 'Documented' },
  { value: 'attributed', label: 'Attributed' },
  { value: 'inferred', label: 'Inferred' },
  { value: 'speculative', label: 'Speculative' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<PostType[]>([])
  const [selectedAccuracy, setSelectedAccuracy] = useState<AccuracyLevel[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'profiles'>('posts')

  const allPosts = getPosts()
  const allProfiles = getProfiles()

  // Create profiles lookup
  const profilesMap = useMemo(() => {
    const map: Record<string, Profile> = {}
    allProfiles.forEach(p => { map[p.id] = p })
    return map
  }, [allProfiles])

  // Filter results
  const filteredPosts = useMemo(() => {
    let results = allPosts

    // Text search
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(post =>
        post.content.toLowerCase().includes(q) ||
        post.title?.toLowerCase().includes(q) ||
        post.hashtags?.some(h => h.toLowerCase().includes(q)) ||
        profilesMap[post.authorId]?.name.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (selectedTypes.length > 0) {
      results = results.filter(post => selectedTypes.includes(post.type))
    }

    // Accuracy filter
    if (selectedAccuracy.length > 0) {
      results = results.filter(post => selectedAccuracy.includes(post.accuracy))
    }

    return results
  }, [allPosts, query, selectedTypes, selectedAccuracy, profilesMap])

  const filteredProfiles = useMemo(() => {
    if (!query) return allProfiles

    const q = query.toLowerCase()
    return allProfiles.filter(profile =>
      profile.name.toLowerCase().includes(q) ||
      profile.displayName.toLowerCase().includes(q) ||
      profile.handle.toLowerCase().includes(q) ||
      profile.bio.toLowerCase().includes(q) ||
      profile.title?.toLowerCase().includes(q)
    )
  }, [allProfiles, query])

  const toggleType = (type: PostType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleAccuracy = (accuracy: AccuracyLevel) => {
    setSelectedAccuracy(prev =>
      prev.includes(accuracy)
        ? prev.filter(a => a !== accuracy)
        : [...prev, accuracy]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedAccuracy([])
  }

  const hasFilters = selectedTypes.length > 0 || selectedAccuracy.length > 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, people, hashtags..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-background"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                showFilters || hasFilters
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary-foreground/20 rounded-full text-xs">
                  {selectedTypes.length + selectedAccuracy.length}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
            {/* Post types */}
            <div>
              <h3 className="text-sm font-medium mb-2">Post Type</h3>
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleType(value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      selectedTypes.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accuracy levels */}
            <div>
              <h3 className="text-sm font-medium mb-2">Accuracy Level</h3>
              <div className="flex flex-wrap gap-2">
                {ACCURACY_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleAccuracy(value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      selectedAccuracy.includes(value)
                        ? getAccuracyColor(value)
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              "flex-1 py-3 text-center font-medium transition-colors relative",
              activeTab === 'posts'
                ? "text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Posts ({filteredPosts.length})
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={cn(
              "flex-1 py-3 text-center font-medium transition-colors relative",
              activeTab === 'profiles'
                ? "text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            People ({filteredProfiles.length})
            {activeTab === 'profiles' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {activeTab === 'posts' ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                author={profilesMap[post.authorId]}
              />
            ))
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts found"
              description={query ? `No posts match "${query}"` : 'Try searching for something'}
            />
          )
        ) : (
          filteredProfiles.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredProfiles.map(profile => (
                <ProfileResult key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={User}
              title="No people found"
              description={query ? `No profiles match "${query}"` : 'Try searching for historical figures'}
            />
          )
        )}
      </div>
    </div>
  )
}

function ProfileResult({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.id}`}
      className="flex items-start gap-3 p-4 hover:bg-muted transition-colors"
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
        <div className="flex items-center gap-1">
          <span className="font-bold truncate">{profile.displayName}</span>
          {profile.isVerified && (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{profile.handle}</p>
        {profile.title && (
          <p className="text-sm text-muted-foreground mt-0.5">{profile.title}</p>
        )}
        <p className="text-sm mt-1 line-clamp-2">{profile.bio}</p>
      </div>
    </Link>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="py-12 text-center">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
