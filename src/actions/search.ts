"use server";

import { supabaseClient } from "@/shared/lib/supabase/client";


export async function searchPosts(query: string) {
    if (!query.trim()) return [];


    const { data, error } = await supabaseClient.rpc("search_posts", { query });

    if (error) {
        console.error("Error searching posts:", error);
        return [];
    }

    return data;
}
