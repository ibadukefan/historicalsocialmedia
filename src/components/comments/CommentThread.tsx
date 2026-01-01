'use client'

import { useState } from 'react'
import { Reply, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useComments, UserComment } from '@/components/CommentsProvider'
import { CommentForm } from './CommentForm'
import { cn } from '@/lib/utils'

interface CommentThreadProps {
  postId: string
  showForm?: boolean
}

export function CommentThread({ postId, showForm = true }: CommentThreadProps) {
  const { getCommentsForPost } = useComments()
  const comments = getCommentsForPost(postId)

  // Organize comments into a tree structure
  const rootComments = comments.filter(c => !c.parentId)
  const childComments = comments.filter(c => c.parentId)

  const getChildComments = (parentId: string): UserComment[] => {
    return childComments.filter(c => c.parentId === parentId)
  }

  if (comments.length === 0 && !showForm) {
    return null
  }

  return (
    <div className="space-y-0">
      {/* Comment form */}
      {showForm && (
        <div className="border-t border-border">
          <CommentForm postId={postId} />
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="border-t border-border">
          <div className="px-4 py-2 bg-muted/30">
            <h3 className="text-sm font-medium text-muted-foreground">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
          </div>
          <div className="divide-y divide-border">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                childComments={getChildComments(comment.id)}
                getChildComments={getChildComments}
                depth={0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: UserComment
  postId: string
  childComments: UserComment[]
  getChildComments: (parentId: string) => UserComment[]
  depth: number
}

function CommentItem({ comment, postId, childComments, getChildComments, depth }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const { deleteComment, getUserName } = useComments()

  const isOwnComment = comment.authorName === getUserName()
  const hasReplies = childComments.length > 0
  const maxDepth = 3 // Limit nesting depth

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("", depth > 0 && "border-l-2 border-border ml-4")}>
      <div className={cn("p-3", depth > 0 && "pl-4")}>
        {/* Comment header */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-primary">
              {comment.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(comment.timestamp)}
              </span>
              {isOwnComment && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  You
                </span>
              )}
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              {depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}
              {isOwnComment && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              )}
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Hide {childComments.length} {childComments.length === 1 ? 'reply' : 'replies'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Show {childComments.length} {childComments.length === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-2 -mx-3">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSubmit={() => setShowReplyForm(false)}
                  placeholder={`Reply to ${comment.authorName}...`}
                  autoFocus
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Child comments (replies) */}
      {showReplies && hasReplies && (
        <div>
          {childComments.map((childComment) => (
            <CommentItem
              key={childComment.id}
              comment={childComment}
              postId={postId}
              childComments={getChildComments(childComment.id)}
              getChildComments={getChildComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
