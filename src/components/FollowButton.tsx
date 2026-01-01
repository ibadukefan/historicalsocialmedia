'use client'

import { UserCheck } from 'lucide-react'
import { useFollows } from '@/components/FollowsProvider'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  profileId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FollowButton({ profileId, className, size = 'md' }: FollowButtonProps) {
  const { isFollowing, toggleFollow } = useFollows()
  const following = isFollowing(profileId)

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2',
  }

  return (
    <button
      onClick={() => toggleFollow(profileId)}
      className={cn(
        "rounded-full font-semibold transition-all flex items-center gap-1",
        sizeClasses[size],
        following
          ? "bg-muted text-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          : "bg-foreground text-background hover:opacity-90",
        className
      )}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        'Follow'
      )}
    </button>
  )
}
