'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MapPin,
  CheckCircle2,
  Quote,
  Calendar,
  ExternalLink,
  Info,
  Image as ImageIcon,
  Video,
  FileText,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
  Lightbulb,
  Clock
} from 'lucide-react'
import { Post, Profile, Era } from '@/types'
import { cn, formatHistoricalDate, formatNumber, getAccuracyColor } from '@/lib/utils'
import { useBookmarks } from '@/components/BookmarksProvider'
import { useLikes } from '@/components/LikesProvider'
import { useComments } from '@/components/CommentsProvider'
import { PostCard } from '@/components/feed/PostCard'
import { CommentThread } from '@/components/comments/CommentThread'

interface PostPageContentProps {
  post: Post
  author?: Profile
  era?: Era
  authorPosts: Post[]
  eraPosts: { post: Post; author?: Profile }[]
}

export function PostPageContent({ post, author, era, authorPosts, eraPosts }: PostPageContentProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isLiked, toggleLike } = useLikes()
  const { getCommentCount } = useComments()

  const userCommentCount = getCommentCount(post.id)

  // Close share menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const liked = isLiked(post.id)
  const bookmarked = isBookmarked(post.id)
  const authorName = author?.displayName || 'Unknown'
  const authorHandle = author?.handle || '@unknown'
  const isVerified = author?.isVerified || false

  // Build share content
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://historicalsocialmedia.vercel.app'
  const postUrl = `${siteUrl}/post/${post.id}`
  const shareText = `"${post.content.slice(0, 200)}${post.content.length > 200 ? '...' : ''}" — ${authorName}, ${post.displayDate}`
  const shareTextEncoded = encodeURIComponent(shareText)
  const postUrlEncoded = encodeURIComponent(postUrl)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${postUrlEncoded}&hashtags=Tempus,HistoryAsItHappened`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrlEncoded}&quote=${shareTextEncoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrlEncoded}`,
    reddit: `https://reddit.com/submit?url=${postUrlEncoded}&title=${shareTextEncoded}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${postUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleLike = () => {
    toggleLike(post.id)
  }

  const handleBookmark = () => {
    toggleBookmark(post.id)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-muted" aria-label="Back to feed">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-xl">Post</h1>
            <p className="text-sm text-muted-foreground">
              {post.displayDate} · {era?.shortName || era?.name || 'Historical'}
            </p>
          </div>
        </div>
      </div>

      {/* Main post */}
      <article className="border-b border-border">
        {/* Author header */}
        <div className="p-4 pb-0">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${post.authorId}`} className="shrink-0">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-semibold overflow-hidden">
                  {author?.avatar ? (
                    <img
                      src={author.avatar}
                      alt={`${authorName}'s avatar`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    authorName.charAt(0)
                  )}
                </div>
                {isVerified && (
                  <CheckCircle2
                    className="absolute -bottom-0.5 -right-0.5 h-5 w-5 text-primary fill-background"
                    aria-label="Verified historical figure"
                  />
                )}
              </div>
            </Link>
            <div className="flex-1">
              <Link href={`/profile/${post.authorId}`} className="font-bold text-lg hover:underline">
                {authorName}
              </Link>
              <div className="flex items-center gap-1 text-muted-foreground">
                {isVerified && <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />}
                <span>{authorHandle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="p-4">
          {/* Post type indicator */}
          {post.type !== 'status' && post.type !== 'tweet' && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              {post.type === 'event' && <Calendar className="h-4 w-4" />}
              {post.type === 'quote' && <Quote className="h-4 w-4" />}
              {post.type === 'photo' && <ImageIcon className="h-4 w-4" />}
              {post.type === 'video' && <Video className="h-4 w-4" />}
              {post.type === 'article' && <FileText className="h-4 w-4" />}
              <span className="capitalize">{post.type}</span>
            </div>
          )}

          {/* Title */}
          {post.title && (
            <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
          )}

          {/* Main content */}
          <p className="text-xl whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>

          {/* Speculative note */}
          {post.accuracy === 'speculative' && post.accuracyNote && (
            <p className="mt-3 text-sm italic text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded">
              Note: {post.accuracyNote}
            </p>
          )}

          {/* Quote styling */}
          {post.type === 'quote' && (
            <div className="mt-4 pl-4 border-l-4 border-primary/50">
              <Quote className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-1 mt-4 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{post.location.name}</span>
              {post.location.modern && (
                <span className="text-sm">({post.location.modern})</span>
              )}
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.hashtags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${tag}`}
                  className="text-primary hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 mt-4 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <time dateTime={post.timestamp} className="text-sm">
              {formatHistoricalDate(post.timestamp)} · {post.displayDate}
            </time>
          </div>
        </div>

        {/* Historical context - shown by default on individual post page */}
        {post.historicalContext && (
          <div className="mx-4 mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Historical Context</h3>
                <p className="text-muted-foreground">{post.historicalContext}</p>
              </div>
            </div>
          </div>
        )}

        {/* Accuracy and sources */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm px-3 py-1 rounded-full font-medium",
              getAccuracyColor(post.accuracy)
            )}>
              {post.accuracy}
            </span>
            {era && (
              <Link href={`/era/${era.id}`} className="text-sm text-muted-foreground hover:text-primary">
                {era.name}
              </Link>
            )}
          </div>

          {/* Sources */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Sources
              </h4>
              <ul className="space-y-1 text-sm">
                {post.sources.map((source) => (
                  <li key={source.id} className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground uppercase">
                      [{source.type}]
                    </span>
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {source.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span>{source.title}</span>
                    )}
                    {source.author && (
                      <span className="text-muted-foreground">by {source.author}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Engagement stats */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex gap-4 text-sm">
            <span><strong>{formatNumber(post.shares)}</strong> <span className="text-muted-foreground">Shares</span></span>
            <span><strong>{formatNumber(post.likes + (liked ? 1 : 0))}</strong> <span className="text-muted-foreground">Likes</span></span>
            <span><strong>{formatNumber(post.comments + userCommentCount)}</strong> <span className="text-muted-foreground">Comments</span></span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-2 border-t border-border flex items-center justify-around">
          <button
            className="flex items-center gap-2 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Comment"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded-full text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-colors"
            aria-label="Repost"
          >
            <Repeat2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 p-2 rounded-full transition-colors",
              liked ? "text-red-500" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            )}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-2 p-2 rounded-full transition-colors",
              bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className="h-5 w-5" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-full transition-colors",
                showShareMenu ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
              aria-label="Share"
            >
              <Share className="h-5 w-5" />
            </button>
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground">Share this moment</p>
                </div>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-sm">Twitter / X</span>
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-sm">Facebook</span>
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href={shareLinks.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span className="text-sm">Reddit</span>
                </a>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors w-full text-left"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        <span className="text-sm">Copy link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historical comments from data */}
        {post.interactions && post.interactions.filter(i => i.type === 'comment').length > 0 && (
          <div className="px-4 py-3 border-t border-border space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Historical reactions</h3>
            {post.interactions
              .filter(i => i.type === 'comment')
              .map((interaction) => (
                <div key={interaction.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                    {interaction.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{interaction.authorName}</span>
                    <p className="text-sm text-muted-foreground">{interaction.content}</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* User comments section */}
        <CommentThread postId={post.id} />
      </article>

      {/* More from this author */}
      {authorPosts.length > 0 && (
        <section className="border-b border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg">More from {authorName}</h2>
          </div>
          <div>
            {authorPosts.map((p) => (
              <PostCard key={p.id} post={p} author={author} />
            ))}
          </div>
          <Link
            href={`/profile/${post.authorId}`}
            className="block p-4 text-primary hover:bg-muted/50 transition-colors text-center"
          >
            View all posts from {authorName}
          </Link>
        </section>
      )}

      {/* More from this era */}
      {eraPosts.length > 0 && era && (
        <section>
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg">More from the {era.name}</h2>
          </div>
          <div>
            {eraPosts.map(({ post: p, author: pAuthor }) => (
              <PostCard key={p.id} post={p} author={pAuthor} />
            ))}
          </div>
          <Link
            href={`/era/${era.id}`}
            className="block p-4 text-primary hover:bg-muted/50 transition-colors text-center"
          >
            Explore the {era.name}
          </Link>
        </section>
      )}
    </div>
  )
}
