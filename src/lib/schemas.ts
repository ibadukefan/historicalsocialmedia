// ============================================
// TEMPUS - Zod Validation Schemas
// ============================================

import { z } from 'zod'

/**
 * Post types representing different social media formats
 */
export const PostTypeSchema = z.enum([
  'status',
  'tweet',
  'photo',
  'video',
  'article',
  'quote',
  'event',
  'relationship',
  'location',
  'poll',
  'thread'
])

/**
 * Accuracy level for content
 */
export const AccuracyLevelSchema = z.enum([
  'verified',
  'documented',
  'attributed',
  'inferred',
  'speculative'
])

/**
 * Media attachment for posts
 */
export const MediaSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video', 'document', 'painting', 'map']),
  url: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  source: z.string().optional(),
  sourceLabel: z.string().optional(),
  year: z.number().optional(),
  artist: z.string().optional()
})

/**
 * Interaction (like, comment, share) on a post
 */
export const InteractionSchema = z.object({
  id: z.string(),
  type: z.enum(['like', 'comment', 'share', 'retweet', 'reaction']),
  authorId: z.string(),
  authorName: z.string(),
  authorHandle: z.string().optional(),
  content: z.string().optional(),
  timestamp: z.string(),
  reactionType: z.enum(['like', 'love', 'laugh', 'sad', 'angry', 'wow']).optional()
})

/**
 * Source/citation for historical accuracy
 */
export const SourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  year: z.number().optional(),
  url: z.string().optional(),
  type: z.enum(['primary', 'secondary', 'tertiary']),
  description: z.string().optional()
})

/**
 * Location for posts
 */
export const LocationSchema = z.object({
  name: z.string(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  modern: z.string().optional()
})

/**
 * A post in the timeline feed
 */
export const PostSchema = z.object({
  id: z.string(),
  type: PostTypeSchema,
  authorId: z.string(),

  // Content
  content: z.string(),
  contentHtml: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),

  // Timing
  timestamp: z.string(),
  displayDate: z.string(),
  displayTime: z.string().optional(),
  era: z.string(),

  // Location
  location: LocationSchema.optional(),

  // Media
  media: z.array(MediaSchema).optional(),

  // Interactions
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  interactions: z.array(InteractionSchema).optional(),

  // Thread support
  threadId: z.string().optional(),
  threadPosition: z.number().optional(),
  replyToId: z.string().optional(),

  // Accuracy & sources
  accuracy: AccuracyLevelSchema,
  accuracyNote: z.string().optional(),
  sources: z.array(SourceSchema).optional(),

  // Historical context
  historicalContext: z.string().optional(),

  // Metadata
  tags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  language: z.string().optional(),
  translation: z.string().optional()
})

/**
 * Relationship between profiles
 */
export const RelationshipSchema = z.object({
  profileId: z.string(),
  type: z.enum(['friend', 'family', 'colleague', 'rival', 'spouse', 'ally', 'enemy', 'mentor', 'student']),
  since: z.string().optional(),
  until: z.string().optional(),
  description: z.string().optional()
})

/**
 * Life event for profile timeline
 */
export const LifeEventSchema = z.object({
  id: z.string(),
  type: z.enum(['birth', 'death', 'marriage', 'divorce', 'education', 'career', 'achievement', 'travel', 'other']),
  date: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional()
})

/**
 * Avatar history entry
 */
export const AvatarHistorySchema = z.object({
  url: z.string(),
  from: z.string(),
  to: z.string().optional(),
  description: z.string().optional()
})

/**
 * Historical figure profile
 */
export const ProfileSchema = z.object({
  id: z.string(),

  // Identity
  name: z.string(),
  displayName: z.string(),
  handle: z.string(),

  // Bio
  bio: z.string(),
  bioLong: z.string().optional(),
  title: z.string().optional(),
  titles: z.array(z.string()).optional(),

  // Dates
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  deathDate: z.string().optional(),
  deathPlace: z.string().optional(),

  // Profile media
  avatar: z.string(),
  avatarHistory: z.array(AvatarHistorySchema).optional(),
  coverImage: z.string().optional(),

  // Social
  relationships: z.array(RelationshipSchema).optional(),
  followers: z.number().optional(),
  following: z.number().optional(),

  // Life timeline
  lifeEvents: z.array(LifeEventSchema).optional(),

  // Categorization
  era: z.array(z.string()),
  nationality: z.string().optional(),
  occupation: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),

  // Status
  isVerified: z.boolean(),
  isActive: z.boolean(),

  // Accuracy
  accuracy: AccuracyLevelSchema,
  sources: z.array(SourceSchema).optional()
})

/**
 * Era/time period metadata
 */
export const EraSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string(),

  // Time range
  startDate: z.string(),
  endDate: z.string(),

  // Content
  coverImage: z.string().optional(),
  color: z.string().optional(),

  // Stats
  postCount: z.number().optional(),
  profileCount: z.number().optional(),

  // Navigation
  previousEra: z.string().optional(),
  nextEra: z.string().optional(),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

/**
 * Historical relationship data
 */
export const HistoricalRelationshipSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(['spouse', 'family', 'friend', 'ally', 'colleague', 'mentor', 'student', 'rival', 'enemy']),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

/**
 * On This Day event
 */
export const OnThisDayEventSchema = z.object({
  date: z.string(),
  year: z.union([z.number(), z.string()]),
  title: z.string(),
  description: z.string(),
  era: z.string(),
  location: z.string().optional()
})

// ============================================
// Validation Functions
// ============================================

/**
 * Validate an array of posts
 */
export function validatePosts(data: unknown): { success: boolean; data?: z.infer<typeof PostSchema>[]; errors?: z.ZodError } {
  const result = z.array(PostSchema).safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate an array of profiles
 */
export function validateProfiles(data: unknown): { success: boolean; data?: z.infer<typeof ProfileSchema>[]; errors?: z.ZodError } {
  const result = z.array(ProfileSchema).safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate an array of eras
 */
export function validateEras(data: unknown): { success: boolean; data?: z.infer<typeof EraSchema>[]; errors?: z.ZodError } {
  const result = z.array(EraSchema).safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate an array of relationships
 */
export function validateRelationships(data: unknown): { success: boolean; data?: z.infer<typeof HistoricalRelationshipSchema>[]; errors?: z.ZodError } {
  const result = z.array(HistoricalRelationshipSchema).safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

// ============================================
// Type Exports
// ============================================

export type PostType = z.infer<typeof PostTypeSchema>
export type AccuracyLevel = z.infer<typeof AccuracyLevelSchema>
export type Media = z.infer<typeof MediaSchema>
export type Interaction = z.infer<typeof InteractionSchema>
export type Source = z.infer<typeof SourceSchema>
export type Location = z.infer<typeof LocationSchema>
export type Post = z.infer<typeof PostSchema>
export type Relationship = z.infer<typeof RelationshipSchema>
export type LifeEvent = z.infer<typeof LifeEventSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Era = z.infer<typeof EraSchema>
export type HistoricalRelationship = z.infer<typeof HistoricalRelationshipSchema>
export type OnThisDayEvent = z.infer<typeof OnThisDayEventSchema>
