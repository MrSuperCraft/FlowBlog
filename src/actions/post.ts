import type { BlogPost, PostInsert, PostType, PostUpdate } from "@/shared/types"
import { supabaseClient } from '@/shared/lib/supabase/client'
import { toast } from 'sonner'
import { deleteCoverImage } from "./image"

// Create a new post
export async function createPost(post: PostInsert) {
    try {
        const { data, error } = await supabaseClient.from('posts').insert([post]).single()
        if (error) throw error
        toast.success('Post created successfully')
        return data
    } catch (error) {
        toast.error('Failed to create post')
        throw error
    }
}

// Update an existing post
export async function updatePost(id: string, updates: PostUpdate): Promise<BlogPost> {
    try {
        const { data, error } = await supabaseClient
            .from("posts")
            .update(updates)
            .eq("id", id)
            .select()
            .single(); // Ensures it returns a single object

        if (error) throw error;
        if (!data) throw new Error("Supabase update did not return any data");

        toast.success("Post updated successfully");
        return data as BlogPost;
    } catch (error) {
        toast.error("Failed to update post");
        throw error;
    }
}



// Delete a post by ID
export async function deletePost(id: string) {
    try {
        await deleteCoverImage(id); // Remove cover image first
        const { data, error } = await supabaseClient.from('posts').delete().eq('id', id).single()
        if (error) throw error
        toast.success('Post deleted successfully')
        return data
    } catch (error) {
        toast.error('Failed to delete post')
        throw error
    }
}



// Retrieve a single post by ID
export async function getPost(id: string) {
    try {
        const { data, error } = await supabaseClient.from('posts').select('*').eq('id', id).single()
        if (error) throw error
        return data
    } catch (error) {
        throw error
    }
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
    try {
        const { data, error } = await supabaseClient.from('posts').select('*').match({ slug }).single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error as Error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}






// Retrieve multiple posts; optionally filter by status
export async function getPosts(uid: string, status?: "draft" | "published" | "archived", orderOnDate?: boolean) {
    try {
        let query = supabaseClient.from('posts').select('*').eq("author_id", uid)
        if (status) {
            query = query.eq('status', status)
        }
        if (orderOnDate) {
            query = query.order("published_at", { ascending: false })
        }
        const { data, error } = await query
        if (error) throw error
        return data
    } catch (error) {
        throw error
    }
}



export async function getSuggestedAuthors(limit = 5): Promise<{ id: string; full_name: string; avatar_url: string }[]> {
    // Fetch all authors from the profiles table
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("id, full_name, avatar_url");

    if (error) {
        console.error("Error fetching authors:", error);
        return [];
    }

    // Shuffle the authors and select the first 'limit' authors
    const shuffledAuthors = data.sort(() => 0.5 - Math.random());
    return shuffledAuthors.slice(0, limit) as { id: string; full_name: string; avatar_url: string }[];
}