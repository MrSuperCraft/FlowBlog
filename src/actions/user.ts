'use server'

import type { Profile } from "@/shared/types";
import { createClient } from "@/shared/lib/supabase/client";
import { z } from "zod"
import { revalidatePath } from "next/cache";


export async function getProfileFromUsername(username: string): Promise<Profile | null> {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("full_name", username)
            .maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return null;
        }

        return data ?? null;
    } catch (err) {
        console.error("Unexpected error fetching profile:", err);
        return null;
    }
}

export async function getProfileFromId(id: string): Promise<Profile | null> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return null;
    }

    return data
}



export async function getUserProfiles(profileIds: string[]) {
    if (profileIds.length === 0) return [];
    const supabase = createClient()

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", profileIds);

    if (error) {
        console.error("Error fetching user profiles:", error);
        return [];
    }

    return data;
}


// Define the profile schema for validation using full_name instead of username
const profileSchema = z.object({
    id: z.string().uuid(),
    full_name: z
        .string()
        .min(3, { message: "Full name must be at least 3 characters." })
        .max(50, { message: "Full name cannot exceed 50 characters." })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: "Full name can only contain letters, numbers, underscores, and hyphens." }),
    avatar_url: z.string().url().nullable().optional(),
    location: z.string().max(100).optional().nullable(),
    github: z.string().max(100).optional().nullable(),
    website: z.string().url().optional().nullable().or(z.literal("")),
    updated_at: z.string().datetime(),
})

type ProfileData = z.infer<typeof profileSchema>

/**
 * Server action to update a user's profile
 */
export async function updateProfile(userId: string, formData: ProfileData) {
    // Verify the user is authenticated
    const supabase = createClient()

    try {
        // Validate the form data
        const validatedData = profileSchema.parse(formData)

        // Update the profile in the database
        const { error } = await supabase
            .from("profiles")
            .update(validatedData)
            .eq("id", userId); // Ensure only the specific user's data is updated

        if (error) {
            if (error.code === "23505") {
                return { error: "Full name is already taken" }
            }
            throw error
        }

        // Revalidate the settings page to show updated data
        revalidatePath("/settings")

        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        if (error instanceof z.ZodError) {
            return { error: "Invalid form data" }
        }
        return { error: "Failed to update profile" }
    }
}

/**
 * Server action to upload an avatar image
 */
export async function uploadAvatar(userId: string, file: File) {
    // Verify the user is authenticated
    const supabase = createClient()

    try {
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
            return { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." }
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { error: "File too large. Maximum size is 5MB." }
        }

        // Generate a unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `public/${fileName}`

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: true,
            })

        if (uploadError) {
            throw uploadError
        }

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath)

        return { url: urlData.publicUrl }
    } catch (error) {
        console.error("Error uploading avatar:", error)
        return { error: "Failed to upload avatar" }
    }
}