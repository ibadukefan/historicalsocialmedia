'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { X, Keyboard } from 'lucide-react'

interface KeyboardShortcutsContextType {
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  focusedPostIndex: number
  setFocusedPostIndex: (index: number) => void
  postCount: number
  setPostCount: (count: number) => void
  triggerAction: (action: 'like' | 'bookmark' | 'comment' | 'share' | 'context') => void
  registerActionHandler: (action: string, handler: () => void) => void
  unregisterActionHandler: (action: string) => void
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined)

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider')
  }
  return context
}

// Hook for posts to register themselves
export function usePostKeyboardNavigation(postId: string, index: number) {
  const { focusedPostIndex, registerActionHandler, unregisterActionHandler } = useKeyboardShortcuts()
  const isFocused = focusedPostIndex === index

  return { isFocused }
}

const shortcuts = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'j', description: 'Next post' },
  { key: 'k', description: 'Previous post' },
  { key: 'l', description: 'Like/unlike focused post' },
  { key: 'b', description: 'Bookmark/unbookmark focused post' },
  { key: 'c', description: 'Open comments on focused post' },
  { key: 's', description: 'Share focused post' },
  { key: 'x', description: 'Show historical context' },
  { key: 'Enter', description: 'Open focused post' },
  { key: 'Escape', description: 'Close modal / unfocus' },
  { key: 'g h', description: 'Go to Home' },
  { key: 'g e', description: 'Go to Explore' },
  { key: 'g p', description: 'Go to Profiles' },
  { key: 'g n', description: 'Go to Notifications' },
  { key: 'g m', description: 'Go to Your Profile' },
]

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-1">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">{description}</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  )
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false)
  const [focusedPostIndex, setFocusedPostIndex] = useState(-1)
  const [postCount, setPostCount] = useState(0)
  const [gPressed, setGPressed] = useState(false)
  const actionHandlers = useRef<Record<string, () => void>>({})

  const registerActionHandler = useCallback((action: string, handler: () => void) => {
    actionHandlers.current[action] = handler
  }, [])

  const unregisterActionHandler = useCallback((action: string) => {
    delete actionHandlers.current[action]
  }, [])

  const triggerAction = useCallback((action: 'like' | 'bookmark' | 'comment' | 'share' | 'context') => {
    const handler = actionHandlers.current[action]
    if (handler) {
      handler()
    }
  }, [])

  // Scroll focused post into view
  useEffect(() => {
    if (focusedPostIndex >= 0) {
      const posts = document.querySelectorAll('[data-post-index]')
      const focusedPost = posts[focusedPostIndex] as HTMLElement
      if (focusedPost) {
        focusedPost.scrollIntoView({ behavior: 'smooth', block: 'center' })
        focusedPost.focus()
      }
    }
  }, [focusedPostIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to blur inputs
        if (e.key === 'Escape') {
          target.blur()
        }
        return
      }

      // Handle 'g' prefix for navigation
      if (gPressed) {
        setGPressed(false)
        switch (e.key) {
          case 'h':
            window.location.href = '/'
            return
          case 'e':
            window.location.href = '/explore'
            return
          case 'p':
            window.location.href = '/profiles'
            return
          case 'n':
            window.location.href = '/notifications'
            return
          case 'm':
            window.location.href = '/me'
            return
        }
        return
      }

      switch (e.key) {
        case '?':
          e.preventDefault()
          setShowHelp(true)
          break

        case 'Escape':
          if (showHelp) {
            setShowHelp(false)
          } else {
            setFocusedPostIndex(-1)
          }
          break

        case 'j':
          // Next post
          if (postCount > 0) {
            setFocusedPostIndex(prev => Math.min(prev + 1, postCount - 1))
          }
          break

        case 'k':
          // Previous post
          if (postCount > 0) {
            setFocusedPostIndex(prev => Math.max(prev - 1, 0))
          }
          break

        case 'l':
          // Like
          if (focusedPostIndex >= 0) {
            triggerAction('like')
          }
          break

        case 'b':
          // Bookmark
          if (focusedPostIndex >= 0) {
            triggerAction('bookmark')
          }
          break

        case 'c':
          // Comment
          if (focusedPostIndex >= 0) {
            triggerAction('comment')
          }
          break

        case 's':
          // Share
          if (focusedPostIndex >= 0) {
            triggerAction('share')
          }
          break

        case 'x':
          // Historical context
          if (focusedPostIndex >= 0) {
            triggerAction('context')
          }
          break

        case 'Enter':
          // Open post
          if (focusedPostIndex >= 0) {
            const posts = document.querySelectorAll('[data-post-index]')
            const focusedPost = posts[focusedPostIndex] as HTMLElement
            const postLink = focusedPost?.querySelector('a[href^="/post/"]') as HTMLAnchorElement
            if (postLink) {
              postLink.click()
            }
          }
          break

        case 'g':
          // Start 'g' prefix
          setGPressed(true)
          setTimeout(() => setGPressed(false), 1000) // Reset after 1 second
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showHelp, focusedPostIndex, postCount, gPressed, triggerAction])

  return (
    <KeyboardShortcutsContext.Provider value={{
      showHelp,
      setShowHelp,
      focusedPostIndex,
      setFocusedPostIndex,
      postCount,
      setPostCount,
      triggerAction,
      registerActionHandler,
      unregisterActionHandler
    }}>
      {children}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </KeyboardShortcutsContext.Provider>
  )
}
