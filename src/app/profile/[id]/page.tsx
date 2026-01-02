import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import { getProfile, getPostsByAuthor, getProfiles, getPosts, getConnectedProfiles } from '@/lib/data'
import { cn, formatHistoricalDate, formatNumber } from '@/lib/utils'
import { Profile } from '@/types'
import { FollowButton } from '@/components/FollowButton'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { RelationshipNetwork } from '@/components/profile/RelationshipNetwork'

interface ProfilePageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const profiles = getProfiles()
  return profiles.map((profile) => ({
    id: profile.id,
  }))
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = getProfile(params.id)

  if (!profile) {
    return {
      title: 'Profile Not Found | Tempus',
    }
  }

  const eraId = profile.era[0] || 'american-revolution'

  return {
    title: `${profile.displayName} | Tempus`,
    description: profile.bio,
    openGraph: {
      title: profile.displayName,
      description: profile.bio,
      type: 'profile',
      images: [
        {
          url: `/og/era-${eraId}.png`,
          width: 1200,
          height: 630,
          alt: profile.displayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.displayName,
      description: profile.bio,
      images: [`/og/era-${eraId}.png`],
    },
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = getProfile(params.id)

  if (!profile) {
    notFound()
  }

  const posts = getPostsByAuthor(profile.id)
  const allPosts = getPosts()
  const allProfiles = getProfiles()
  const connections = getConnectedProfiles(profile.id)

  // Build a profiles map for all posts (needed for Likes tab)
  const profilesMap: Record<string, Profile> = {}
  allProfiles.forEach(p => {
    profilesMap[p.id] = p
  })

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
            loading="lazy"
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
                loading="eager"
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
          <FollowButton profileId={profile.id} size="lg" />
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

      {/* Relationship Network */}
      {connections.length > 0 && (
        <RelationshipNetwork
          profileId={profile.id}
          profileName={profile.displayName}
          connections={connections}
        />
      )}

      {/* Tabs with Content */}
      <ProfileTabs
        profile={profile}
        posts={posts}
        allPosts={allPosts}
        profiles={profilesMap}
      />
    </div>
  )
}
