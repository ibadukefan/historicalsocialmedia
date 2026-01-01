'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Share, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react'
import { Post, Profile } from '@/types'
import { ThreadView } from '@/components/thread/ThreadView'

interface ThreadPageContentProps {
  posts: Post[]
  profiles: Record<string, Profile>
  threadId: string
}

export function ThreadPageContent({ posts, profiles, threadId }: ThreadPageContentProps) {
  const searchParams = useSearchParams()
  const highlightPostId = searchParams.get('highlight') || undefined
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // Sort posts to get first one for author info
  const sortedPosts = [...posts].sort((a, b) => (a.threadPosition || 0) - (b.threadPosition || 0))
  const firstPost = sortedPosts[0]
  const author = profiles[firstPost?.authorId]

  // Scroll to highlighted post
  useEffect(() => {
    if (highlightPostId) {
      const element = document.querySelector(`[data-post-id="${highlightPostId}"]`)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [highlightPostId])

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

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tempus.app'
  const threadUrl = `${siteUrl}/thread/${threadId}`
  const shareText = `Thread by ${author?.displayName || 'Unknown'}: "${firstPost?.content.slice(0, 100)}..."`
  const shareTextEncoded = encodeURIComponent(shareText)
  const threadUrlEncoded = encodeURIComponent(threadUrl)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${threadUrlEncoded}&hashtags=Tempus,HistoryAsItHappened`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${threadUrlEncoded}&quote=${shareTextEncoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${threadUrlEncoded}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${threadUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Back to feed"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Thread
              </h1>
              <p className="text-sm text-muted-foreground">
                {posts.length} posts by {author?.displayName || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Share button */}
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Share thread"
            >
              <Share className="h-5 w-5" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground">Share this thread</p>
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
      </div>

      {/* Thread content */}
      <ThreadView
        posts={posts}
        profiles={profiles}
        highlightPostId={highlightPostId}
      />

      {/* Thread info */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{posts.length} posts in thread</span>
          <span>•</span>
          <span>Started {firstPost?.displayDate}</span>
        </div>
      </div>
    </div>
  )
}
