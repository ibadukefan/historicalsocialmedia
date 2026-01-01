import Link from 'next/link'
import { Users, CheckCircle2, Filter } from 'lucide-react'
import { getProfiles, getPostsByAuthor } from '@/lib/data'
import { cn, formatNumber } from '@/lib/utils'
import { FollowButton } from '@/components/FollowButton'

export const metadata = {
  title: 'Historical Figures | Tempus',
  description: 'Explore profiles of historical figures throughout history.',
}

export default function ProfilesPage() {
  const profiles = getProfiles()

  // Sort profiles: verified first, then by followers
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1
    if (!a.isVerified && b.isVerified) return 1
    return (b.followers || 0) - (a.followers || 0)
  })

  const verifiedProfiles = sortedProfiles.filter(p => p.isVerified)
  const ordinaryPeople = sortedProfiles.filter(p => !p.isVerified)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Users className="h-5 w-5" />
          Historical Figures
        </h1>
        <p className="text-sm text-muted-foreground">
          {profiles.length} profiles from the American Revolution era
        </p>
      </div>

      {/* Notable Figures */}
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Notable Figures
        </h2>
        <div className="grid gap-3">
          {verifiedProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} featured />
          ))}
        </div>
      </div>

      {/* Ordinary People */}
      <div className="p-4 border-t border-border">
        <h2 className="font-semibold text-lg mb-2">Ordinary People</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Fictional but historically accurate representations of everyday life
        </p>
        <div className="grid gap-3">
          {ordinaryPeople.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 border-t border-border">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">About Our Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Verified profiles (with blue checkmarks) represent real historical figures with
            documented information. "Ordinary people" profiles are fictional composites
            based on historical records of daily life, occupations, and social conditions
            of the era. These are clearly marked as speculative.
          </p>
        </div>
      </div>
    </div>
  )
}

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    displayName: string
    handle: string
    bio: string
    title?: string
    avatar?: string
    isVerified: boolean
    followers?: number
    accuracy: string
  }
  featured?: boolean
}

function ProfileCard({ profile, featured }: ProfileCardProps) {
  const postCount = getPostsByAuthor(profile.id).length

  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border transition-all hover:border-primary hover:bg-muted/50",
        featured && "bg-gradient-to-r from-primary/5 to-transparent"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/profile/${profile.id}`} className="relative shrink-0">
          <div className={cn(
            "rounded-full bg-muted flex items-center justify-center font-semibold",
            featured ? "w-14 h-14 text-xl" : "w-12 h-12 text-lg"
          )}>
            {profile.displayName.charAt(0)}
          </div>
          {profile.isVerified && (
            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-5 w-5 text-primary fill-background" />
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/profile/${profile.id}`} className="min-w-0">
              <div className="flex items-center gap-1">
                <span className={cn("font-bold truncate hover:underline", featured && "text-lg")}>
                  {profile.displayName}
                </span>
                {profile.isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{profile.handle}</p>
              {profile.title && (
                <p className="text-sm text-muted-foreground mt-0.5">{profile.title}</p>
              )}
            </Link>
            <FollowButton profileId={profile.id} size="sm" />
          </div>
          <Link href={`/profile/${profile.id}`}>
            <p className={cn(
              "mt-2 text-sm",
              featured ? "line-clamp-2" : "line-clamp-1"
            )}>
              {profile.bio}
            </p>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{formatNumber(profile.followers || 0)} followers</span>
            <span>{postCount} posts</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              profile.accuracy === 'verified'
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            )}>
              {profile.accuracy}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
