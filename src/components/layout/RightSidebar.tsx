'use client'

import Link from 'next/link'
import { TrendingUp, UserPlus, ExternalLink, CheckCircle2, Calendar, Clock, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useMemo } from 'react'
import { useFollows } from '@/components/FollowsProvider'
import { getPosts, getProfiles, getEras } from '@/lib/data'

interface TrendingTopic {
  id: string
  tag: string
  posts: number
  era: string
}

interface SuggestedProfile {
  id: string
  name: string
  handle: string
  title: string
  avatar: string
  isVerified: boolean
}

function TrendingCard() {
  // Calculate real trending hashtags
  const trendingTopics = useMemo(() => {
    const allPosts = getPosts()
    const allEras = getEras()
    const tagStats: Record<string, { count: number; engagement: number; era: string }> = {}

    allPosts.forEach(post => {
      post.hashtags?.forEach(tag => {
        if (!tagStats[tag]) {
          tagStats[tag] = { count: 0, engagement: 0, era: post.era }
        }
        tagStats[tag].count++
        tagStats[tag].engagement += (post.likes || 0) + (post.comments || 0) * 2
      })
    })

    return Object.entries(tagStats)
      .map(([tag, stats]) => ({
        id: tag,
        tag,
        posts: stats.count,
        era: allEras.find(e => e.id === stats.era)?.shortName || stats.era.replace(/-/g, ' ')
      }))
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 5)
  }, [])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Now
        </h2>
      </div>
      <div className="divide-y divide-border">
        {trendingTopics.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/search?q=${topic.tag}`}
            className="block px-4 py-3 hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{topic.era}</p>
                <p className="font-semibold">#{topic.tag}</p>
                <p className="text-sm text-muted-foreground">
                  {topic.posts.toLocaleString()} posts
                </p>
              </div>
              <span className="text-2xl font-light text-muted-foreground/50">
                {index + 1}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/trending"
        className="block p-4 text-primary hover:bg-muted transition-colors text-sm font-medium"
      >
        Show more
      </Link>
    </div>
  )
}

function SuggestedProfilesCard() {
  const { isFollowing, toggleFollow } = useFollows()

  // Get top profiles based on engagement
  const suggestedProfiles = useMemo(() => {
    const allPosts = getPosts()
    const allProfiles = getProfiles()

    return allProfiles
      .filter(p => p.isVerified)
      .map(profile => {
        const profilePosts = allPosts.filter(p => p.authorId === profile.id)
        const totalLikes = profilePosts.reduce((sum, p) => sum + (p.likes || 0), 0)
        return {
          id: profile.id,
          name: profile.displayName,
          handle: profile.handle,
          title: profile.title || '',
          avatar: profile.avatar,
          isVerified: profile.isVerified,
          engagement: totalLikes
        }
      })
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
  }, [])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Who to Follow
        </h2>
      </div>
      <div className="divide-y divide-border">
        {suggestedProfiles.map((profile) => {
          const following = isFollowing(profile.id)
          return (
            <div key={profile.id} className="p-4 hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                    {profile.name.charAt(0)}
                  </div>
                  {profile.isVerified && (
                    <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-primary fill-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${profile.id}`}
                    className="font-semibold hover:underline truncate block"
                  >
                    {profile.name}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.handle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {profile.title}
                  </p>
                </div>
                <button
                  onClick={() => toggleFollow(profile.id)}
                  aria-label={following ? `Unfollow ${profile.name}` : `Follow ${profile.name}`}
                  aria-pressed={following}
                  className={cn(
                    "shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1",
                    following
                      ? "bg-muted text-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      : "bg-foreground text-background hover:opacity-90"
                  )}
                >
                  {following ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Following
                    </>
                  ) : (
                    'Follow'
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <Link
        href="/following"
        className="block p-4 text-primary hover:bg-muted transition-colors text-sm font-medium"
      >
        See who you follow
      </Link>
    </div>
  )
}

// Historical events mapped by month-day
const historicalEvents: Record<string, { year: number; event: string; detail: string }[]> = {
  '01-01': [{ year: 1776, event: 'Continental Army flag raised', detail: 'Washington raises the Grand Union Flag at Cambridge' }],
  '01-10': [{ year: 1776, event: 'Common Sense published', detail: 'Thomas Paine\'s pamphlet begins changing minds' }],
  '03-17': [{ year: 1776, event: 'British evacuate Boston', detail: 'After 11-month siege, British troops leave' }],
  '04-19': [{ year: 1775, event: 'Battles of Lexington & Concord', detail: '"The shot heard round the world"' }],
  '05-10': [{ year: 1776, event: 'Congress recommends new governments', detail: 'Colonies urged to form independent governments' }],
  '06-07': [{ year: 1776, event: 'Resolution for independence introduced', detail: 'Richard Henry Lee proposes independence' }],
  '06-11': [{ year: 1776, event: 'Committee of Five formed', detail: 'Jefferson, Adams, Franklin, Sherman, Livingston' }],
  '06-17': [{ year: 1775, event: 'Battle of Bunker Hill', detail: '"Don\'t fire until you see the whites of their eyes"' }],
  '07-02': [{ year: 1776, event: 'Independence voted', detail: 'Continental Congress votes for independence' }],
  '07-04': [{ year: 1776, event: 'Declaration adopted', detail: 'Declaration of Independence formally adopted' }],
  '07-08': [{ year: 1776, event: 'Declaration read publicly', detail: 'First public reading in Philadelphia' }],
  '07-09': [{ year: 1776, event: 'Washington reads Declaration', detail: 'General reads to troops in New York' }],
  '08-27': [{ year: 1776, event: 'Battle of Long Island', detail: 'Largest battle of the war, British victory' }],
  '09-15': [{ year: 1776, event: 'British take New York City', detail: 'Washington retreats to Harlem Heights' }],
  '09-22': [{ year: 1776, event: 'Nathan Hale executed', detail: '"I only regret that I have but one life to lose"' }],
  '10-28': [{ year: 1776, event: 'Battle of White Plains', detail: 'British force Washington to retreat' }],
  '11-16': [{ year: 1776, event: 'Fort Washington falls', detail: 'Nearly 3,000 Americans captured' }],
  '12-25': [{ year: 1776, event: 'Washington crosses Delaware', detail: 'Surprise attack planned for Trenton' }],
  '12-26': [{ year: 1776, event: 'Battle of Trenton', detail: 'Washington captures 900 Hessians' }],
  '12-31': [{ year: 1776, event: 'Enlistments expire', detail: 'Washington convinces troops to stay' }],
}

function OnThisDayCard() {
  const [mounted, setMounted] = useState(false)
  const [dateKey, setDateKey] = useState('')

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    setDateKey(`${month}-${day}`)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            On This Day
          </h2>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const events = historicalEvents[dateKey]
  const now = new Date()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const displayDate = `${monthNames[now.getMonth()]} ${now.getDate()}`

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          On This Day
        </h2>
        <p className="text-sm text-muted-foreground">{displayDate} in history</p>
      </div>
      <div className="p-4">
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event, i) => (
              <div key={i} className="border-l-2 border-primary pl-3">
                <p className="text-xs text-muted-foreground">{event.year}</p>
                <p className="font-semibold">{event.event}</p>
                <p className="text-sm text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No major events recorded for {displayDate}, 1776
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              But people were still posting...
            </p>
          </div>
        )}
      </div>
      <Link
        href="/on-this-day"
        className="block p-4 text-primary hover:bg-muted transition-colors text-sm font-medium border-t border-border"
      >
        Explore more dates
      </Link>
    </div>
  )
}

function SourcesCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-bold mb-3">About Our Sources</h3>
      <p className="text-sm text-muted-foreground mb-3">
        All content is sourced from historical records, primary documents, and verified secondary sources.
      </p>
      <div className="space-y-2">
        <a
          href="https://www.loc.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Library of Congress
        </a>
        <a
          href="https://www.archives.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          National Archives
        </a>
        <a
          href="https://commons.wikimedia.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Wikimedia Commons
        </a>
      </div>
    </div>
  )
}

export function RightSidebar() {
  return (
    <div className="space-y-4">
      <OnThisDayCard />
      <TrendingCard />
      <SuggestedProfilesCard />
      <SourcesCard />

      {/* Footer Links */}
      <div className="px-4 text-xs text-muted-foreground space-x-2">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span>&middot;</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>&middot;</span>
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    </div>
  )
}
