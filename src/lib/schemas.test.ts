import { describe, it, expect } from 'vitest'
import {
  PostSchema,
  ProfileSchema,
  EraSchema,
  MediaSchema,
  SourceSchema,
  RelationshipSchema,
  validatePosts,
  validateProfiles,
  validateEras
} from './schemas'

describe('PostSchema', () => {
  it('validates a valid post', () => {
    const validPost = {
      id: 'test-001',
      type: 'status',
      authorId: 'thomas-jefferson',
      content: 'Test content',
      timestamp: '1776-07-04T12:00:00Z',
      displayDate: 'July 4, 1776',
      era: 'american-revolution',
      likes: 100,
      comments: 10,
      shares: 5,
      accuracy: 'documented'
    }
    const result = PostSchema.safeParse(validPost)
    expect(result.success).toBe(true)
  })

  it('rejects post with missing required fields', () => {
    const invalidPost = {
      id: 'test-001',
      type: 'status'
      // Missing content, authorId, etc.
    }
    const result = PostSchema.safeParse(invalidPost)
    expect(result.success).toBe(false)
  })

  it('rejects post with invalid type', () => {
    const invalidPost = {
      id: 'test-001',
      type: 'invalid-type',
      authorId: 'test',
      content: 'Test',
      timestamp: '1776-07-04T12:00:00Z',
      displayDate: 'July 4, 1776',
      era: 'american-revolution',
      likes: 100,
      comments: 10,
      shares: 5,
      accuracy: 'documented'
    }
    const result = PostSchema.safeParse(invalidPost)
    expect(result.success).toBe(false)
  })

  it('rejects post with invalid accuracy level', () => {
    const invalidPost = {
      id: 'test-001',
      type: 'status',
      authorId: 'test',
      content: 'Test',
      timestamp: '1776-07-04T12:00:00Z',
      displayDate: 'July 4, 1776',
      era: 'american-revolution',
      likes: 100,
      comments: 10,
      shares: 5,
      accuracy: 'fake-accuracy'
    }
    const result = PostSchema.safeParse(invalidPost)
    expect(result.success).toBe(false)
  })

  it('accepts post with optional fields', () => {
    const postWithOptionals = {
      id: 'test-001',
      type: 'status',
      authorId: 'thomas-jefferson',
      content: 'Test content',
      timestamp: '1776-07-04T12:00:00Z',
      displayDate: 'July 4, 1776',
      era: 'american-revolution',
      likes: 100,
      comments: 10,
      shares: 5,
      accuracy: 'documented',
      location: { name: 'Philadelphia', modern: 'Philadelphia, PA' },
      hashtags: ['#independence', '#freedom'],
      historicalContext: 'Historical context here'
    }
    const result = PostSchema.safeParse(postWithOptionals)
    expect(result.success).toBe(true)
  })
})

describe('ProfileSchema', () => {
  it('validates a valid profile', () => {
    const validProfile = {
      id: 'thomas-jefferson',
      name: 'Thomas Jefferson',
      displayName: 'Thomas Jefferson',
      handle: '@TJefferson',
      bio: 'Author of the Declaration',
      avatar: '/avatars/jefferson.jpg',
      era: ['american-revolution'],
      isVerified: true,
      isActive: false,
      accuracy: 'verified'
    }
    const result = ProfileSchema.safeParse(validProfile)
    expect(result.success).toBe(true)
  })

  it('requires era to be an array', () => {
    const invalidProfile = {
      id: 'thomas-jefferson',
      name: 'Thomas Jefferson',
      displayName: 'Thomas Jefferson',
      handle: '@TJefferson',
      bio: 'Author of the Declaration',
      avatar: '/avatars/jefferson.jpg',
      era: 'american-revolution', // Should be array
      isVerified: true,
      isActive: false,
      accuracy: 'verified'
    }
    const result = ProfileSchema.safeParse(invalidProfile)
    expect(result.success).toBe(false)
  })
})

describe('EraSchema', () => {
  it('validates a valid era', () => {
    const validEra = {
      id: 'american-revolution',
      name: 'American Revolution',
      description: 'The birth of a nation',
      startDate: '1765-01-01',
      endDate: '1783-12-31'
    }
    const result = EraSchema.safeParse(validEra)
    expect(result.success).toBe(true)
  })

  it('rejects era with missing required fields', () => {
    const invalidEra = {
      id: 'test',
      name: 'Test'
      // Missing description, startDate, endDate
    }
    const result = EraSchema.safeParse(invalidEra)
    expect(result.success).toBe(false)
  })
})

describe('MediaSchema', () => {
  it('validates valid media', () => {
    const validMedia = {
      id: 'img-001',
      type: 'image',
      url: '/images/test.jpg',
      alt: 'A test image'
    }
    const result = MediaSchema.safeParse(validMedia)
    expect(result.success).toBe(true)
  })

  it('rejects media with invalid type', () => {
    const invalidMedia = {
      id: 'img-001',
      type: 'audio', // Not a valid type
      url: '/audio/test.mp3',
      alt: 'A test audio'
    }
    const result = MediaSchema.safeParse(invalidMedia)
    expect(result.success).toBe(false)
  })
})

describe('SourceSchema', () => {
  it('validates valid source', () => {
    const validSource = {
      id: 'src-001',
      title: 'Primary Document',
      type: 'primary'
    }
    const result = SourceSchema.safeParse(validSource)
    expect(result.success).toBe(true)
  })

  it('accepts source with optional fields', () => {
    const sourceWithOptionals = {
      id: 'src-001',
      title: 'Primary Document',
      type: 'secondary',
      author: 'John Smith',
      year: 1850,
      url: 'https://example.com/doc'
    }
    const result = SourceSchema.safeParse(sourceWithOptionals)
    expect(result.success).toBe(true)
  })
})

describe('RelationshipSchema', () => {
  it('validates valid relationship', () => {
    const validRelationship = {
      profileId: 'john-adams',
      type: 'friend'
    }
    const result = RelationshipSchema.safeParse(validRelationship)
    expect(result.success).toBe(true)
  })

  it('rejects relationship with invalid type', () => {
    const invalidRelationship = {
      profileId: 'john-adams',
      type: 'acquaintance' // Not a valid type
    }
    const result = RelationshipSchema.safeParse(invalidRelationship)
    expect(result.success).toBe(false)
  })
})

describe('validatePosts', () => {
  it('validates an array of valid posts', () => {
    const posts = [
      {
        id: 'test-001',
        type: 'status',
        authorId: 'test',
        content: 'Test content 1',
        timestamp: '1776-07-04T12:00:00Z',
        displayDate: 'July 4, 1776',
        era: 'american-revolution',
        likes: 100,
        comments: 10,
        shares: 5,
        accuracy: 'documented'
      },
      {
        id: 'test-002',
        type: 'tweet',
        authorId: 'test',
        content: 'Test content 2',
        timestamp: '1776-07-05T12:00:00Z',
        displayDate: 'July 5, 1776',
        era: 'american-revolution',
        likes: 50,
        comments: 5,
        shares: 2,
        accuracy: 'verified'
      }
    ]
    const result = validatePosts(posts)
    expect(result.success).toBe(true)
    expect(result.data?.length).toBe(2)
  })

  it('returns errors for invalid posts', () => {
    const invalidPosts = [
      { id: 'test', type: 'invalid' } // Missing required fields
    ]
    const result = validatePosts(invalidPosts)
    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
  })
})

describe('validateProfiles', () => {
  it('validates an array of valid profiles', () => {
    const profiles = [
      {
        id: 'test-profile',
        name: 'Test Person',
        displayName: 'Test Person',
        handle: '@test',
        bio: 'A test profile',
        avatar: '/test.jpg',
        era: ['test-era'],
        isVerified: true,
        isActive: true,
        accuracy: 'documented'
      }
    ]
    const result = validateProfiles(profiles)
    expect(result.success).toBe(true)
  })
})

describe('validateEras', () => {
  it('validates an array of valid eras', () => {
    const eras = [
      {
        id: 'test-era',
        name: 'Test Era',
        description: 'A test era',
        startDate: '1700-01-01',
        endDate: '1800-12-31'
      }
    ]
    const result = validateEras(eras)
    expect(result.success).toBe(true)
  })
})
