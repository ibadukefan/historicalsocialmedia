import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Users, FileText, ArrowRight, Clock } from 'lucide-react'
import { getEras, getProfiles, getPosts } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Explore Eras | Tempus',
  description: 'Explore different historical eras and time periods on Tempus.',
  openGraph: {
    title: 'Explore Historical Eras',
    description: 'Journey through 10 eras spanning thousands of years of history.',
    images: [
      {
        url: '/og/explore.png',
        width: 1200,
        height: 630,
        alt: 'Explore Historical Eras',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Historical Eras | Tempus',
    description: 'Journey through 10 eras spanning thousands of years of history.',
    images: ['/og/explore.png'],
  },
}

export default function ExplorePage() {
  const eras = getEras()
  const profiles = getProfiles()
  const posts = getPosts()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Journey through different eras of history
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-border bg-muted/30">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{eras.length}</p>
          <p className="text-xs text-muted-foreground">Eras</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{profiles.length}</p>
          <p className="text-xs text-muted-foreground">Profiles</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{posts.length}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
      </div>

      {/* Featured Era */}
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Featured Era
        </h2>

        {eras.filter(e => e.id === 'american-revolution').map((era) => (
          <Link
            key={era.id}
            href={`/era/${era.id}`}
            className="block mb-4"
          >
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-900 to-red-900 p-6 text-white hover:opacity-95 transition-opacity">
              <div className="relative z-10">
                <p className="text-sm opacity-80 mb-1">
                  {era.startDate.split('-')[0]} - {era.endDate.split('-')[0]}
                </p>
                <h3 className="text-2xl font-bold mb-2">{era.name}</h3>
                <p className="text-sm opacity-90 mb-4 line-clamp-2">
                  {era.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {era.postCount || 52} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {era.profileCount || 15} profiles
                  </span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                  Explore Era <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              {/* Decorative stars pattern */}
              <div className="absolute top-4 right-4 opacity-20">
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(13)].map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* All Eras */}
      <div className="p-4 border-t border-border">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          All Eras
        </h2>

        <div className="space-y-3">
          {eras.map((era) => (
            <EraCard key={era.id} era={era} />
          ))}
        </div>
      </div>

      {/* Era Timeline */}
      <div className="p-4 border-t border-border">
        <h2 className="font-semibold text-lg mb-4 text-muted-foreground">
          Spanning Human History
        </h2>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            From the philosophers of Ancient Greece to the trenches of World War I,
            explore {posts.length} posts from {profiles.length} historical figures and ordinary people across {eras.length} eras.
          </p>
          <div className="flex flex-wrap gap-2">
            {eras.map((era) => (
              <span
                key={era.id}
                className="text-xs px-2 py-1 rounded-full bg-background border border-border"
              >
                {era.shortName || era.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface EraCardProps {
  era: {
    id: string
    name: string
    shortName?: string
    description: string
    startDate: string
    endDate: string
    postCount?: number
    profileCount?: number
  }
}

function EraCard({ era }: EraCardProps) {
  const isAvailable = (era.postCount || 0) > 0

  return (
    <Link
      href={isAvailable ? `/era/${era.id}` : '#'}
      className={cn(
        "block p-4 rounded-xl border transition-all",
        isAvailable
          ? "border-border hover:border-primary hover:bg-muted/50"
          : "border-dashed border-border/50 opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{era.name}</h3>
            {!isAvailable && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {era.startDate.split('-')[0]} - {era.endDate.split('-')[0]}
          </p>
        </div>
        {isAvailable && (
          <div className="text-right text-sm text-muted-foreground">
            <p>{era.postCount || 0} posts</p>
            <p>{era.profileCount || 0} profiles</p>
          </div>
        )}
      </div>
      {isAvailable && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {era.description}
        </p>
      )}
    </Link>
  )
}
