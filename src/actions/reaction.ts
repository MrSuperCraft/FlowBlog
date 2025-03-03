import { supabaseClient } from '@/shared/lib/supabase/client';

export const hasUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
    if (!userId) return false; // Ensure user is authenticated

    const { data, error } = await supabaseClient
        .from('reactions')
        .select('id') // We only need the id field
        .eq('post_id', postId)
        .eq('profile_id', userId)
        .maybeSingle(); // Avoids throwing an error if no rows are found

    if (error) {
        console.error('Error checking if user liked post:', error.message);
    }

    return Boolean(data); // Return true if data exists, false otherwise
};
