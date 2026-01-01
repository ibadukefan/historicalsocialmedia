'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { getPosts, getProfiles, getEras } from '@/lib/data'
import { Post, Profile } from '@/types'

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'trending' | 'new_post' | 'event' | 'milestone'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  link?: string
  era?: string
  profileId?: string
  postId?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  deleteNotification: (id: string) => void
  generateActivityNotifications: (followedIds: string[], likedPostIds: string[]) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}

// Historical event notifications that appear based on current date
function getHistoricalEventNotifications(): Notification[] {
  const now = new Date()
  const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const historicalEvents: Record<string, Notification[]> = {
    '01-01': [{
      id: 'event-newyear-1776',
      type: 'event',
      title: 'Continental Army Flag Raised',
      description: 'Washington raises the Grand Union Flag at Cambridge, Massachusetts.',
      timestamp: new Date().toISOString(),
      read: false,
      era: 'american-revolution',
      link: '/era/american-revolution'
    }],
    '07-04': [{
      id: 'event-july4-1776',
      type: 'event',
      title: 'Declaration of Independence Adopted',
      description: 'The Continental Congress formally adopts the Declaration of Independence!',
      timestamp: new Date().toISOString(),
      read: false,
      era: 'american-revolution',
      link: '/search?q=DeclarationOfIndependence'
    }],
    '07-14': [{
      id: 'event-bastille',
      type: 'event',
      title: 'The Bastille Has Fallen!',
      description: 'Revolutionary forces storm the fortress-prison in Paris.',
      timestamp: new Date().toISOString(),
      read: false,
      era: 'french-revolution',
      link: '/era/french-revolution'
    }],
    '11-11': [{
      id: 'event-armistice',
      type: 'event',
      title: 'Armistice Signed',
      description: 'The guns have fallen silent. The Great War is over.',
      timestamp: new Date().toISOString(),
      read: false,
      era: 'world-war-1',
      link: '/era/world-war-1'
    }]
  }

  return historicalEvents[monthDay] || []
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string>('')

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('tempus-notifications')
    const storedLastGen = localStorage.getItem('tempus-notifications-lastgen')

    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch {
        setNotifications([])
      }
    }

    if (storedLastGen) {
      setLastGenerated(storedLastGen)
    }
  }, [])

  // Save to localStorage when notifications change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-notifications', JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep max 50
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Generate notifications based on user activity (follows, likes)
  const generateActivityNotifications = useCallback((followedIds: string[], likedPostIds: string[]) => {
    const today = new Date().toDateString()

    // Only generate once per day
    if (lastGenerated === today) return

    const allPosts = getPosts()
    const allProfiles = getProfiles()
    const profilesMap: Record<string, Profile> = {}
    allProfiles.forEach(p => { profilesMap[p.id] = p })

    const newNotifications: Notification[] = []

    // Add historical event notifications for today
    const eventNotifs = getHistoricalEventNotifications()
    eventNotifs.forEach(eventNotif => {
      if (!notifications.some(n => n.id === eventNotif.id)) {
        newNotifications.push(eventNotif)
      }
    })

    // Generate "new posts from followed users" notifications
    if (followedIds.length > 0) {
      const followedPosts = allPosts
        .filter(p => followedIds.includes(p.authorId))
        .slice(0, 5)

      followedPosts.forEach((post, index) => {
        const profile = profilesMap[post.authorId]
        if (profile && index < 3) { // Limit to 3 new post notifications
          const notifId = `newpost-${post.id}`
          if (!notifications.some(n => n.id === notifId)) {
            newNotifications.push({
              id: notifId,
              type: 'new_post',
              title: `New post from ${profile.displayName}`,
              description: post.content.slice(0, 80) + (post.content.length > 80 ? '...' : ''),
              timestamp: new Date().toISOString(),
              read: false,
              link: `/post/${post.id}`,
              era: post.era,
              profileId: profile.id,
              postId: post.id
            })
          }
        }
      })
    }

    // Generate "your liked post is trending" notifications
    if (likedPostIds.length > 0) {
      const likedPosts = allPosts.filter(p => likedPostIds.includes(p.id))
      const trendingLiked = likedPosts
        .filter(p => (p.likes || 0) > 50)
        .slice(0, 2)

      trendingLiked.forEach(post => {
        const profile = profilesMap[post.authorId]
        const notifId = `trending-${post.id}`
        if (!notifications.some(n => n.id === notifId)) {
          newNotifications.push({
            id: notifId,
            type: 'trending',
            title: 'Your liked post is trending!',
            description: `"${post.content.slice(0, 60)}..." by ${profile?.displayName || 'Unknown'}`,
            timestamp: new Date().toISOString(),
            read: false,
            link: `/post/${post.id}`,
            era: post.era,
            postId: post.id
          })
        }
      })
    }

    // Add milestone notification if user has activity
    if (followedIds.length >= 5 && likedPostIds.length >= 10) {
      const milestoneId = 'milestone-active-user'
      if (!notifications.some(n => n.id === milestoneId)) {
        newNotifications.push({
          id: milestoneId,
          type: 'milestone',
          title: 'Time Traveler Achievement!',
          description: `You're following ${followedIds.length} figures and liked ${likedPostIds.length} posts across history.`,
          timestamp: new Date().toISOString(),
          read: false,
          link: '/settings'
        })
      }
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 50))
    }

    setLastGenerated(today)
    localStorage.setItem('tempus-notifications-lastgen', today)
  }, [notifications, lastGenerated])

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification,
      generateActivityNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}
