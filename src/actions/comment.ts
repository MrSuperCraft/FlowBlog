"use server"

import { supabaseClient } from "@/shared/lib/supabase/client"
import type { Comment } from "@/shared/types"

/**
 * Fetch all comments for a given post.
 * Returns a flat array of comments, sorted by creation time.
 */
export async function fetchCommentsForPost(postId: string): Promise<Comment[]> {
    const { data, error } = await supabaseClient
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching comments:", error.message)
        return []
    }

    return data as Comment[]
}

/**
 * Create a new comment.
 * The optional parentId parameter allows for nested comments.
 */
export async function createComment({
    postId,
    profileId,
    text,
    parentId,
}: {
    postId: string
    profileId: string | null
    text: string
    parentId?: string
}): Promise<{ success: boolean; comment?: Comment; error?: string }> {
    if (profileId === null) {
        return { success: false, error: "Disallowed attempt of posting a comment." }
    }

    // Log user information and query parameters for debugging
    console.log("Submitting comment with user id:", profileId)

    const { data, error } = await supabaseClient
        .from("comments")
        .insert([{ post_id: postId, profile_id: profileId, text, parent_id: parentId || null }])
        .select()
        .single()

    if (error) {
        console.error("Error creating comment:", error.message)
        return { success: false, error: error.message }
    }

    console.log("Comment created successfully:", data)
    return { success: true, comment: data as Comment }
}

/**
 * Update an existing comment's text.
 */
export async function updateComment(commentId: string, text: string): Promise<Comment | null> {
    try {
        // First check if the comment exists
        const { data: existingComment, error: fetchError } = await supabaseClient
            .from("comments")
            .select("*")
            .eq("id", commentId)
            .maybeSingle()

        if (fetchError) {
            console.error("Error fetching comment for update:", fetchError.message)
            throw new Error(`Error fetching comment: ${fetchError.message}`)
        }

        if (!existingComment) {
            throw new Error("Comment not found")
        }

        // Then update the comment
        const { data, error } = await supabaseClient
            .from("comments")
            .update({ text, updated_at: new Date().toISOString() })
            .eq("id", commentId)
            .select()
            .maybeSingle()

        if (error) {
            console.error("Error updating comment:", error.message)
            throw new Error(`Error updating comment: ${error.message}`)
        }

        return data as Comment
    } catch (error) {
        console.error("Error in updateComment:", error)
        throw error
    }
}

/**
 * Delete a comment by its ID.
 */
export async function deleteComment(commentId: string): Promise<boolean> {
    try {
        console.log("[deleteComment] Checking if comment exists...")

        // Check if the comment exists before deleting
        const { data: existingComment, error: fetchError } = await supabaseClient
            .from("comments")
            .select("*")
            .eq("id", commentId)
            .maybeSingle()



        if (fetchError) {
            console.error("[deleteComment] Error fetching comment:", fetchError.message)
            throw new Error(`Error fetching comment: ${fetchError.message}`)
        }

        if (!existingComment) {
            console.warn("[deleteComment] Comment not found, cannot delete")
            return false
        }

        console.log("[deleteComment] Comment found, proceeding with deletion...")

        // Delete the comment
        const { error: deleteError } = await supabaseClient
            .from("comments")
            .delete()
            .eq("id", commentId)


        console.log(deleteError)

        if (deleteError) {
            console.error("[deleteComment] Error deleting comment:", deleteError.message)
            throw new Error(`Error deleting comment: ${deleteError.message}`)
        }

        console.log("[deleteComment] Comment deleted successfully!")
        return true
    } catch (error) {
        console.error("[deleteComment] Error:", error)
        return false
    }
}


export type CommentWithReplies = Comment & {
    replies?: CommentWithReplies[]
}

export async function buildCommentsTree(comments: Comment[]): Promise<CommentWithReplies[]> {
    const map = new Map<string, CommentWithReplies>()
    const roots: CommentWithReplies[] = []

    // Initialize map with comment objects and an empty replies array.
    comments.forEach((comment) => {
        map.set(comment.id, { ...comment, replies: [] })
    })

    // Build the tree by linking children to their parent.
    map.forEach((comment) => {
        if (comment.parent_id) {
            const parent = map.get(comment.parent_id)
            if (parent) {
                parent.replies?.push(comment)
            }
        } else {
            roots.push(comment)
        }
    })

    return roots
}

