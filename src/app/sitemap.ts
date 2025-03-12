import { getSitemapUsernamesAndPosts } from "@/actions/sitemap";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://yourdomain.com";
    const posts = await getSitemapUsernamesAndPosts();

    return [
        { url: `${baseUrl}/`, lastModified: new Date(), priority: 1 },
        ...posts.map((post) => ({ url: `${baseUrl}/${post.full_name}`, lastModified: new Date(), priority: 0.8 })),
        ...posts.map(({ full_name, slug, updatedAt }) => ({
            url: `${baseUrl}/${full_name}/${slug}`,
            lastModified: new Date(updatedAt),
            priority: 0.6
        })),
    ];
}
