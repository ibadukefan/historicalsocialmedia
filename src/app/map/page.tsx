import { MapPin, Globe, Users } from 'lucide-react'
import Link from 'next/link'
import { getPosts, getProfiles } from '@/lib/data'

export const metadata = {
  title: 'World Map | Tempus',
  description: 'Explore historical posts by location on an interactive world map.',
}

// Define regions with their posts - covering all eras
const regions = [
  { id: 'north-america', name: 'North America', color: 'bg-blue-500', locations: ['Boston', 'Philadelphia', 'Virginia', 'New York', 'Massachusetts', 'New Jersey', 'Trenton', 'Princeton', 'Staten Island', 'Brooklyn', 'Cambridge', 'Montgomery', 'Memphis', 'Selma', 'Washington', 'Atlanta', 'Birmingham', 'Greensboro', 'Little Rock', 'Vinland', 'Newfoundland', 'Georgia', 'New Haven', 'Connecticut'] },
  { id: 'britain', name: 'Britain & Ireland', color: 'bg-red-500', locations: ['London', 'England', 'Liverpool', 'Manchester', 'Birmingham', 'Lindisfarne', 'Northumbria', 'Wessex', 'York', 'Somerset', 'Winchester', 'Yorkshire', 'Hastings', 'Stamford Bridge', 'Durham', 'Cornwall', 'Bristol', 'Wiltshire', 'Lancashire', 'Wales', 'Scotland', 'Glasgow', 'Ireland', 'Cork'] },
  { id: 'france', name: 'France & Normandy', color: 'bg-indigo-500', locations: ['Paris', 'Versailles', 'France', 'Bastille', 'Varennes', 'Normandy', 'Rouen', 'Corsica', 'Toulon', 'Lyon'] },
  { id: 'germany', name: 'Germany & Central Europe', color: 'bg-gray-500', locations: ['Berlin', 'Munich', 'Germany', 'Wittenberg', 'Mainz', 'Prussia', 'Austria', 'Vienna', 'Nuremberg', 'Stalingrad', 'Auschwitz', 'Poland', 'Sarajevo', 'Bosnia'] },
  { id: 'italy', name: 'Italy & Mediterranean', color: 'bg-amber-600', locations: ['Rome', 'Florence', 'Venice', 'Milan', 'Italy', 'Naples', 'Sicily', 'Vatican', 'Pompeii', 'Capua', 'Rubicon', 'Ravenna'] },
  { id: 'greece', name: 'Greece & Aegean', color: 'bg-sky-500', locations: ['Athens', 'Sparta', 'Greece', 'Thermopylae', 'Salamis', 'Marathon', 'Delphi', 'Thebes', 'Macedonia', 'Pella', 'Corinth', 'Syracuse'] },
  { id: 'russia', name: 'Russia & Eastern Europe', color: 'bg-cyan-500', locations: ['St. Petersburg', 'Tula', 'Russia', 'Winter Palace', 'Moscow', 'Stalingrad', 'Leningrad', 'Kursk', 'Soviet'] },
  { id: 'scandinavia', name: 'Scandinavia', color: 'bg-teal-500', locations: ['Norway', 'Denmark', 'Sweden', 'Iceland', 'Greenland', 'Uppsala', 'Trondheim', 'Jutland', 'Hedeby', 'Vestfold', 'Hafrsfjord', 'Baltic'] },
  { id: 'ottoman', name: 'Middle East', color: 'bg-emerald-500', locations: ['Constantinople', 'Istanbul', 'Topkapi', 'Ottoman', 'Persia', 'Jerusalem', 'Babylon', 'Egypt', 'Alexandria', 'Gallipoli'] },
  { id: 'china', name: 'China', color: 'bg-yellow-500', locations: ['Beijing', 'Canton', 'Suzhou', 'Forbidden City', 'Qing', 'China', 'Nanking'] },
  { id: 'japan', name: 'Japan & Pacific', color: 'bg-pink-500', locations: ['Edo', 'Kyoto', 'Japan', 'Nihonbashi', 'Tokyo', 'Hiroshima', 'Nagasaki', 'Pearl Harbor', 'Iwo Jima', 'Midway', 'Okinawa', 'Pacific'] },
  { id: 'india', name: 'India', color: 'bg-orange-500', locations: ['Madras', 'Calcutta', 'Mysore', 'Seringapatam', 'India', 'Delhi', 'Bombay'] },
  { id: 'africa', name: 'Africa', color: 'bg-green-500', locations: ['Kumasi', 'Abomey', 'Ashanti', 'Dahomey', 'Africa', 'Egypt', 'Alexandria', 'Carthage', 'Morocco', 'El Alamein'] },
  { id: 'latin-america', name: 'Latin America', color: 'bg-lime-500', locations: ['Madrid', 'Mexico City', 'Peru', 'Tungasuca', 'New Spain', 'Spain', 'Cuba', 'Argentina', 'Brazil'] },
]

export default function MapPage() {
  const posts = getPosts()
  const profiles = getProfiles()

  // Count posts per region
  const regionStats = regions.map(region => {
    const regionPosts = posts.filter(post => {
      const locationName = post.location?.name || ''
      const locationModern = post.location?.modern || ''
      return region.locations.some(loc =>
        locationName.toLowerCase().includes(loc.toLowerCase()) ||
        locationModern.toLowerCase().includes(loc.toLowerCase())
      )
    })
    return {
      ...region,
      postCount: regionPosts.length,
      posts: regionPosts.slice(0, 3)
    }
  }).sort((a, b) => b.postCount - a.postCount)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          World Map
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore posts from around the world across all eras
        </p>
      </div>

      {/* World Overview */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Global Activity</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {regionStats.slice(0, 5).map(region => (
            <div key={region.id} className="text-center p-3 rounded-lg bg-background border border-border">
              <div className={`w-3 h-3 rounded-full ${region.color} mx-auto mb-2`} />
              <p className="font-semibold text-lg">{region.postCount}</p>
              <p className="text-xs text-muted-foreground">{region.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ASCII Map */}
      <div className="p-4 border-b border-border">
        <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-muted-foreground">
{`              ★ WORLD MAP - ALL ERAS ★

    SCANDINAVIA ●────● RUSSIA
         \\      │     /
    BRITAIN●────●GERMANY●───● CHINA
         \\     │     /        \\
    NORTH  ●FRANCE●GREECE      ●JAPAN
    AMERICA│    │  \\ITALY      │
       ●   │    │   \\  ●       │
       │   │    ●────●MIDDLE   │
       │   │         EAST      │
       │   ● LATIN    \\       /
       │   AMERICA     ●INDIA /
       │      │        /     /
       │      │       /     /
       └──────┼──────●─────●
              │    AFRICA

    ● = Historical activity across all eras`}
          </pre>
        </div>
      </div>

      {/* Regions List */}
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Posts by Region
        </h2>

        <div className="space-y-4">
          {regionStats.map(region => (
            <div key={region.id} className="border border-border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${region.color}`} />
                  <div>
                    <h3 className="font-semibold">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">{region.postCount} posts</p>
                  </div>
                </div>
              </div>

              {region.posts.length > 0 && (
                <div className="p-4 space-y-2">
                  {region.posts.map(post => (
                    <div key={post.id} className="text-sm p-2 rounded bg-muted/50">
                      <p className="line-clamp-1">{post.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.location?.name || 'Unknown location'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-border">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">About the Map</h3>
          <p className="text-sm text-muted-foreground">
            From the agora of Athens to the trenches of the Western Front, from Viking longships to Civil Rights marches -
            this map shows where history happened. Each region holds voices from different eras:
            philosophers, emperors, revolutionaries, soldiers, inventors, and ordinary people living their lives.
          </p>
        </div>
      </div>
    </div>
  )
}
