import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import { getProfile, getPostsByAuthor, getProfiles } from '@/lib/data'
import { SimpleFeed } from '@/components/feed/Feed'
import { cn, formatHistoricalDate, formatNumber } from '@/lib/utils'
import { Profile } from '@/types'

interface ProfilePageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const profiles = getProfiles()
  return profiles.map((profile) => ({
    id: profile.id,
  }))
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = getProfile(params.id)

  if (!profile) {
    notFound()
  }

  const posts = getPostsByAuthor(profile.id)
  const profiles: Record<string, Profile> = { [profile.id]: profile }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-muted"
            aria-label="Back to feed"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-xl flex items-center gap-1">
              {profile.displayName}
              {profile.isVerified && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {posts.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/20 to-primary/40">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-border">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center text-4xl font-bold overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.displayName.charAt(0)
            )}
          </div>
          {profile.isVerified && (
            <div className="absolute bottom-2 right-0 bg-primary text-primary-foreground p-1 rounded-full">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Name and Handle */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-1">
              {profile.name}
              {profile.isVerified && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </h2>
            <p className="text-muted-foreground">{profile.handle}</p>
            {profile.title && (
              <p className="text-sm text-muted-foreground mt-1">{profile.title}</p>
            )}
          </div>
          <button className="px-6 py-2 bg-foreground text-background rounded-full font-semibold hover:opacity-90 transition-opacity">
            Follow
          </button>
        </div>

        {/* Bio */}
        <p className="mt-4 whitespace-pre-wrap">{profile.bio}</p>
        {profile.bioLong && (
          <p className="mt-2 text-sm text-muted-foreground">{profile.bioLong}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
          {profile.birthPlace && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{profile.birthPlace}</span>
            </div>
          )}
          {profile.birthDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Born {formatHistoricalDate(profile.birthDate)}</span>
            </div>
          )}
          {profile.deathDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Died {formatHistoricalDate(profile.deathDate)}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <span>
            <strong>{formatNumber(profile.following || 0)}</strong>
            <span className="text-muted-foreground ml-1">Following</span>
          </span>
          <span>
            <strong>{formatNumber(profile.followers || 0)}</strong>
            <span className="text-muted-foreground ml-1">Followers</span>
          </span>
        </div>

        {/* Era Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.era.map((era) => (
            <Link
              key={era}
              href={`/era/${era}`}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80"
            >
              {era.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button className="flex-1 py-4 text-center font-medium border-b-2 border-primary text-primary">
          Posts
        </button>
        <button className="flex-1 py-4 text-center text-muted-foreground hover:bg-muted">
          Replies
        </button>
        <button className="flex-1 py-4 text-center text-muted-foreground hover:bg-muted">
          Media
        </button>
        <button className="flex-1 py-4 text-center text-muted-foreground hover:bg-muted">
          Likes
        </button>
      </div>

      {/* Posts Feed */}
      {posts.length > 0 ? (
        <SimpleFeed posts={posts} profiles={profiles} />
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No posts yet.</p>
        </div>
      )}
    </div>
  )
}
