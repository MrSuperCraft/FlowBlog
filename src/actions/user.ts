import type { Profile } from "@/shared/types";
import { createClient } from "@/shared/lib/supabase/client";


export async function getProfileFromUsername(id: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
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