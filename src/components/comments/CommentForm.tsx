'use client'

import { useState } from 'react'
import { Send, User } from 'lucide-react'
import { useComments } from '@/components/CommentsProvider'
import { cn } from '@/lib/utils'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
  compact?: boolean
}

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  placeholder = "Add a comment...",
  autoFocus = false,
  compact = false,
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { addComment, getUserName, setUserName } = useComments()
  const [showNameEdit, setShowNameEdit] = useState(false)
  const [tempName, setTempName] = useState(getUserName())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    addComment(postId, content.trim(), parentId)
    setContent('')
    setIsEditing(false)
    onSubmit?.()
  }

  const handleSaveName = () => {
    setUserName(tempName.trim())
    setShowNameEdit(false)
  }

  const userName = getUserName()

  return (
    <div className={cn("space-y-2", compact ? "p-2" : "p-3")}>
      {/* User name display/edit */}
      {!compact && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          {showNameEdit ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 bg-muted border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') {
                    setTempName(userName)
                    setShowNameEdit(false)
                  }
                }}
              />
              <button
                onClick={handleSaveName}
                className="text-xs text-primary hover:underline"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempName(userName)
                  setShowNameEdit(false)
                }}
                className="text-xs text-muted-foreground hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNameEdit(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Commenting as <span className="font-medium text-foreground">{userName}</span>
              <span className="text-xs ml-1">(edit)</span>
            </button>
          )}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        {compact && (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-primary">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsEditing(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "w-full bg-muted border border-border rounded-full px-4 py-2 text-sm",
              "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
              "placeholder:text-muted-foreground",
              compact ? "pr-10" : "pr-12"
            )}
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors",
              content.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send comment"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
