'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface UserComment {
  id: string
  postId: string
  content: string
  authorName: string
  timestamp: string
  parentId?: string // For nested replies
}

interface CommentsContextType {
  comments: UserComment[]
  addComment: (postId: string, content: string, parentId?: string) => void
  deleteComment: (commentId: string) => void
  getCommentsForPost: (postId: string) => UserComment[]
  getCommentCount: (postId: string) => number
  getUserName: () => string
  setUserName: (name: string) => void
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined)

export function useComments() {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider')
  }
  return context
}

function generateId(): string {
  return `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<UserComment[]>([])
  const [userName, setUserNameState] = useState<string>('Time Traveler')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load comments
    const storedComments = localStorage.getItem('tempus-comments')
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments))
      } catch {
        setComments([])
      }
    }
    // Load user name
    const storedName = localStorage.getItem('tempus-username')
    if (storedName) {
      setUserNameState(storedName)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-comments', JSON.stringify(comments))
    }
  }, [comments, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-username', userName)
    }
  }, [userName, mounted])

  const addComment = useCallback((postId: string, content: string, parentId?: string) => {
    const newComment: UserComment = {
      id: generateId(),
      postId,
      content,
      authorName: userName,
      timestamp: new Date().toISOString(),
      parentId,
    }
    setComments(prev => [...prev, newComment])
  }, [userName])

  const deleteComment = useCallback((commentId: string) => {
    setComments(prev => {
      // Also delete any replies to this comment
      const toDelete = new Set<string>([commentId])
      let changed = true
      while (changed) {
        changed = false
        prev.forEach(comment => {
          if (comment.parentId && toDelete.has(comment.parentId) && !toDelete.has(comment.id)) {
            toDelete.add(comment.id)
            changed = true
          }
        })
      }
      return prev.filter(comment => !toDelete.has(comment.id))
    })
  }, [])

  const getCommentsForPost = useCallback((postId: string): UserComment[] => {
    return comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [comments])

  const getCommentCount = useCallback((postId: string): number => {
    return comments.filter(c => c.postId === postId).length
  }, [comments])

  const getUserName = useCallback(() => userName, [userName])

  const setUserName = useCallback((name: string) => {
    setUserNameState(name || 'Time Traveler')
  }, [])

  return (
    <CommentsContext.Provider value={{
      comments,
      addComment,
      deleteComment,
      getCommentsForPost,
      getCommentCount,
      getUserName,
      setUserName,
    }}>
      {children}
    </CommentsContext.Provider>
  )
}
