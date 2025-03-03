'use client';

import { useEffect, useState, useCallback, useRef } from "react"
import { fetchCommentsForPost, buildCommentsTree, type CommentWithReplies } from "@/actions/comment"
import { CommentForm } from "./CommentForm"
import { CommentItem } from "./CommentItem"
import { Skeleton } from "@/components/ui/skeleton"

interface CommentSectionProps {
    postId: string
    userId: string | null
}

interface CommentListProps {
    postId: string
    userId: string | null
    comments: CommentWithReplies[]
    onCommentUpdate: () => void
}

function CommentList({ postId, userId, comments, onCommentUpdate }: CommentListProps) {
    if (comments.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    currentUserId={userId}
                    onCommentUpdate={onCommentUpdate}
                />
            ))}
        </div>
    )
}

function CommentListSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CommentSection({ postId, userId }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentWithReplies[]>([])
    const [loading, setLoading] = useState(true)
    const isFirstLoad = useRef(true)

    const loadComments = useCallback(async () => {
        if (isFirstLoad.current) {
            setLoading(true)
        }
        const fetchedComments = await fetchCommentsForPost(postId)
        setComments(buildCommentsTree(fetchedComments))
        setLoading(false)
        isFirstLoad.current = false
    }, [postId])

    useEffect(() => {
        loadComments()
    }, [loadComments])

    const handleCommentSuccess = useCallback(() => {
        loadComments()
    }, [loadComments])

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Comments</h2>

            <CommentForm postId={postId} userId={userId} onSuccess={handleCommentSuccess} />

            <div className="pt-4">
                {loading && isFirstLoad.current ? (
                    <CommentListSkeleton />
                ) : (
                    <CommentList
                        postId={postId}
                        userId={userId}
                        comments={comments}
                        onCommentUpdate={loadComments}
                    />
                )}
            </div>
        </div>
    )
}
