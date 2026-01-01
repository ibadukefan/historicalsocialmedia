import { MetadataRoute } from 'next'
import { getEras, getProfiles, getPosts } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://historicalsocialmedia.vercel.app'

  const eras = getEras()
  const profiles = getProfiles()
  const posts = getPosts()

  // Static pages
  const staticPages = [
    '',
    '/explore',
    '/search',
    '/profiles',
    '/timeline',
    '/map',
    '/trending',
    '/on-this-day',
    '/about',
    '/terms',
    '/privacy',
    '/settings',
    '/notifications',
    '/bookmarks',
    '/likes',
    '/following',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Era pages
  const eraPages = eras
    .filter((era) => (era.postCount || 0) > 0)
    .map((era) => ({
      url: `${baseUrl}/era/${era.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  // Profile pages
  const profilePages = profiles.map((profile) => ({
    url: `${baseUrl}/profile/${profile.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Post pages
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...eraPages, ...profilePages, ...postPages]
}
