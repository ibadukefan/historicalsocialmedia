'use client'

import { useEffect } from 'react'
import { Bell, MessageCircle, Heart, Repeat2, UserPlus, Info, TrendingUp, FileText, Award, Check, CheckCheck, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useNotifications, NotificationType } from '@/components/NotificationsProvider'
import { useFollows } from '@/components/FollowsProvider'
import { useLikes } from '@/components/LikesProvider'
import { cn } from '@/lib/utils'
import { getEras } from '@/lib/data'

const notificationIcons: Record<NotificationType, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: MessageCircle,
  trending: TrendingUp,
  new_post: FileText,
  event: Bell,
  milestone: Award
}

const notificationColors: Record<NotificationType, string> = {
  like: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300',
  comment: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
  follow: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
  mention: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
  trending: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
  new_post: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
  event: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300',
  milestone: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, deleteNotification, generateActivityNotifications } = useNotifications()
  const { follows } = useFollows()
  const { likes } = useLikes()
  const allEras = getEras()

  // Generate notifications based on activity when page loads
  useEffect(() => {
    generateActivityNotifications(follows, likes)
  }, [follows, likes, generateActivityNotifications])

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              Alerts from across history
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  aria-label="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                aria-label="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No notifications yet</h2>
          <p className="text-muted-foreground mb-4">
            Start following historical figures and liking posts to receive notifications!
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/profiles"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Figures
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              View Feed
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted/50 border-b border-border">
                <span className="text-sm font-medium">New ({unreadNotifications.length})</span>
              </div>
              <div className="divide-y divide-border">
                {unreadNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  const colorClass = notificationColors[notification.type]
                  const eraName = notification.era
                    ? allEras.find(e => e.id === notification.era)?.shortName || notification.era.replace(/-/g, ' ')
                    : null

                  const content = (
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{notification.title}</p>
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                          {eraName && (
                            <>
                              <span>·</span>
                              <span>{eraName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification.id) }}
                          className="p-1.5 hover:bg-muted rounded-full transition-colors"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id) }}
                          className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                          aria-label="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )

                  return notification.link ? (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      onClick={() => markAsRead(notification.id)}
                      className="block p-4 bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={notification.id} className="p-4 bg-primary/5">
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted/50 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Earlier</span>
              </div>
              <div className="divide-y divide-border">
                {readNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  const colorClass = notificationColors[notification.type]
                  const eraName = notification.era
                    ? allEras.find(e => e.id === notification.era)?.shortName || notification.era.replace(/-/g, ' ')
                    : null

                  const content = (
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 opacity-60", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-muted-foreground">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                          {eraName && (
                            <>
                              <span>·</span>
                              <span>{eraName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id) }}
                        className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors shrink-0"
                        aria-label="Delete notification"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  )

                  return notification.link ? (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      className="block p-4 hover:bg-muted/50 transition-colors"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={notification.id} className="p-4">
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Info */}
      <div className="p-4 border-t border-border">
        <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">How Notifications Work</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications when you follow historical figures (new posts from them),
              when posts you've liked become trending, and for significant historical events that
              happened on today's date. Your notification preferences can be adjusted in Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
