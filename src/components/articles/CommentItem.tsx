"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CommentForm } from "./CommentForm"
import { MoreHorizontal, Reply, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteComment, updateComment, type CommentWithReplies } from "@/actions/comment"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoginCTADropdown } from "./LoginCTADropdown"
import { getProfileFromId } from "@/actions/user"
import type { Profile, Comment } from "@/shared/types"

interface CommentItemProps {
    comment: CommentWithReplies
    postId: string
    currentUserId: string | null
    level?: number
    maxLevel?: number
    onCommentUpdate: (updatedComment?: Comment) => void
}

export function CommentItem({
    comment,
    postId,
    currentUserId,
    level = 0,
    maxLevel = 3,
    onCommentUpdate,
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.text)
    const [profile, setProfile] = useState<Profile | null>(null)


    const isAuthor = currentUserId === comment.profile_id
    const formattedDate = comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ""

    useEffect(() => {
        getProfileFromId(comment.profile_id).then(setProfile)
    }, [comment.profile_id])

    const handleDelete = async () => {
        setIsDeleting(true)
        console.log("[handleDelete] Attempting to delete comment with ID:", comment.id)



        try {
            const success = await deleteComment(comment.id)

            if (success) {
                toast.success("Comment deleted successfully")
                onCommentUpdate()
            } else {
                console.warn("[handleDelete] Deletion failed, no success returned")
                toast.error("Failed to delete comment")
            }
        } catch (error) {
            console.error("[handleDelete] Delete error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete comment")
        } finally {
            setIsDeleting(false)
            setShowDeleteAlert(false)
        }
    }


    const handleUpdate = async () => {
        if (!editedContent.trim()) {
            toast.error("Comment cannot be empty")
            return
        }

        setIsUpdating(true)
        try {
            const updatedComment = await updateComment(comment.id, editedContent)
            if (updatedComment) {
                toast.success("Comment updated successfully")
                setIsEditing(false)
                onCommentUpdate(updatedComment)
            } else {
                throw new Error("Failed to update comment")
            }
        } catch (error) {
            console.error("Update error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update comment")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleReplySuccess = (newComment: Comment) => {
        setShowReplyForm(false)

        // If we're at the maximum nesting level, change the parentId to be the same as the current comment's parentId
        if (level >= maxLevel) {
            // Create a modified comment with the adjusted parentId
            const adjustedComment = {
                ...newComment,
                parent_id: comment.parent_id || comment.id, // Use the current comment's parentId or its own ID if it's a top-level comment
            }
            onCommentUpdate(adjustedComment)
        } else {
            onCommentUpdate(newComment)
        }
    }

    return (
        <div className={`comment-item ${level > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}>
            <div className="flex space-x-3">
                <Avatar
                    className="h-8 w-8"
                    src={profile?.avatar_url || ""}
                    alt={profile?.username || "User"}
                    fallback={profile?.username?.[0] || profile?.full_name?.[0] || "U"}
                />

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{profile?.full_name || profile?.username || "Anonymous"}</span>
                            <span className="text-xs text-muted-foreground">{formattedDate}</span>
                        </div>

                        {isAuthor && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => setShowDeleteAlert(true)}
                                    >  Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <Textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="min-h-[80px] w-full"
                                disabled={isUpdating}
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdate} disabled={isUpdating || !editedContent.trim()}>
                                    {isUpdating ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm">{comment.text}</div>
                    )}

                    <div className="pt-2">
                        {currentUserId ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <Reply className="mr-1 h-3 w-3" />
                                Reply
                            </Button>
                        ) : (
                            <LoginCTADropdown>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                    <Reply className="mr-1 h-3 w-3" />
                                    Reply
                                </Button>
                            </LoginCTADropdown>
                        )}
                    </div>

                    {showReplyForm && (
                        <div className="mt-3">
                            <CommentForm
                                postId={postId}
                                parentId={level >= maxLevel ? comment.parent_id || comment.id : comment.id}
                                onSuccess={handleReplySuccess}
                                onCancel={() => setShowReplyForm(false)}
                                placeholder="Write a reply..."
                            />
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && level < maxLevel && (
                        <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    currentUserId={currentUserId}
                                    level={level + 1}
                                    maxLevel={maxLevel}
                                    onCommentUpdate={onCommentUpdate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your comment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

