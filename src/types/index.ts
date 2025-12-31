// ============================================
// TEMPUS - Core Type Definitions
// ============================================

/**
 * Post types representing different social media formats
 */
export type PostType =
  | 'status'      // Facebook-style status update
  | 'tweet'       // Twitter-style short message
  | 'photo'       // Image post with caption
  | 'video'       // Video/reenactment description
  | 'article'     // Long-form content (newspaper style)
  | 'quote'       // Quote from historical record
  | 'event'       // Major historical event
  | 'relationship'// Relationship status change
  | 'location'    // Check-in / location update
  | 'poll'        // Opinion poll (simulated)
  | 'thread'      // Multi-part thread

/**
 * Accuracy level for content
 */
export type AccuracyLevel =
  | 'verified'    // Directly from historical records
  | 'documented'  // Well-documented historical fact
  | 'attributed'  // Attributed quote/action
  | 'inferred'    // Reasonable inference from context
  | 'speculative' // Educated guess (marked with notation)

/**
 * Media attachment for posts
 */
export interface Media {
  id: string
  type: 'image' | 'video' | 'document' | 'painting' | 'map'
  url: string
  alt: string
  caption?: string
  source?: string           // Attribution/source URL
  sourceLabel?: string      // Human-readable source name
  year?: number             // Year of original media
  artist?: string           // For paintings/artwork
}

/**
 * Interaction (like, comment, share) on a post
 */
export interface Interaction {
  id: string
  type: 'like' | 'comment' | 'share' | 'retweet' | 'reaction'
  authorId: string          // Profile ID of person interacting
  authorName: string        // Display name
  authorHandle?: string     // @ handle
  content?: string          // For comments
  timestamp: string         // ISO date string
  reactionType?: 'like' | 'love' | 'laugh' | 'sad' | 'angry' | 'wow'
}

/**
 * Source/citation for historical accuracy
 */
export interface Source {
  id: string
  title: string
  author?: string
  year?: number
  url?: string
  type: 'primary' | 'secondary' | 'tertiary'
  description?: string
}

/**
 * A post in the timeline feed
 */
export interface Post {
  id: string
  type: PostType
  authorId: string

  // Content
  content: string           // Main text content
  contentHtml?: string      // Pre-rendered HTML if needed
  title?: string            // For articles/events
  subtitle?: string

  // Timing
  timestamp: string         // ISO date string (exact moment)
  displayDate: string       // Human-readable date
  displayTime?: string      // Human-readable time if known
  era: string               // Era slug (e.g., 'american-revolution')

  // Location
  location?: {
    name: string
    coordinates?: [number, number]
    modern?: string         // Modern name/country
  }

  // Media
  media?: Media[]

  // Interactions
  likes: number
  comments: number
  shares: number
  interactions?: Interaction[]

  // Thread support
  threadId?: string         // If part of a thread
  threadPosition?: number   // Position in thread
  replyToId?: string        // If reply to another post

  // Accuracy & sources
  accuracy: AccuracyLevel
  accuracyNote?: string     // Explanation if speculative
  sources?: Source[]

  // Historical context (shown on demand, not in post)
  historicalContext?: string  // What's actually happening - users click to see

  // Metadata
  tags?: string[]
  mentions?: string[]       // Profile IDs mentioned
  hashtags?: string[]       // Simulated hashtags
  isPinned?: boolean
  isVerified?: boolean      // Verified historical figure
  language?: string         // Original language if not English
  translation?: string      // If translated
}

/**
 * Relationship between profiles
 */
export interface Relationship {
  profileId: string
  type: 'friend' | 'family' | 'colleague' | 'rival' | 'spouse' | 'ally' | 'enemy' | 'mentor' | 'student'
  since?: string            // Date relationship started
  until?: string            // Date relationship ended
  description?: string
}

/**
 * Life event for profile timeline
 */
export interface LifeEvent {
  id: string
  type: 'birth' | 'death' | 'marriage' | 'divorce' | 'education' | 'career' | 'achievement' | 'travel' | 'other'
  date: string
  title: string
  description?: string
  location?: string
}

/**
 * Historical figure profile
 */
export interface Profile {
  id: string                // Slug (e.g., 'george-washington')

  // Identity
  name: string              // Full name
  displayName: string       // Display name
  handle: string            // @ handle (e.g., @GeneralWashington)

  // Bio
  bio: string               // Short bio
  bioLong?: string          // Extended bio
  title?: string            // Title/occupation
  titles?: string[]         // All titles over time

  // Dates
  birthDate?: string
  birthPlace?: string
  deathDate?: string
  deathPlace?: string

  // Profile media
  avatar: string            // Profile picture URL
  avatarHistory?: {         // Profile picture changes over time
    url: string
    from: string
    to?: string
    description?: string
  }[]
  coverImage?: string

  // Social
  relationships?: Relationship[]
  followers?: number        // Simulated follower count
  following?: number

  // Life timeline
  lifeEvents?: LifeEvent[]

  // Categorization
  era: string[]             // Eras this person appears in
  nationality?: string
  occupation?: string[]
  tags?: string[]

  // Status
  isVerified: boolean       // Blue checkmark for notable figures
  isActive: boolean         // False if deceased by current timeline point

  // Accuracy
  accuracy: AccuracyLevel
  sources?: Source[]
}

/**
 * Era/time period metadata
 */
export interface Era {
  id: string                // Slug
  name: string              // Display name
  shortName?: string
  description: string

  // Time range
  startDate: string
  endDate: string

  // Content
  coverImage?: string
  color?: string            // Theme color

  // Stats
  postCount?: number
  profileCount?: number

  // Navigation
  previousEra?: string
  nextEra?: string

  // SEO
  metaTitle?: string
  metaDescription?: string
}

/**
 * Feed segment for infinite scroll
 */
export interface FeedSegment {
  id: string
  startDate: string
  endDate: string
  posts: Post[]
  hasMore: boolean
  nextCursor?: string
}

/**
 * Search result
 */
export interface SearchResult {
  type: 'post' | 'profile' | 'era'
  id: string
  title: string
  subtitle?: string
  excerpt?: string
  url: string
  timestamp?: string
  avatar?: string
}

/**
 * Filter options for feed
 */
export interface FeedFilters {
  era?: string
  startDate?: string
  endDate?: string
  profileId?: string
  postTypes?: PostType[]
  location?: string
  search?: string
  accuracy?: AccuracyLevel[]
  tags?: string[]
}
