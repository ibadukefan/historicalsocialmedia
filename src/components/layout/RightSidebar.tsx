'use client'

import Link from 'next/link'
import { TrendingUp, UserPlus, ExternalLink, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

// Sample data - in production, this comes from the data layer
const trendingTopics: TrendingTopic[] = [
  { id: '1', tag: 'DeclarationOfIndependence', posts: 1247, era: 'American Revolution' },
  { id: '2', tag: 'LibertyOrDeath', posts: 892, era: 'American Revolution' },
  { id: '3', tag: 'BostonTeaParty', posts: 756, era: 'American Revolution' },
  { id: '4', tag: 'ContinentalCongress', posts: 634, era: 'American Revolution' },
  { id: '5', tag: 'BritishTyranny', posts: 521, era: 'American Revolution' },
]

const suggestedProfiles: SuggestedProfile[] = [
  {
    id: 'george-washington',
    name: 'George Washington',
    handle: '@GeneralWashington',
    title: 'Commander, Continental Army',
    avatar: '/avatars/washington.jpg',
    isVerified: true
  },
  {
    id: 'benjamin-franklin',
    name: 'Benjamin Franklin',
    handle: '@BenFranklin',
    title: 'Diplomat, Inventor, Statesman',
    avatar: '/avatars/franklin.jpg',
    isVerified: true
  },
  {
    id: 'thomas-jefferson',
    name: 'Thomas Jefferson',
    handle: '@TJefferson',
    title: 'Author, Declaration of Independence',
    avatar: '/avatars/jefferson.jpg',
    isVerified: true
  },
]

function TrendingCard() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending in 1776
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
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Who to Follow
        </h2>
      </div>
      <div className="divide-y divide-border">
        {suggestedProfiles.map((profile) => (
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
              <button className="shrink-0 px-4 py-1.5 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/profiles"
        className="block p-4 text-primary hover:bg-muted transition-colors text-sm font-medium"
      >
        Show more
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
