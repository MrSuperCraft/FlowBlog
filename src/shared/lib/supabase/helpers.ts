import { User as UserFromSupabase } from "@supabase/supabase-js";
import { supabaseClient } from "./client";
import { redirect } from "next/navigation";



export const isAuthenticated = async (): Promise<{
    authenticated: boolean;
    user: UserFromSupabase | null;
}> => {

    const {
        data: { user },
    } = await supabaseClient.auth.getUser();
    return { authenticated: user !== null, user };
};

export const logOut = async (): Promise<void> => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    redirect("/sign-in");
};
