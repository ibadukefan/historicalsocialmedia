import { Post, Profile, Era, FeedFilters, FeedSegment } from '@/types'
import julyPostsData from '@/data/posts/july-1776.json'
import expandedPostsData from '@/data/posts/revolution-expanded.json'
import globalPostsData from '@/data/posts/global-1776.json'
import mundanePostsData from '@/data/posts/mundane-1776.json'
import profilesData from '@/data/profiles/index.json'
import erasData from '@/data/eras/index.json'

// Type assertions for imported JSON and combine posts
const julyPosts: Post[] = julyPostsData as Post[]
const expandedPosts: Post[] = expandedPostsData as Post[]
const globalPosts: Post[] = globalPostsData as Post[]
const mundanePosts: Post[] = mundanePostsData as Post[]

// Combine all posts and sort by timestamp (newest first)
const posts: Post[] = [...julyPosts, ...expandedPosts, ...globalPosts, ...mundanePosts].sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
)

const profiles: Profile[] = profilesData as Profile[]
const eras: Era[] = erasData as Era[]

/**
 * Get all posts, optionally filtered
 */
export function getPosts(filters?: FeedFilters): Post[] {
  let filtered = [...posts]

  if (filters?.era) {
    filtered = filtered.filter(p => p.era === filters.era)
  }

  if (filters?.startDate) {
    filtered = filtered.filter(p => new Date(p.timestamp) >= new Date(filters.startDate!))
  }

  if (filters?.endDate) {
    filtered = filtered.filter(p => new Date(p.timestamp) <= new Date(filters.endDate!))
  }

  if (filters?.profileId) {
    filtered = filtered.filter(p => p.authorId === filters.profileId)
  }

  if (filters?.postTypes && filters.postTypes.length > 0) {
    filtered = filtered.filter(p => filters.postTypes!.includes(p.type))
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.content.toLowerCase().includes(search) ||
      p.title?.toLowerCase().includes(search) ||
      p.tags?.some(t => t.toLowerCase().includes(search))
    )
  }

  // Sort by timestamp, newest first
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return filtered
}

/**
 * Get a single post by ID
 */
export function getPost(id: string): Post | undefined {
  return posts.find(p => p.id === id)
}

/**
 * Get posts for infinite scroll with pagination
 */
export function getFeedSegment(cursor?: string, limit: number = 20): FeedSegment {
  const allPosts = getPosts()

  let startIndex = 0
  if (cursor) {
    const cursorIndex = allPosts.findIndex(p => p.id === cursor)
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1
    }
  }

  const segmentPosts = allPosts.slice(startIndex, startIndex + limit)
  const hasMore = startIndex + limit < allPosts.length
  const nextCursor = hasMore ? segmentPosts[segmentPosts.length - 1]?.id : undefined

  return {
    id: cursor || 'initial',
    startDate: segmentPosts[0]?.timestamp || '',
    endDate: segmentPosts[segmentPosts.length - 1]?.timestamp || '',
    posts: segmentPosts,
    hasMore,
    nextCursor
  }
}

/**
 * Get all profiles
 */
export function getProfiles(): Profile[] {
  return profiles
}

/**
 * Get a single profile by ID
 */
export function getProfile(id: string): Profile | undefined {
  return profiles.find(p => p.id === id)
}

/**
 * Get profiles by era
 */
export function getProfilesByEra(eraId: string): Profile[] {
  return profiles.filter(p => p.era.includes(eraId))
}

/**
 * Get posts by a specific author
 */
export function getPostsByAuthor(authorId: string): Post[] {
  return posts.filter(p => p.authorId === authorId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

/**
 * Get all eras
 */
export function getEras(): Era[] {
  return eras
}

/**
 * Get a single era by ID
 */
export function getEra(id: string): Era | undefined {
  return eras.find(e => e.id === id)
}

/**
 * Get profile by handle (without @)
 */
export function getProfileByHandle(handle: string): Profile | undefined {
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle
  return profiles.find(p => p.handle.toLowerCase() === `@${cleanHandle}`.toLowerCase())
}

/**
 * Search across posts, profiles, and eras
 */
export function search(query: string, limit: number = 20) {
  const q = query.toLowerCase()

  const matchingPosts = posts
    .filter(p =>
      p.content.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q)
    )
    .slice(0, limit)

  const matchingProfiles = profiles
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.bio.toLowerCase().includes(q)
    )
    .slice(0, limit)

  const matchingEras = eras
    .filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    )

  return {
    posts: matchingPosts,
    profiles: matchingProfiles,
    eras: matchingEras
  }
}

/**
 * Get "trending" topics (most used hashtags)
 */
export function getTrending(limit: number = 10): { tag: string; count: number }[] {
  const tagCounts: Record<string, number> = {}

  posts.forEach(post => {
    post.hashtags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Get suggested profiles to follow
 */
export function getSuggestedProfiles(limit: number = 5): Profile[] {
  return profiles
    .filter(p => p.isVerified)
    .sort((a, b) => (b.followers || 0) - (a.followers || 0))
    .slice(0, limit)
}
