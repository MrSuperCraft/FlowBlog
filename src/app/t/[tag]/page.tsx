import BlogFeed from "@/components/BlogFeed";
import { Header } from "@/components/Header";
import LandingSidebar from "@/components/LandingSidebar";
import RightContent from "@/components/RightContent";
import { ModeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag); // Ensure readability

    return {
        title: `#${decodedTag}`,
        description: `Explore blog posts tagged with #${decodedTag} on FlowBlog. Read insights from developers, tech enthusiasts, and writers sharing their knowledge and experiences.`,
        keywords: [
            decodedTag,
            `${decodedTag} blogs`,
            `${decodedTag} articles`,
            `${decodedTag} posts`,
            "FlowBlog",
            "developer blogging",
            "technical articles",
            "developer journals"
        ],
        openGraph: {
            title: `#${decodedTag}`,
            description: `Browse the latest blog posts tagged #${decodedTag} on FlowBlog. Stay updated with insights and technical discussions.`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/t/${decodedTag}`,
            siteName: "FlowBlog",
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image`,
                    width: 1200,
                    height: 630,
                    alt: `FlowBlog - Posts tagged #${decodedTag}`
                }
            ],
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            site: "@ItamarHanan",
            title: `#${decodedTag}`,
            description: `Discover the latest discussions and insights on FlowBlog under the #${decodedTag} tag.`,
            images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-image`]
        }
    };
}


export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <Header>
                        <ModeToggle />
                    </Header>
                </div>
            </header>
            <main className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="hidden md:flex md:col-span-2 lg:col-span-1">
                    <LandingSidebar />
                </div>
                <div className="md:col-span-2">
                    {/* Tag Header Container */}
                    <div className="bg-muted border border-border rounded-lg shadow-sm p-6 relative">
                        {/* Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-primary rounded-t-lg" />

                        {/* Tag Title */}
                        <h1 className="text-lg md:text-xl lg:text-3xl font-semibold text-foreground">
                            Content Tagged With <span className="text-primary">#{tag}</span>
                        </h1>

                        <Separator className="w-full h-0.5 rounded-full my-4" />
                    </div>

                    <Separator className="w-full h-0.5 rounded-full my-4" />
                    <BlogFeed tag={tag} />
                </div>
                <div className="hidden lg:flex lg:col-span-1">
                    <RightContent />
                </div>
            </main>
        </div>
    );
}
