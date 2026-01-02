import { describe, it, expect } from 'vitest'
import {
  getPosts,
  getPost,
  getFeedSegment,
  getProfiles,
  getProfile,
  getProfilesByEra,
  getPostsByAuthor,
  getEras,
  getEra,
  getProfileByHandle,
  search,
  getTrending,
  getSuggestedProfiles,
  getRelationships,
  getConnectedProfiles,
  getRelationshipBetween
} from './data'

describe('getPosts', () => {
  it('returns all posts when no filters', () => {
    const posts = getPosts()
    expect(posts.length).toBeGreaterThan(0)
  })

  it('filters posts by era', () => {
    const posts = getPosts({ era: 'ancient-rome' })
    expect(posts.length).toBeGreaterThan(0)
    posts.forEach(post => {
      expect(post.era).toBe('ancient-rome')
    })
  })

  it('returns empty array for non-existent era', () => {
    const posts = getPosts({ era: 'non-existent-era' })
    expect(posts).toEqual([])
  })

  it('filters posts by profileId', () => {
    const posts = getPosts({ profileId: 'thomas-jefferson' })
    posts.forEach(post => {
      expect(post.authorId).toBe('thomas-jefferson')
    })
  })

  it('filters posts by search query', () => {
    const posts = getPosts({ search: 'liberty' })
    posts.forEach(post => {
      const content = post.content.toLowerCase()
      const title = post.title?.toLowerCase() || ''
      const hasTerm = content.includes('liberty') || title.includes('liberty')
      expect(hasTerm).toBe(true)
    })
  })

  it('returns posts sorted by timestamp (newest first)', () => {
    const posts = getPosts()
    for (let i = 1; i < Math.min(posts.length, 100); i++) {
      const prevTime = new Date(posts[i - 1].timestamp).getTime()
      const currTime = new Date(posts[i].timestamp).getTime()
      expect(prevTime).toBeGreaterThanOrEqual(currTime)
    }
  })
})

describe('getPost', () => {
  it('returns post by ID', () => {
    const posts = getPosts()
    const firstPost = posts[0]
    const found = getPost(firstPost.id)
    expect(found).toEqual(firstPost)
  })

  it('returns undefined for non-existent ID', () => {
    const found = getPost('non-existent-id-12345')
    expect(found).toBeUndefined()
  })
})

describe('getFeedSegment', () => {
  it('returns initial segment when no cursor', () => {
    const segment = getFeedSegment(undefined, 10)
    expect(segment.posts.length).toBeLessThanOrEqual(10)
    expect(segment.id).toBe('initial')
  })

  it('returns next segment with cursor', () => {
    const first = getFeedSegment(undefined, 10)
    if (first.hasMore && first.nextCursor) {
      const second = getFeedSegment(first.nextCursor, 10)
      expect(second.posts.length).toBeLessThanOrEqual(10)
      // First post of second segment should be different from last post of first
      expect(second.posts[0]?.id).not.toBe(first.posts[first.posts.length - 1]?.id)
    }
  })

  it('indicates hasMore correctly', () => {
    const allPosts = getPosts()
    const smallSegment = getFeedSegment(undefined, 5)
    if (allPosts.length > 5) {
      expect(smallSegment.hasMore).toBe(true)
    }
  })
})

describe('getProfiles', () => {
  it('returns all profiles', () => {
    const profiles = getProfiles()
    expect(profiles.length).toBeGreaterThan(0)
  })

  it('profiles have required fields', () => {
    const profiles = getProfiles()
    profiles.forEach(profile => {
      expect(profile.id).toBeDefined()
      expect(profile.name).toBeDefined()
      expect(profile.handle).toBeDefined()
    })
  })
})

describe('getProfile', () => {
  it('returns profile by ID', () => {
    const profile = getProfile('thomas-jefferson')
    expect(profile).toBeDefined()
    expect(profile?.name).toContain('Jefferson')
  })

  it('returns undefined for non-existent ID', () => {
    const profile = getProfile('non-existent-profile')
    expect(profile).toBeUndefined()
  })
})

describe('getProfilesByEra', () => {
  it('returns profiles for a specific era', () => {
    const profiles = getProfilesByEra('american-revolution')
    expect(profiles.length).toBeGreaterThan(0)
    profiles.forEach(profile => {
      expect(profile.era).toContain('american-revolution')
    })
  })

  it('returns empty array for non-existent era', () => {
    const profiles = getProfilesByEra('non-existent-era')
    expect(profiles).toEqual([])
  })
})

describe('getPostsByAuthor', () => {
  it('returns posts by a specific author', () => {
    const posts = getPostsByAuthor('thomas-jefferson')
    posts.forEach(post => {
      expect(post.authorId).toBe('thomas-jefferson')
    })
  })

  it('returns posts sorted by timestamp', () => {
    const posts = getPostsByAuthor('thomas-jefferson')
    for (let i = 1; i < posts.length; i++) {
      const prevTime = new Date(posts[i - 1].timestamp).getTime()
      const currTime = new Date(posts[i].timestamp).getTime()
      expect(prevTime).toBeGreaterThanOrEqual(currTime)
    }
  })
})

describe('getEras', () => {
  it('returns all eras', () => {
    const eras = getEras()
    expect(eras.length).toBeGreaterThan(0)
  })

  it('eras have required fields', () => {
    const eras = getEras()
    eras.forEach(era => {
      expect(era.id).toBeDefined()
      expect(era.name).toBeDefined()
      expect(era.description).toBeDefined()
    })
  })
})

describe('getEra', () => {
  it('returns era by ID', () => {
    const era = getEra('american-revolution')
    expect(era).toBeDefined()
    expect(era?.name).toContain('Revolution')
  })

  it('returns undefined for non-existent ID', () => {
    const era = getEra('non-existent-era')
    expect(era).toBeUndefined()
  })
})

describe('getProfileByHandle', () => {
  it('returns profile by handle with @', () => {
    const profiles = getProfiles()
    const firstProfile = profiles[0]
    const found = getProfileByHandle(firstProfile.handle)
    expect(found?.id).toBe(firstProfile.id)
  })

  it('returns profile by handle without @', () => {
    const profiles = getProfiles()
    const firstProfile = profiles[0]
    const handleWithoutAt = firstProfile.handle.replace('@', '')
    const found = getProfileByHandle(handleWithoutAt)
    expect(found?.id).toBe(firstProfile.id)
  })

  it('returns undefined for non-existent handle', () => {
    const found = getProfileByHandle('@nonexistenthandle12345')
    expect(found).toBeUndefined()
  })
})

describe('search', () => {
  it('searches posts by content', () => {
    const results = search('declaration')
    expect(results.posts.length).toBeGreaterThanOrEqual(0)
    // If results exist, they should contain the search term
    if (results.posts.length > 0) {
      const hasMatch = results.posts.some(p =>
        p.content.toLowerCase().includes('declaration') ||
        p.title?.toLowerCase().includes('declaration')
      )
      expect(hasMatch).toBe(true)
    }
  })

  it('searches profiles by name', () => {
    const results = search('Jefferson')
    expect(results.profiles.length).toBeGreaterThan(0)
    const hasJefferson = results.profiles.some(p =>
      p.name.toLowerCase().includes('jefferson') ||
      p.displayName.toLowerCase().includes('jefferson')
    )
    expect(hasJefferson).toBe(true)
  })

  it('respects limit parameter', () => {
    const results = search('the', 5)
    expect(results.posts.length).toBeLessThanOrEqual(5)
    expect(results.profiles.length).toBeLessThanOrEqual(5)
  })
})

describe('getTrending', () => {
  it('returns trending hashtags', () => {
    const trending = getTrending()
    expect(Array.isArray(trending)).toBe(true)
  })

  it('respects limit parameter', () => {
    const trending = getTrending(5)
    expect(trending.length).toBeLessThanOrEqual(5)
  })

  it('trending items have tag and count', () => {
    const trending = getTrending()
    trending.forEach(item => {
      expect(item.tag).toBeDefined()
      expect(typeof item.count).toBe('number')
    })
  })

  it('trending is sorted by count descending', () => {
    const trending = getTrending()
    for (let i = 1; i < trending.length; i++) {
      expect(trending[i - 1].count).toBeGreaterThanOrEqual(trending[i].count)
    }
  })
})

describe('getSuggestedProfiles', () => {
  it('returns suggested profiles', () => {
    const suggested = getSuggestedProfiles()
    expect(suggested.length).toBeGreaterThan(0)
  })

  it('respects limit parameter', () => {
    const suggested = getSuggestedProfiles(3)
    expect(suggested.length).toBeLessThanOrEqual(3)
  })

  it('returns only verified profiles', () => {
    const suggested = getSuggestedProfiles()
    suggested.forEach(profile => {
      expect(profile.isVerified).toBe(true)
    })
  })
})

describe('getRelationships', () => {
  it('returns relationships for a profile', () => {
    // Find a profile that has relationships
    const profiles = getProfiles()
    let foundProfile = null
    for (const profile of profiles) {
      const rels = getRelationships(profile.id)
      if (rels.length > 0) {
        foundProfile = profile
        break
      }
    }
    if (foundProfile) {
      const rels = getRelationships(foundProfile.id)
      expect(rels.length).toBeGreaterThan(0)
      rels.forEach(rel => {
        expect(rel.profileId).toBeDefined()
        expect(rel.type).toBeDefined()
      })
    }
  })

  it('returns empty array for profile without relationships', () => {
    const rels = getRelationships('non-existent-profile')
    expect(rels).toEqual([])
  })
})

describe('getConnectedProfiles', () => {
  it('returns connected profiles with direction', () => {
    // Find a profile that has connections
    const profiles = getProfiles()
    let foundProfile = null
    for (const profile of profiles) {
      const connected = getConnectedProfiles(profile.id)
      if (connected.length > 0) {
        foundProfile = profile
        break
      }
    }
    if (foundProfile) {
      const connected = getConnectedProfiles(foundProfile.id)
      expect(connected.length).toBeGreaterThan(0)
      connected.forEach(conn => {
        expect(conn.profile).toBeDefined()
        expect(conn.relationship).toBeDefined()
        expect(['outgoing', 'incoming']).toContain(conn.direction)
      })
    }
  })
})

describe('getRelationshipBetween', () => {
  it('returns undefined when no relationship exists', () => {
    const rel = getRelationshipBetween('non-existent-1', 'non-existent-2')
    expect(rel).toBeUndefined()
  })
})
