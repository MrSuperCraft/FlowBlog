
import { Database } from "@/shared/types/dbtypes";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: "pkce",
                detectSessionInUrl: true
            }
        }
    );

export const supabaseClient = createClient();
