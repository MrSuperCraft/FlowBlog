"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createComment } from "@/actions/comment"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { LoginCTADropdown } from "./LoginCTADropdown"
import type { Comment } from "@/shared/types"
import { useUser } from "@/shared/context/UserContext"

interface CommentFormProps {
    postId: string
    parentId?: string
    onSuccess?: (newComment: Comment) => void
    onCancel?: () => void
    placeholder?: string
    rateLimitDuration?: number
}

export function CommentForm({
    postId,
    parentId,
    onSuccess,
    onCancel,
    placeholder = "Add a comment...",
    rateLimitDuration = 30000,
}: CommentFormProps) {
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastCommentTime, setLastCommentTime] = useState<number | null>(null)
    const { session } = useUser();
    const userId = session?.user.id

    const submitComment = async () => {
        try {
            console.log("Submitting comment with user id: ", userId) // Log submission attempt
            const newComment = await createComment({
                postId,
                profileId: userId ?? null,  // Ensuring userId is not undefined/null
                text: content.trim(),
                parentId,
            })

            console.log("Received comment response:", newComment) // Log the response for debugging

            if (newComment && newComment.comment) {
                setContent("")
                setLastCommentTime(Date.now())
                if (onSuccess) onSuccess(newComment.comment)
                toast.success(parentId ? "Reply added" : "Comment added")
            } else {
                console.error("No comment returned from the server") // Log an error if no comment is returned
                throw new Error("Failed to post comment: No comment returned from the server")
            }
        } catch (error) {
            // Enhanced error handling
            if (error instanceof Error) {
                console.error("Error posting comment:", error.message) // Log specific error message
                toast.error(error.message)  // Show error message to the user
            } else {
                console.error("Unknown error during comment submission", error) // Log unexpected error type
                toast.error("An unexpected error occurred while submitting your comment.") // Show generic error message
            }
        } finally {
            setIsSubmitting(false)
            console.log("Comment submission finished") // Log completion of submission attempt
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const currentTime = Date.now()
        if (lastCommentTime && currentTime - lastCommentTime < rateLimitDuration) {
            const remainingTime = Math.ceil(
                (rateLimitDuration - (currentTime - lastCommentTime)) / 1000,
            )
            toast.error(`Please wait ${remainingTime} seconds before commenting again.`)
            return
        }

        if (!content.trim()) {
            toast.error("Comment cannot be empty")
            return
        }

        if (!userId) {
            toast.error("You must be logged in to comment")
            return
        }

        setIsSubmitting(true)
        // Directly submit the comment without content moderation for now.
        await submitComment()
    }

    if (!userId) {
        return (
            <LoginCTADropdown>
                <Textarea placeholder={placeholder} className="min-h-[80px] w-full" disabled />
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
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting || !content.trim()}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting
                        </>
                    ) : parentId ? (
                        "Reply"
                    ) : (
                        "Comment"
                    )}
                </Button>
            </div>
        </form>
    )
}
