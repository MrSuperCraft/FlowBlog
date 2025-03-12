import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/api/", "/dashboard/", "/sign-in", "/sign-up"],
            },
        ],
        sitemap: "https://yourdomain.com/sitemap.xml",
    };
}
