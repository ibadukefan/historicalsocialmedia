'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  MapPin,
  CheckCircle2,
  X,
  ChevronDown,
  Clock,
  Globe,
  SlidersHorizontal
} from 'lucide-react'
import { getPosts, getProfiles, getEras } from '@/lib/data'
import { SafePostCard } from '@/components/feed/SafePostCard'
import { cn, getAccuracyColor } from '@/lib/utils'
import { Post, Profile, PostType, AccuracyLevel, Era } from '@/types'

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: 'event', label: 'Events' },
  { value: 'status', label: 'Status' },
  { value: 'tweet', label: 'Tweets' },
  { value: 'quote', label: 'Quotes' },
  { value: 'photo', label: 'Photos' },
  { value: 'article', label: 'Articles' },
  { value: 'thread', label: 'Threads' },
]

const ACCURACY_LEVELS: { value: AccuracyLevel; label: string }[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'documented', label: 'Documented' },
  { value: 'attributed', label: 'Attributed' },
  { value: 'inferred', label: 'Inferred' },
  { value: 'speculative', label: 'Speculative' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  // Core state
  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'profiles'>('posts')

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<PostType[]>([])
  const [selectedAccuracy, setSelectedAccuracy] = useState<AccuracyLevel[]>([])
  const [selectedEra, setSelectedEra] = useState<string>('')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')
  const [yearFrom, setYearFrom] = useState<string>('')
  const [yearTo, setYearTo] = useState<string>('')

  // Dropdown state
  const [showEraDropdown, setShowEraDropdown] = useState(false)
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false)
  const [authorSearch, setAuthorSearch] = useState('')

  // Data
  const allPosts = getPosts()
  const allProfiles = getProfiles()
  const allEras = getEras()

  // Create profiles lookup
  const profilesMap = useMemo(() => {
    const map: Record<string, Profile> = {}
    allProfiles.forEach(p => { map[p.id] = p })
    return map
  }, [allProfiles])

  // Extract unique locations from posts
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>()
    allPosts.forEach(post => {
      if (post.location?.name) {
        locations.add(post.location.name)
      }
      if (post.location?.modern) {
        locations.add(post.location.modern)
      }
    })
    return Array.from(locations).sort()
  }, [allPosts])

  // Filter authors based on search
  const filteredAuthors = useMemo(() => {
    if (!authorSearch) return allProfiles.slice(0, 10)
    const q = authorSearch.toLowerCase()
    return allProfiles
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.displayName.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q)
      )
      .slice(0, 10)
  }, [allProfiles, authorSearch])

  // Filter results
  const filteredPosts = useMemo(() => {
    let results = allPosts

    // Text search
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(post =>
        post.content.toLowerCase().includes(q) ||
        post.title?.toLowerCase().includes(q) ||
        post.hashtags?.some(h => h.toLowerCase().includes(q)) ||
        profilesMap[post.authorId]?.name.toLowerCase().includes(q) ||
        post.location?.name?.toLowerCase().includes(q) ||
        post.location?.modern?.toLowerCase().includes(q)
      )
    }

    // Era filter
    if (selectedEra) {
      results = results.filter(post => post.era === selectedEra)
    }

    // Author filter
    if (selectedAuthor) {
      results = results.filter(post => post.authorId === selectedAuthor)
    }

    // Location filter
    if (locationFilter) {
      const loc = locationFilter.toLowerCase()
      results = results.filter(post =>
        post.location?.name?.toLowerCase().includes(loc) ||
        post.location?.modern?.toLowerCase().includes(loc)
      )
    }

    // Year range filter
    if (yearFrom) {
      const fromYear = parseInt(yearFrom)
      if (!isNaN(fromYear)) {
        results = results.filter(post => {
          const postYear = new Date(post.timestamp).getFullYear()
          return postYear >= fromYear
        })
      }
    }
    if (yearTo) {
      const toYear = parseInt(yearTo)
      if (!isNaN(toYear)) {
        results = results.filter(post => {
          const postYear = new Date(post.timestamp).getFullYear()
          return postYear <= toYear
        })
      }
    }

    // Type filter
    if (selectedTypes.length > 0) {
      results = results.filter(post => selectedTypes.includes(post.type))
    }

    // Accuracy filter
    if (selectedAccuracy.length > 0) {
      results = results.filter(post => selectedAccuracy.includes(post.accuracy))
    }

    return results
  }, [allPosts, query, selectedTypes, selectedAccuracy, selectedEra, selectedAuthor, locationFilter, yearFrom, yearTo, profilesMap])

  const filteredProfiles = useMemo(() => {
    let results = allProfiles

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(profile =>
        profile.name.toLowerCase().includes(q) ||
        profile.displayName.toLowerCase().includes(q) ||
        profile.handle.toLowerCase().includes(q) ||
        profile.bio.toLowerCase().includes(q) ||
        profile.title?.toLowerCase().includes(q)
      )
    }

    // Filter by era
    if (selectedEra) {
      results = results.filter(profile => profile.era.includes(selectedEra))
    }

    return results
  }, [allProfiles, query, selectedEra])

  const toggleType = (type: PostType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleAccuracy = (accuracy: AccuracyLevel) => {
    setSelectedAccuracy(prev =>
      prev.includes(accuracy)
        ? prev.filter(a => a !== accuracy)
        : [...prev, accuracy]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedAccuracy([])
    setSelectedEra('')
    setSelectedAuthor('')
    setLocationFilter('')
    setYearFrom('')
    setYearTo('')
  }

  const filterCount =
    selectedTypes.length +
    selectedAccuracy.length +
    (selectedEra ? 1 : 0) +
    (selectedAuthor ? 1 : 0) +
    (locationFilter ? 1 : 0) +
    (yearFrom || yearTo ? 1 : 0)

  const hasFilters = filterCount > 0

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element
      if (!target.closest('.era-dropdown')) setShowEraDropdown(false)
      if (!target.closest('.author-dropdown')) setShowAuthorDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, people, hashtags, locations..."
              className="w-full pl-10 pr-10 py-3 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              aria-label="Search posts and profiles"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-background"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                showFilters || hasFilters
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
              aria-expanded={showFilters}
              aria-label={`${showFilters ? 'Hide' : 'Show'} filters`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
              {hasFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary-foreground/20 rounded-full text-xs">
                  {filterCount}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
            {/* Row 1: Era and Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Era dropdown */}
              <div className="era-dropdown relative">
                <label className="text-sm font-medium mb-1.5 block">Era</label>
                <button
                  onClick={() => setShowEraDropdown(!showEraDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80"
                  aria-expanded={showEraDropdown}
                  aria-haspopup="listbox"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {selectedEra ? allEras.find(e => e.id === selectedEra)?.name : 'All Eras'}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showEraDropdown && "rotate-180")} />
                </button>
                {showEraDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-auto" role="listbox">
                    <button
                      onClick={() => { setSelectedEra(''); setShowEraDropdown(false) }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                        !selectedEra && "bg-muted font-medium"
                      )}
                      role="option"
                      aria-selected={!selectedEra}
                    >
                      All Eras
                    </button>
                    {allEras.map(era => (
                      <button
                        key={era.id}
                        onClick={() => { setSelectedEra(era.id); setShowEraDropdown(false) }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                          selectedEra === era.id && "bg-muted font-medium"
                        )}
                        role="option"
                        aria-selected={selectedEra === era.id}
                      >
                        <span className="block">{era.name}</span>
                        <span className="text-xs text-muted-foreground">{era.postCount} posts</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Author dropdown */}
              <div className="author-dropdown relative">
                <label className="text-sm font-medium mb-1.5 block">Author</label>
                <button
                  onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80"
                  aria-expanded={showAuthorDropdown}
                  aria-haspopup="listbox"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {selectedAuthor ? profilesMap[selectedAuthor]?.displayName : 'All Authors'}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showAuthorDropdown && "rotate-180")} />
                </button>
                {showAuthorDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-auto">
                    <div className="p-2 border-b border-border">
                      <input
                        type="text"
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        placeholder="Search authors..."
                        className="w-full px-2 py-1.5 text-sm bg-muted rounded border-0 focus:ring-1 focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <button
                      onClick={() => { setSelectedAuthor(''); setShowAuthorDropdown(false); setAuthorSearch('') }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                        !selectedAuthor && "bg-muted font-medium"
                      )}
                      role="option"
                      aria-selected={!selectedAuthor}
                    >
                      All Authors
                    </button>
                    {filteredAuthors.map(profile => (
                      <button
                        key={profile.id}
                        onClick={() => { setSelectedAuthor(profile.id); setShowAuthorDropdown(false); setAuthorSearch('') }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2",
                          selectedAuthor === profile.id && "bg-muted font-medium"
                        )}
                        role="option"
                        aria-selected={selectedAuthor === profile.id}
                      >
                        <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-semibold shrink-0">
                          {profile.displayName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate">{profile.displayName}</span>
                          <span className="text-xs text-muted-foreground truncate block">{profile.handle}</span>
                        </div>
                        {profile.isVerified && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Location and Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Location filter */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="e.g., Philadelphia, Paris"
                    className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
                    list="locations-list"
                  />
                  <datalist id="locations-list">
                    {uniqueLocations.slice(0, 20).map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Year from */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">From Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value.replace(/[^0-9-]/g, ''))}
                    placeholder="e.g., 1776"
                    className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Year to */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">To Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value.replace(/[^0-9-]/g, ''))}
                    placeholder="e.g., 1783"
                    className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Post types */}
            <div>
              <h3 className="text-sm font-medium mb-2">Post Type</h3>
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleType(value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      selectedTypes.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    aria-pressed={selectedTypes.includes(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Accuracy levels */}
            <div>
              <h3 className="text-sm font-medium mb-2">Accuracy Level</h3>
              <div className="flex flex-wrap gap-2">
                {ACCURACY_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleAccuracy(value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      selectedAccuracy.includes(value)
                        ? getAccuracyColor(value)
                        : "bg-muted hover:bg-muted/80"
                    )}
                    aria-pressed={selectedAccuracy.includes(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters summary */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground py-1">Active:</span>
                {selectedEra && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {allEras.find(e => e.id === selectedEra)?.shortName || selectedEra}
                    <button onClick={() => setSelectedEra('')} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedAuthor && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {profilesMap[selectedAuthor]?.displayName}
                    <button onClick={() => setSelectedAuthor('')} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {locationFilter}
                    <button onClick={() => setLocationFilter('')} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(yearFrom || yearTo) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {yearFrom || '...'} - {yearTo || '...'}
                    <button onClick={() => { setYearFrom(''); setYearTo('') }} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedTypes.map(type => (
                  <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {POST_TYPES.find(t => t.value === type)?.label}
                    <button onClick={() => toggleType(type)} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedAccuracy.map(acc => (
                  <span key={acc} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {acc}
                    <button onClick={() => toggleAccuracy(acc)} className="hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              "flex-1 py-3 text-center font-medium transition-colors relative",
              activeTab === 'posts'
                ? "text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-selected={activeTab === 'posts'}
            role="tab"
          >
            Posts ({filteredPosts.length.toLocaleString()})
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={cn(
              "flex-1 py-3 text-center font-medium transition-colors relative",
              activeTab === 'profiles'
                ? "text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-selected={activeTab === 'profiles'}
            role="tab"
          >
            People ({filteredProfiles.length.toLocaleString()})
            {activeTab === 'profiles' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div role="tabpanel">
        {activeTab === 'posts' ? (
          filteredPosts.length > 0 ? (
            filteredPosts.slice(0, 100).map(post => (
              <SafePostCard
                key={post.id}
                post={post}
                author={profilesMap[post.authorId]}
              />
            ))
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts found"
              description={query ? `No posts match "${query}"` : 'Try adjusting your filters or searching for something'}
            />
          )
        ) : (
          filteredProfiles.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredProfiles.map(profile => (
                <ProfileResult key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={User}
              title="No people found"
              description={query ? `No profiles match "${query}"` : 'Try searching for historical figures'}
            />
          )
        )}

        {/* Show count notice if results were limited */}
        {activeTab === 'posts' && filteredPosts.length > 100 && (
          <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            Showing first 100 of {filteredPosts.length.toLocaleString()} results. Try narrowing your search.
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileResult({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.id}`}
      className="flex items-start gap-3 p-4 hover:bg-muted transition-colors"
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
          {profile.displayName.charAt(0)}
        </div>
        {profile.isVerified && (
          <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-primary fill-background" aria-label="Verified" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold truncate">{profile.displayName}</span>
          {profile.isVerified && (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{profile.handle}</p>
        {profile.title && (
          <p className="text-sm text-muted-foreground mt-0.5">{profile.title}</p>
        )}
        <p className="text-sm mt-1 line-clamp-2">{profile.bio}</p>
        {profile.era.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.era.slice(0, 3).map(era => (
              <span key={era} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                {era.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="py-12 text-center">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
