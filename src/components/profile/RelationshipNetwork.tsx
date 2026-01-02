'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Heart,
  Swords,
  UserCheck,
  GraduationCap,
  Crown,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Network,
  List
} from 'lucide-react'
import { Profile, Relationship } from '@/types'
import { cn } from '@/lib/utils'

interface ConnectionData {
  profile: Profile
  relationship: Relationship
  direction: 'outgoing' | 'incoming'
}

interface RelationshipNetworkProps {
  profileId: string
  profileName: string
  connections: ConnectionData[]
}

// Relationship type configuration
const relationshipConfig: Record<Relationship['type'], { icon: React.ElementType; color: string; label: string }> = {
  spouse: { icon: Heart, color: 'text-red-500', label: 'Spouse' },
  family: { icon: Users, color: 'text-purple-500', label: 'Family' },
  friend: { icon: UserCheck, color: 'text-green-500', label: 'Friend' },
  ally: { icon: UserPlus, color: 'text-blue-500', label: 'Ally' },
  colleague: { icon: Users, color: 'text-cyan-500', label: 'Colleague' },
  mentor: { icon: GraduationCap, color: 'text-amber-500', label: 'Mentor' },
  student: { icon: GraduationCap, color: 'text-amber-400', label: 'Student' },
  rival: { icon: Swords, color: 'text-orange-500', label: 'Rival' },
  enemy: { icon: Swords, color: 'text-red-600', label: 'Enemy' },
}

export function RelationshipNetwork({ profileId, profileName, connections }: RelationshipNetworkProps) {
  const [view, setView] = useState<'list' | 'network'>('list')
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['spouse', 'family', 'friend']))
  const [showAll, setShowAll] = useState(false)

  // Group connections by relationship type
  const groupedConnections = useMemo(() => {
    const groups: Record<string, ConnectionData[]> = {}

    connections.forEach(conn => {
      const type = conn.relationship.type
      if (!groups[type]) {
        groups[type] = []
      }
      // Avoid duplicates (same profile appearing multiple times)
      if (!groups[type].find(c => c.profile.id === conn.profile.id)) {
        groups[type].push(conn)
      }
    })

    // Sort groups by priority
    const order: Relationship['type'][] = ['spouse', 'family', 'friend', 'ally', 'mentor', 'student', 'colleague', 'rival', 'enemy']
    const sortedGroups: [string, ConnectionData[]][] = []

    order.forEach(type => {
      if (groups[type]) {
        sortedGroups.push([type, groups[type]])
      }
    })

    return sortedGroups
  }, [connections])

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  if (connections.length === 0) {
    return null
  }

  const displayedGroups = showAll ? groupedConnections : groupedConnections.slice(0, 4)

  return (
    <div className="border-t border-border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Connections ({connections.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('network')}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === 'network' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
            aria-label="Network view"
          >
            <Network className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="px-4 pb-4 space-y-3">
          {displayedGroups.map(([type, conns]) => {
            const config = relationshipConfig[type as Relationship['type']]
            const Icon = config.icon
            const isExpanded = expandedTypes.has(type)

            return (
              <div key={type} className="bg-muted/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleType(type)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <span className="font-medium">{config.label}</span>
                    <span className="text-sm text-muted-foreground">({conns.length})</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 space-y-2">
                    {conns.map(conn => (
                      <Link
                        key={conn.profile.id}
                        href={`/profile/${conn.profile.id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                          {conn.profile.avatar ? (
                            <Image
                              src={conn.profile.avatar}
                              alt={conn.profile.displayName}
                              width={40}
                              height={40}
                              className="w-full h-full rounded-full object-cover"
                              sizes="40px"
                            />
                          ) : (
                            conn.profile.displayName.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{conn.profile.displayName}</p>
                          {conn.relationship.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {conn.relationship.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {groupedConnections.length > 4 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-2 text-sm text-primary hover:underline"
            >
              Show {groupedConnections.length - 4} more categories
            </button>
          )}
        </div>
      )}

      {/* Network View - Visual representation */}
      {view === 'network' && (
        <div className="px-4 pb-4">
          <div className="relative bg-muted/30 rounded-lg p-8 min-h-[300px]">
            {/* Center node (current profile) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg ring-4 ring-primary/20">
                {profileName.charAt(0)}
              </div>
              <p className="text-xs text-center mt-1 font-medium max-w-[80px] truncate mx-auto">
                {profileName.split(' ')[0]}
              </p>
            </div>

            {/* Connection nodes arranged in a circle */}
            {connections.slice(0, 8).map((conn, index) => {
              const angle = (index / Math.min(connections.length, 8)) * 2 * Math.PI - Math.PI / 2
              const radius = 100
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              const config = relationshipConfig[conn.relationship.type]

              return (
                <Link
                  key={conn.profile.id}
                  href={`/profile/${conn.profile.id}`}
                  className="absolute left-1/2 top-1/2 group"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                  }}
                >
                  {/* Connection line */}
                  <svg
                    className="absolute left-1/2 top-1/2 pointer-events-none"
                    style={{
                      width: radius * 2,
                      height: radius * 2,
                      transform: `translate(-50%, -50%)`
                    }}
                  >
                    <line
                      x1={radius}
                      y1={radius}
                      x2={radius - x}
                      y2={radius - y}
                      className={cn(
                        "stroke-current opacity-30",
                        config.color
                      )}
                      strokeWidth="2"
                      strokeDasharray={conn.relationship.type === 'enemy' || conn.relationship.type === 'rival' ? '4 4' : undefined}
                    />
                  </svg>

                  {/* Node */}
                  <div className={cn(
                    "w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shadow-md transition-transform group-hover:scale-110 ring-2",
                    config.color.replace('text-', 'ring-')
                  )}>
                    {conn.profile.avatar ? (
                      <Image
                        src={conn.profile.avatar}
                        alt={conn.profile.displayName}
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                        sizes="48px"
                      />
                    ) : (
                      conn.profile.displayName.charAt(0)
                    )}
                  </div>
                  <p className="text-[10px] text-center mt-1 max-w-[60px] truncate">
                    {conn.profile.displayName.split(' ')[0]}
                  </p>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    <p className="font-medium">{conn.profile.displayName}</p>
                    <p className={cn("text-[10px]", config.color)}>{config.label}</p>
                  </div>
                </Link>
              )
            })}

            {/* More indicator */}
            {connections.length > 8 && (
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                +{connections.length - 8} more connections
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {Object.entries(relationshipConfig).map(([type, config]) => {
              const hasType = connections.some(c => c.relationship.type === type)
              if (!hasType) return null

              const Icon = config.icon
              return (
                <div key={type} className="flex items-center gap-1 text-xs">
                  <Icon className={cn("h-3 w-3", config.color)} />
                  <span className="text-muted-foreground">{config.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for showing in sidebar or cards
interface RelationshipBadgesProps {
  connections: ConnectionData[]
  maxShow?: number
}

export function RelationshipBadges({ connections, maxShow = 5 }: RelationshipBadgesProps) {
  if (connections.length === 0) return null

  const displayed = connections.slice(0, maxShow)
  const remaining = connections.length - maxShow

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-1">Connected to:</span>
      <div className="flex -space-x-2">
        {displayed.map(conn => (
          <Link
            key={conn.profile.id}
            href={`/profile/${conn.profile.id}`}
            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold ring-2 ring-background hover:z-10 hover:ring-primary transition-all"
            title={conn.profile.displayName}
          >
            {conn.profile.avatar ? (
              <Image
                src={conn.profile.avatar}
                alt={conn.profile.displayName}
                width={24}
                height={24}
                className="w-full h-full rounded-full object-cover"
                sizes="24px"
              />
            ) : (
              conn.profile.displayName.charAt(0)
            )}
          </Link>
        ))}
        {remaining > 0 && (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold ring-2 ring-background">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}
