import { createClient } from "@/shared/lib/supabase/client";

export async function getSitemapUsernamesAndPosts(): Promise<{ full_name: string; slug: string; updatedAt: string }[]> {
    const supabase = createClient();

    // Fetch posts along with the associated profiles
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("slug, updated_at, author_id");

    if (postsError) {
        console.error("Error fetching posts:", postsError);
        return [];
    }

    // Get unique author_ids from posts
    const authorIds = [...new Set(posts.map(post => post.author_id))];

    // Fetch profiles based on unique author_ids
    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", authorIds);

    if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return [];
    }

    // Create a map of author_id to full_name
    const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile.full_name || "unknown" as string;
        return acc;
    }, {} as Record<string, string>);

    // Map the data to include full_name and return the necessary fields
    return posts.map((post) => ({
        full_name: profileMap[post.author_id] || "unknown" as string,
        slug: post.slug,
        updatedAt: post.updated_at,
    })) as { full_name: string; slug: string; updatedAt: string }[];
}