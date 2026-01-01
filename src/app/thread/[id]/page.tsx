import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPosts, getProfiles } from '@/lib/data'
import { ThreadPageContent } from './ThreadPageContent'

interface ThreadPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const allPosts = getPosts()
  const threadPosts = allPosts.filter(p => p.threadId === params.id)

  if (threadPosts.length === 0) {
    return { title: 'Thread Not Found | Tempus' }
  }

  const firstPost = threadPosts.sort((a, b) => (a.threadPosition || 0) - (b.threadPosition || 0))[0]
  const allProfiles = getProfiles()
  const author = allProfiles.find(p => p.id === firstPost.authorId)

  return {
    title: `Thread by ${author?.displayName || 'Unknown'} | Tempus`,
    description: firstPost.content.slice(0, 160),
    openGraph: {
      title: `Thread by ${author?.displayName || 'Unknown'}`,
      description: firstPost.content.slice(0, 160),
      type: 'article',
      images: [
        {
          url: '/og/thread.png',
          width: 1200,
          height: 630,
          alt: `Thread by ${author?.displayName || 'Unknown'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thread by ${author?.displayName || 'Unknown'}`,
      description: firstPost.content.slice(0, 160),
      images: ['/og/thread.png'],
    },
  }
}

export async function generateStaticParams() {
  const allPosts = getPosts()

  // Get unique thread IDs
  const threadIds = new Set<string>()
  allPosts.forEach(post => {
    if (post.threadId) {
      threadIds.add(post.threadId)
    }
  })

  return Array.from(threadIds).map(id => ({ id }))
}

export default function ThreadPage({ params }: ThreadPageProps) {
  const allPosts = getPosts()
  const allProfiles = getProfiles()

  const threadPosts = allPosts.filter(p => p.threadId === params.id)

  if (threadPosts.length === 0) {
    notFound()
  }

  // Build profiles map
  const profilesMap: Record<string, typeof allProfiles[0]> = {}
  allProfiles.forEach(p => {
    profilesMap[p.id] = p
  })

  return (
    <ThreadPageContent
      posts={threadPosts}
      profiles={profilesMap}
      threadId={params.id}
    />
  )
}
