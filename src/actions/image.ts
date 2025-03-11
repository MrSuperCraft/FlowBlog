import { supabaseClient } from "@/shared/lib/supabase/client";
import { toast } from "sonner";

export async function uploadCoverImage(file: File, postId: string) {
    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `covers/${postId}.${fileExt}`;

        const { error } = await supabaseClient.storage
            .from('post-covers')
            .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: publicURL } = supabaseClient.storage
            .from('post-covers')
            .getPublicUrl(filePath);

        return publicURL.publicUrl;
    } catch (error) {
        toast.error("Failed to upload cover image");
        throw error;
    }
}


export async function deleteCoverImage(postId: string) {
    try {
        const { data, error } = await supabaseClient.storage
            .from('post-covers')
            .remove([`covers/${postId}.*`]); // Deletes any extension

        if (error) throw error;
        return data;
    } catch (error) {
        toast.error("Failed to delete cover image");
        throw error;
    }
}
