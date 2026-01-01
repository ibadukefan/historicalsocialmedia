'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLiveAnnouncer } from './LiveAnnouncer'

interface FollowsContextType {
  follows: string[]
  addFollow: (profileId: string) => void
  removeFollow: (profileId: string) => void
  isFollowing: (profileId: string) => boolean
  toggleFollow: (profileId: string) => void
  getFollowCount: () => number
}

const FollowsContext = createContext<FollowsContextType | undefined>(undefined)

export function useFollows() {
  const context = useContext(FollowsContext)
  if (!context) {
    throw new Error('useFollows must be used within a FollowsProvider')
  }
  return context
}

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const [follows, setFollows] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const { announce } = useLiveAnnouncer()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('tempus-follows')
    if (stored) {
      try {
        setFollows(JSON.parse(stored))
      } catch {
        setFollows([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-follows', JSON.stringify(follows))
    }
  }, [follows, mounted])

  const addFollow = useCallback((profileId: string) => {
    setFollows(prev => {
      if (prev.includes(profileId)) return prev
      return [...prev, profileId]
    })
    announce('Now following')
  }, [announce])

  const removeFollow = useCallback((profileId: string) => {
    setFollows(prev => prev.filter(id => id !== profileId))
    announce('Unfollowed')
  }, [announce])

  const isFollowing = useCallback((profileId: string) => {
    return follows.includes(profileId)
  }, [follows])

  const toggleFollow = useCallback((profileId: string) => {
    if (follows.includes(profileId)) {
      removeFollow(profileId)
    } else {
      addFollow(profileId)
    }
  }, [follows, addFollow, removeFollow])

  const getFollowCount = useCallback(() => follows.length, [follows])

  return (
    <FollowsContext.Provider value={{ follows, addFollow, removeFollow, isFollowing, toggleFollow, getFollowCount }}>
      {children}
    </FollowsContext.Provider>
  )
}
