'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

interface LiveAnnouncerContextType {
  announce: (message: string, politeness?: 'polite' | 'assertive') => void
}

const LiveAnnouncerContext = createContext<LiveAnnouncerContextType | undefined>(undefined)

export function useLiveAnnouncer() {
  const context = useContext(LiveAnnouncerContext)
  if (!context) {
    throw new Error('useLiveAnnouncer must be used within a LiveAnnouncerProvider')
  }
  return context
}

export function LiveAnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('')
  const [assertiveMessage, setAssertiveMessage] = useState('')
  const politeTimeoutRef = useRef<NodeJS.Timeout>()
  const assertiveTimeoutRef = useRef<NodeJS.Timeout>()

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (politeness === 'assertive') {
      // Clear existing message first to ensure re-announcement
      setAssertiveMessage('')
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current)
      }
      // Small delay to ensure the clearing is processed
      setTimeout(() => {
        setAssertiveMessage(message)
        assertiveTimeoutRef.current = setTimeout(() => setAssertiveMessage(''), 1000)
      }, 50)
    } else {
      setPoliteMessage('')
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current)
      }
      setTimeout(() => {
        setPoliteMessage(message)
        politeTimeoutRef.current = setTimeout(() => setPoliteMessage(''), 1000)
      }, 50)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current)
      if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current)
    }
  }, [])

  return (
    <LiveAnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Screen reader only live regions */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveAnnouncerContext.Provider>
  )
}
