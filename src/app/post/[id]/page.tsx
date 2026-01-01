import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts, getPost, getProfile, getPostsByAuthor, getEra } from '@/lib/data'
import { PostPageContent } from '@/components/post/PostPageContent'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const posts = getPosts()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = getPost(id)

  if (!post) {
    return {
      title: 'Post Not Found | Tempus',
    }
  }

  const author = getProfile(post.authorId)
  const authorName = author?.displayName || 'Unknown'
  const excerpt = post.content.slice(0, 160) + (post.content.length > 160 ? '...' : '')

  return {
    title: `${authorName} on ${post.displayDate} | Tempus`,
    description: excerpt,
    openGraph: {
      title: `${authorName}: "${excerpt}"`,
      description: `${post.displayDate} - ${post.historicalContext || 'A moment from history'}`,
      type: 'article',
      publishedTime: post.timestamp,
      images: [
        {
          url: `/og/era-${post.era}.png`,
          width: 1200,
          height: 630,
          alt: `${authorName} - ${post.displayDate}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${authorName} on ${post.displayDate}`,
      description: excerpt,
      images: [`/og/era-${post.era}.png`],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const post = getPost(id)

  if (!post) {
    notFound()
  }

  const author = getProfile(post.authorId)
  const era = getEra(post.era)

  // Get related posts: same author
  const authorPosts = getPostsByAuthor(post.authorId)
    .filter(p => p.id !== post.id)
    .slice(0, 3)

  // Get related posts: same era (different author)
  const allPosts = getPosts()
  const eraPosts = allPosts
    .filter(p => p.era === post.era && p.id !== post.id && p.authorId !== post.authorId)
    .slice(0, 3)
    .map(p => ({
      post: p,
      author: getProfile(p.authorId)
    }))

  return (
    <PostPageContent
      post={post}
      author={author}
      era={era}
      authorPosts={authorPosts}
      eraPosts={eraPosts}
    />
  )
}
