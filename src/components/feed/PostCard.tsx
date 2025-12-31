'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
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
  X
} from 'lucide-react'
import { Post, Profile } from '@/types'
import { cn, formatHistoricalDate, formatNumber, getAccuracyColor } from '@/lib/utils'

interface PostCardProps {
  post: Post
  author?: Profile
  isThreaded?: boolean
  showThreadLine?: boolean
}

export function PostCard({ post, author, isThreaded, showThreadLine }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const authorName = author?.displayName || 'Unknown'
  const authorHandle = author?.handle || '@unknown'
  const isVerified = author?.isVerified || false

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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setLiked(!liked)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    setBookmarked(!bookmarked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowShareMenu(!showShareMenu)
  }

  // Build share content
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tempus.app'
  const postUrl = `${siteUrl}/post/${post.id}`
  const shareText = `"${post.content.slice(0, 200)}${post.content.length > 200 ? '...' : ''}" — ${authorName}, ${post.displayDate}`
  const shareTextEncoded = encodeURIComponent(shareText)
  const postUrlEncoded = encodeURIComponent(postUrl)
  const hashtagText = encodeURIComponent('Tempus #HistoryAsItHappened')

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

  return (
    <article
      className={cn(
        "post-card relative px-4 py-4",
        !isThreaded && "border-b border-border",
        "hover:bg-muted/50 transition-colors"
      )}
    >
      {/* Thread connector line */}
      {showThreadLine && (
        <div className="thread-line" aria-hidden="true" />
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Link
          href={`/profile/${post.authorId}`}
          className="shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold overflow-hidden">
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                authorName.charAt(0)
              )}
            </div>
            {isVerified && (
              <CheckCircle2
                className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-primary fill-background"
                aria-label="Verified historical figure"
              />
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-1 text-sm">
              <Link
                href={`/profile/${post.authorId}`}
                className="font-bold hover:underline truncate"
              >
                {authorName}
              </Link>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              )}
              <span className="text-muted-foreground truncate">{authorHandle}</span>
              <span className="text-muted-foreground">&middot;</span>
              <time
                dateTime={post.timestamp}
                className="text-muted-foreground hover:underline"
                title={formatHistoricalDate(post.timestamp)}
              >
                {post.displayDate}
              </time>
            </div>
            <button
              className="shrink-0 p-1 rounded-full hover:bg-muted text-muted-foreground"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Post type indicator */}
          {post.type !== 'status' && post.type !== 'tweet' && (
            <PostTypeIndicator type={post.type} />
          )}

          {/* Title (for events/articles) */}
          {post.title && (
            <h3 className="font-bold text-lg mt-1">{post.title}</h3>
          )}

          {/* Main content */}
          <div className="mt-1">
            <p className="text-[15px] whitespace-pre-wrap break-words">
              {post.content}
            </p>

            {/* Speculative note */}
            {post.accuracy === 'speculative' && post.accuracyNote && (
              <p className="speculative-note mt-2">
                {post.accuracyNote}
              </p>
            )}
          </div>

          {/* Quote styling */}
          {post.type === 'quote' && (
            <div className="mt-2 pl-4 border-l-4 border-primary/50 italic">
              <Quote className="h-4 w-4 text-muted-foreground mb-1" />
            </div>
          )}

          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{post.location.name}</span>
              {post.location.modern && (
                <span className="text-xs">({post.location.modern})</span>
              )}
            </div>
          )}

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <MediaGallery media={post.media} />
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.hashtags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${tag}`}
                  className="text-primary text-sm hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Accuracy badge and context hint */}
          <div className="flex items-center gap-2 mt-3">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getAccuracyColor(post.accuracy)
              )}
            >
              {post.accuracy}
            </span>
            {post.historicalContext && (
              <button
                onClick={() => setShowContext(!showContext)}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  showContext
                    ? "text-amber-500"
                    : "text-muted-foreground hover:text-amber-500"
                )}
                title="What's happening in history"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Context</span>
              </button>
            )}
            {post.sources && post.sources.length > 0 && (
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <Info className="h-3 w-3" />
                {post.sources.length} source{post.sources.length > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Historical context panel */}
          {showContext && post.historicalContext && (
            <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm relative">
              <button
                onClick={() => setShowContext(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">Historical Context</p>
                  <p className="text-muted-foreground">{post.historicalContext}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sources panel */}
          {showSources && post.sources && (
            <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Sources</h4>
              <ul className="space-y-1">
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

          {/* Interactions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <InteractionButton
              icon={MessageCircle}
              count={post.comments}
              label="Comment"
            />
            <InteractionButton
              icon={Repeat2}
              count={post.shares}
              label="Share"
              activeColor="text-green-500"
            />
            <InteractionButton
              icon={Heart}
              count={post.likes + (liked ? 1 : 0)}
              label="Like"
              active={liked}
              activeColor="text-red-500"
              onClick={handleLike}
            />
            <InteractionButton
              icon={Bookmark}
              label="Bookmark"
              active={bookmarked}
              activeColor="text-primary"
              onClick={handleBookmark}
            />
            <div className="relative" ref={shareMenuRef}>
              <InteractionButton
                icon={Share}
                label="Share to social media"
                onClick={handleShare}
                active={showShareMenu}
              />
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
                    onClick={() => setShowShareMenu(false)}
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm">Twitter / X</span>
                  </a>
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="text-sm">Facebook</span>
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a
                    href={shareLinks.reddit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                    <span className="text-sm">Reddit</span>
                  </a>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        copyToClipboard()
                      }}
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

          {/* Sample comments preview */}
          {post.interactions && post.interactions.filter(i => i.type === 'comment').length > 0 && (
            <div className="mt-3 space-y-2">
              {post.interactions
                .filter(i => i.type === 'comment')
                .slice(0, 2)
                .map((interaction) => (
                  <div key={interaction.id} className="flex gap-2 text-sm">
                    <span className="font-semibold">{interaction.authorName}:</span>
                    <span className="text-muted-foreground">{interaction.content}</span>
                  </div>
                ))}
              {post.comments > 2 && (
                <Link
                  href={`/post/${post.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View all {post.comments} comments
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function PostTypeIndicator({ type }: { type: string }) {
  const icons: Record<string, React.ElementType> = {
    photo: ImageIcon,
    video: Video,
    article: FileText,
    quote: Quote,
    event: Calendar,
    relationship: Heart,
    location: MapPin,
  }

  const labels: Record<string, string> = {
    photo: 'Shared a photo',
    video: 'Shared a video',
    article: 'Published an article',
    quote: 'Shared a quote',
    event: 'Historical Event',
    relationship: 'Relationship update',
    location: 'Checked in',
    poll: 'Created a poll',
    thread: 'Thread',
  }

  const Icon = icons[type] || FileText

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
      <Icon className="h-3 w-3" />
      <span>{labels[type] || type}</span>
    </div>
  )
}

function MediaGallery({ media }: { media: Post['media'] }) {
  if (!media || media.length === 0) return null

  const gridClass = media.length === 1
    ? ''
    : media.length === 2
      ? 'grid grid-cols-2 gap-0.5'
      : media.length === 3
        ? 'grid grid-cols-2 gap-0.5'
        : 'grid grid-cols-2 gap-0.5'

  return (
    <div className={cn("mt-3 rounded-xl overflow-hidden", gridClass)}>
      {media.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative bg-muted aspect-video",
            media.length === 3 && index === 0 && "row-span-2 aspect-square"
          )}
        >
          {item.type === 'image' || item.type === 'painting' ? (
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-full object-cover"
            />
          ) : item.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="h-12 w-12 text-muted-foreground" />
              <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                Historical reenactment
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {item.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs">{item.caption}</p>
            </div>
          )}
          {item.source && (
            <div className="absolute top-2 right-2">
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-black/50 text-white px-2 py-0.5 rounded hover:bg-black/70"
                title={item.sourceLabel || 'View source'}
              >
                Source
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface InteractionButtonProps {
  icon: React.ElementType
  count?: number
  label: string
  active?: boolean
  activeColor?: string
  onClick?: (e: React.MouseEvent) => void
}

function InteractionButton({
  icon: Icon,
  count,
  label,
  active,
  activeColor = 'text-primary',
  onClick
}: InteractionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 p-2 rounded-full transition-colors group",
        active ? activeColor : "text-muted-foreground hover:text-primary"
      )}
      aria-label={label}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-colors",
          active && activeColor,
          !active && "group-hover:text-primary"
        )}
        fill={active ? 'currentColor' : 'none'}
      />
      {count !== undefined && count > 0 && (
        <span className="text-xs">{formatNumber(count)}</span>
      )}
    </button>
  )
}
