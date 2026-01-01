import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, FileText, MapPin } from 'lucide-react'
import { getEra, getEras, getPosts, getProfilesByEra, getProfiles } from '@/lib/data'
import { SimpleFeed } from '@/components/feed/Feed'
import { Profile } from '@/types'

interface EraPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const eras = getEras()
  return eras.map((era) => ({
    id: era.id,
  }))
}

export async function generateMetadata({ params }: EraPageProps): Promise<Metadata> {
  const era = getEra(params.id)
  if (!era) return { title: 'Era Not Found | Tempus' }

  const posts = getPosts({ era: params.id })

  return {
    title: `${era.name} | Tempus`,
    description: era.description,
    openGraph: {
      title: era.name,
      description: era.description,
      type: 'website',
      images: [
        {
          url: `/og/era-${params.id}.png`,
          width: 1200,
          height: 630,
          alt: era.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${era.name} | ${posts.length} posts`,
      description: era.description,
      images: [`/og/era-${params.id}.png`],
    },
  }
}

export default function EraPage({ params }: EraPageProps) {
  const era = getEra(params.id)

  if (!era) {
    notFound()
  }

  const posts = getPosts({ era: params.id })
  const eraProfiles = getProfilesByEra(params.id)
  const allProfiles = getProfiles()

  // Create profiles lookup
  const profiles: Record<string, Profile> = {}
  allProfiles.forEach(p => { profiles[p.id] = p })

  const startYear = era.startDate.split('-')[0]
  const endYear = era.endDate.split('-')[0]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="p-2 -ml-2 rounded-full hover:bg-muted"
            aria-label="Back to explore"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-xl">{era.name}</h1>
            <p className="text-sm text-muted-foreground">
              {startYear} - {endYear}
            </p>
          </div>
        </div>
      </div>

      {/* Era Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-900/20 to-red-900/20 border-b border-border">
        <p className="text-sm mb-4">{era.description}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{startYear} - {endYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{posts.length} posts</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{eraProfiles.length} profiles</span>
          </div>
        </div>
      </div>

      {/* Key Figures */}
      {eraProfiles.length > 0 && (
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold mb-3">Key Figures</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {eraProfiles.slice(0, 8).map((profile) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.id}`}
                className="flex flex-col items-center shrink-0 group"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-semibold group-hover:ring-2 ring-primary transition-all">
                  {profile.displayName.charAt(0)}
                </div>
                <span className="text-xs mt-1 text-center max-w-[60px] truncate">
                  {profile.displayName.split(' ')[0]}
                </span>
              </Link>
            ))}
            {eraProfiles.length > 8 && (
              <Link
                href="/profiles"
                className="flex flex-col items-center justify-center shrink-0"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  +{eraProfiles.length - 8}
                </div>
                <span className="text-xs mt-1">More</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Posts Feed */}
      {posts.length > 0 ? (
        <SimpleFeed posts={posts} profiles={profiles} />
      ) : (
        <div className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-lg">Coming Soon</h3>
          <p className="text-muted-foreground mt-1">
            Content for this era is being prepared.
          </p>
        </div>
      )}
    </div>
  )
}
