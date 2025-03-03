'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createComment } from '@/actions/comment'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { LoginCTADropdown } from './LoginCTADropdown'
import type { Comment } from '@/types'
import { profanityFilter } from '@/shared/lib/moderation'

interface CommentFormProps {
    postId: string
    userId: string | null
    parentId?: string
    onSuccess?: (newComment: Comment) => void
    onCancel?: () => void
    placeholder?: string
    rateLimitDuration?: number
}

export function CommentForm({
    postId,
    userId,
    parentId,
    onSuccess,
    onCancel,
    placeholder = 'Add a comment...',
    rateLimitDuration = 30000
}: CommentFormProps) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFilterInitialized, setIsFilterInitialized] = useState(false)
    const [lastCommentTime, setLastCommentTime] = useState<number | null>(null)

    useEffect(() => {
        profanityFilter.initialize().then(() => setIsFilterInitialized(true))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const currentTime = Date.now()
        if (lastCommentTime && currentTime - lastCommentTime < rateLimitDuration) {
            const remainingTime = Math.ceil((rateLimitDuration - (currentTime - lastCommentTime)) / 1000)
            toast.error(`Please wait ${remainingTime} seconds before commenting again.`)
            return
        }

        if (!content.trim()) {
            toast.error('Comment cannot be empty')
            return
        }

        if (!userId) {
            toast.error('You must be logged in to comment')
            return
        }

        if (!isFilterInitialized) {
            toast.error('Content filter is initializing. Please try again in a moment.')
            return
        }

        setIsSubmitting(true)

        try {
            // Client-side check
            const clientCheck = await profanityFilter.checkContent(content)
            if (!clientCheck.isAppropriate) {
                toast.error(`Comment rejected: ${clientCheck.reason}`)
                return
            }

            const newComment = await createComment({
                postId,
                profileId: userId,
                text: content.trim(),
                parentId,
            })

            if (newComment && newComment.comment) {
                setContent('')
                setLastCommentTime(Date.now()) // Update last comment time
                if (onSuccess) onSuccess(newComment.comment)
                toast.success(parentId ? 'Reply added' : 'Comment added')
            } else {
                throw new Error('Failed to post comment')
            }
        } catch (error) {
            if (error instanceof Error && error.message === 'Content moderation failed') {
                toast.error('Your comment was flagged by our content moderation system. Please revise and try again.')
            } else {
                toast.error((error as Error).message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!userId) {
        return (
            <LoginCTADropdown>
                <Textarea
                    placeholder={placeholder}
                    className="min-h-[80px] w-full"
                    disabled
                />
            </LoginCTADropdown>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[80px] w-full"
                disabled={isSubmitting}
                aria-label="Comment content"
            />
            <div className="flex justify-end space-x-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting
                        </>
                    ) : parentId ? 'Reply' : 'Comment'}
                </Button>
            </div>
        </form>
    )
}
