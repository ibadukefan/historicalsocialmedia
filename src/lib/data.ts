import { Post, Profile, Era, FeedFilters, FeedSegment, Relationship } from '@/types'
import julyPostsData from '@/data/posts/july-1776.json'
import expandedPostsData from '@/data/posts/revolution-expanded.json'
import globalPostsData from '@/data/posts/global-1776.json'
import mundanePostsData from '@/data/posts/mundane-1776.json'
import everydayPostsData from '@/data/posts/everyday-1776.json'
import laterRevolutionData from '@/data/posts/revolution-1777-1783.json'
import everyday1777Data from '@/data/posts/everyday-1777-1783.json'
import historicalFiguresData from '@/data/posts/historical-figures.json'
import ancientRomeData from '@/data/posts/ancient-rome.json'
import worldWar2Data from '@/data/posts/world-war-2.json'
import renaissanceData from '@/data/posts/renaissance.json'
import civilRightsData from '@/data/posts/civil-rights.json'
import frenchRevolutionData from '@/data/posts/french-revolution.json'
import ancientGreeceData from '@/data/posts/ancient-greece.json'
import worldWar1Data from '@/data/posts/world-war-1.json'
import industrialRevolutionData from '@/data/posts/industrial-revolution.json'
import vikingAgeData from '@/data/posts/viking-age.json'
import threadsData from '@/data/posts/threads.json'
import medievalCrusadesData from '@/data/posts/medieval-crusades.json'
import ancientEgyptData from '@/data/posts/ancient-egypt.json'
import americanCivilWarData from '@/data/posts/american-civil-war.json'
import coldWarData from '@/data/posts/cold-war.json'
import ageOfExplorationData from '@/data/posts/age-of-exploration.json'
import byzantineEmpireData from '@/data/posts/byzantine-empire.json'
import mongolEmpireData from '@/data/posts/mongol-empire.json'
import africanKingdomsData from '@/data/posts/african-kingdoms.json'
import profilesData from '@/data/profiles/index.json'
import erasData from '@/data/eras/index.json'
import relationshipsData from '@/data/relationships.json'

// Type assertions for imported JSON and combine posts
const julyPosts: Post[] = julyPostsData as Post[]
const expandedPosts: Post[] = expandedPostsData as Post[]
const globalPosts: Post[] = globalPostsData as Post[]
const mundanePosts: Post[] = mundanePostsData as Post[]
const everydayPosts: Post[] = everydayPostsData as Post[]
const laterRevolutionPosts: Post[] = laterRevolutionData as Post[]
const everyday1777Posts: Post[] = everyday1777Data as Post[]
const historicalFiguresPosts: Post[] = historicalFiguresData as Post[]
const ancientRomePosts: Post[] = ancientRomeData as Post[]
const worldWar2Posts: Post[] = worldWar2Data as Post[]
const renaissancePosts: Post[] = renaissanceData as Post[]
const civilRightsPosts: Post[] = civilRightsData as Post[]
const frenchRevolutionPosts: Post[] = frenchRevolutionData as Post[]
const ancientGreecePosts: Post[] = ancientGreeceData as Post[]
const worldWar1Posts: Post[] = worldWar1Data as Post[]
const industrialRevolutionPosts: Post[] = industrialRevolutionData as Post[]
const vikingAgePosts: Post[] = vikingAgeData as Post[]
const threadPosts: Post[] = threadsData as Post[]
const medievalCrusadesPosts: Post[] = medievalCrusadesData as Post[]
const ancientEgyptPosts: Post[] = ancientEgyptData as Post[]
const americanCivilWarPosts: Post[] = americanCivilWarData as Post[]
const coldWarPosts: Post[] = coldWarData as Post[]
const ageOfExplorationPosts: Post[] = ageOfExplorationData as Post[]
const byzantineEmpirePosts: Post[] = byzantineEmpireData as Post[]
const mongolEmpirePosts: Post[] = mongolEmpireData as Post[]
const africanKingdomsPosts: Post[] = africanKingdomsData as Post[]

// Combine all posts and sort by timestamp (newest first)
const posts: Post[] = [...julyPosts, ...expandedPosts, ...globalPosts, ...mundanePosts, ...everydayPosts, ...laterRevolutionPosts, ...everyday1777Posts, ...historicalFiguresPosts, ...ancientRomePosts, ...worldWar2Posts, ...renaissancePosts, ...civilRightsPosts, ...frenchRevolutionPosts, ...ancientGreecePosts, ...worldWar1Posts, ...industrialRevolutionPosts, ...vikingAgePosts, ...threadPosts, ...medievalCrusadesPosts, ...ancientEgyptPosts, ...americanCivilWarPosts, ...coldWarPosts, ...ageOfExplorationPosts, ...byzantineEmpirePosts, ...mongolEmpirePosts, ...africanKingdomsPosts].sort(
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

// Relationships data
const relationships: Record<string, Relationship[]> = relationshipsData as Record<string, Relationship[]>

/**
 * Get relationships for a profile
 */
export function getRelationships(profileId: string): Relationship[] {
  return relationships[profileId] || []
}

/**
 * Get all profiles that have a relationship with the given profile
 * (both directions - where they are the source AND where they are the target)
 */
export function getConnectedProfiles(profileId: string): { profile: Profile; relationship: Relationship; direction: 'outgoing' | 'incoming' }[] {
  const connected: { profile: Profile; relationship: Relationship; direction: 'outgoing' | 'incoming' }[] = []

  // Outgoing relationships (from this profile to others)
  const outgoing = relationships[profileId] || []
  outgoing.forEach(rel => {
    const profile = getProfile(rel.profileId)
    if (profile) {
      connected.push({ profile, relationship: rel, direction: 'outgoing' })
    }
  })

  // Incoming relationships (from others to this profile)
  Object.entries(relationships).forEach(([sourceId, rels]) => {
    if (sourceId !== profileId) {
      rels.forEach(rel => {
        if (rel.profileId === profileId) {
          const profile = getProfile(sourceId)
          if (profile) {
            // Create a reverse relationship
            const reverseRel: Relationship = {
              profileId: sourceId,
              type: rel.type,
              description: rel.description,
              since: rel.since,
              until: rel.until
            }
            connected.push({ profile, relationship: reverseRel, direction: 'incoming' })
          }
        }
      })
    }
  })

  return connected
}

/**
 * Get relationship between two profiles
 */
export function getRelationshipBetween(profileId1: string, profileId2: string): Relationship | undefined {
  const rels1 = relationships[profileId1] || []
  const found = rels1.find(r => r.profileId === profileId2)
  if (found) return found

  // Check reverse
  const rels2 = relationships[profileId2] || []
  return rels2.find(r => r.profileId === profileId1)
}
