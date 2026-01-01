'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLiveAnnouncer } from './LiveAnnouncer'

interface BookmarksContextType {
  bookmarks: string[]
  addBookmark: (postId: string) => void
  removeBookmark: (postId: string) => void
  isBookmarked: (postId: string) => boolean
  toggleBookmark: (postId: string) => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider')
  }
  return context
}

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const { announce } = useLiveAnnouncer()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('tempus-bookmarks')
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored))
      } catch {
        setBookmarks([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-bookmarks', JSON.stringify(bookmarks))
    }
  }, [bookmarks, mounted])

  const addBookmark = useCallback((postId: string) => {
    setBookmarks(prev => {
      if (prev.includes(postId)) return prev
      return [...prev, postId]
    })
    announce('Post saved to bookmarks')
  }, [announce])

  const removeBookmark = useCallback((postId: string) => {
    setBookmarks(prev => prev.filter(id => id !== postId))
    announce('Post removed from bookmarks')
  }, [announce])

  const isBookmarked = useCallback((postId: string) => {
    return bookmarks.includes(postId)
  }, [bookmarks])

  const toggleBookmark = useCallback((postId: string) => {
    if (bookmarks.includes(postId)) {
      removeBookmark(postId)
    } else {
      addBookmark(postId)
    }
  }, [bookmarks, addBookmark, removeBookmark])

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  )
}
