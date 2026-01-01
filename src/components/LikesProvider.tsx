'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLiveAnnouncer } from './LiveAnnouncer'

interface LikesContextType {
  likes: string[]
  addLike: (postId: string) => void
  removeLike: (postId: string) => void
  isLiked: (postId: string) => boolean
  toggleLike: (postId: string) => void
  getLikeCount: () => number
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

export function useLikes() {
  const context = useContext(LikesContext)
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider')
  }
  return context
}

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likes, setLikes] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const { announce } = useLiveAnnouncer()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('tempus-likes')
    if (stored) {
      try {
        setLikes(JSON.parse(stored))
      } catch {
        setLikes([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-likes', JSON.stringify(likes))
    }
  }, [likes, mounted])

  const addLike = useCallback((postId: string) => {
    setLikes(prev => {
      if (prev.includes(postId)) return prev
      return [...prev, postId]
    })
    announce('Post liked')
  }, [announce])

  const removeLike = useCallback((postId: string) => {
    setLikes(prev => prev.filter(id => id !== postId))
    announce('Like removed')
  }, [announce])

  const isLiked = useCallback((postId: string) => {
    return likes.includes(postId)
  }, [likes])

  const toggleLike = useCallback((postId: string) => {
    if (likes.includes(postId)) {
      removeLike(postId)
    } else {
      addLike(postId)
    }
  }, [likes, addLike, removeLike])

  const getLikeCount = useCallback(() => likes.length, [likes])

  return (
    <LikesContext.Provider value={{ likes, addLike, removeLike, isLiked, toggleLike, getLikeCount }}>
      {children}
    </LikesContext.Provider>
  )
}
