import { getProfileFromId, getProfileFromUsername } from "@/actions/user"
import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CalendarIcon,
    GlobeIcon,
    GithubIcon,
    MapPinIcon,
    BookIcon,
    MessageSquareIcon,
    HeartIcon,
    ClockIcon,
    EyeIcon,
    TagIcon,
    CornerDownRightIcon,
    ArrowRightIcon,
    Feather,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { ModeToggle } from "@/components/ThemeToggle"
import { getPost, getPosts } from "@/actions/post"
import { sanitizeMarkdown } from "@/shared/lib/utils"
import type { BlogPost, Comment, Profile } from "@/shared/types"
import { getUserComments } from "@/actions/comment"
import Image from "next/image"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params
    const cleanUser = decodeURIComponent(username)
    const profile: Profile | null = await getProfileFromUsername(cleanUser)

    if (!profile) {
        return {
            title: "User Not Found",
            description: "The requested user profile could not be found.",
            robots: "noindex, nofollow",
        }
    }

    // Use full_name if available
    const displayName = profile.full_name?.trim()
    const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${profile.full_name}`
    const bio = `${displayName ? `${displayName}'s profile on FlowBlog` : "A FlowBlog profile"}`
    // External Links (Only include if valid)
    const links: string[] = []
    if (profile.github) links.push(`GitHub: ${profile.github}`)
    if (profile.website) links.push(`Website: ${profile.website}`)
    const extraDescription = links.length ? ` | Explore more from ${displayName}: ${links.join(", ")}` : ""

    return {
        title: `${displayName} (@${(profile?.full_name as string).trim()})`,
        description: bio + extraDescription,
        alternates: {
            canonical: profileUrl,
        },
        openGraph: {
            title: `${displayName} (@${(profile?.full_name as string).trim()})`,
            description: bio,
            url: profileUrl,
            type: "profile",
            images: profile.avatar_url ? [{ url: profile.avatar_url, width: 800, height: 800 }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${displayName} (@${(profile?.full_name as string).trim()})`,
            description: bio,
            images: profile.avatar_url ? [profile.avatar_url] : undefined,
        },
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const profile = (await getProfileFromUsername(username)) as Profile | null

    if (!profile) {
        return notFound();
    }
    const posts = await getPosts(profile?.id as string, "published", true)
    const comments = await getUserComments(profile?.id as string)

    // Format the username for the avatar fallback
    const initials = profile.full_name
        ? profile.full_name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        : username.substring(0, 2).toUpperCase()

    return (
        <div>
            <Header>
                <ModeToggle />
            </Header>

            {/* Hero section with profile info */}
            <section className="bg-neutral-50 dark:bg-background pt-32 pb-10">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <Avatar
                            className="w-24 h-24 border-4 border-background shadow-sm"
                            src={profile.avatar_url || ""}
                            alt={profile.full_name || username}
                            fallback={initials}
                        />

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                            <p className="text-muted-foreground">@{profile.full_name?.replace(/\s+/g, "").toLowerCase()}</p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                {profile.location && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <GlobeIcon className="w-4 h-4 text-muted-foreground" />
                                        <Link
                                            href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline truncate"
                                        >
                                            {profile.website.replace(/^https?:\/\//, "")}
                                        </Link>
                                    </div>
                                )}
                                {profile.github && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <GithubIcon className="w-4 h-4 text-muted-foreground" />
                                        <Link
                                            href={`https://github.com/${profile.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {profile.github}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-6 md:gap-10 mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                    <BookIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{posts.length}</div>
                                    <div className="text-xs text-muted-foreground">Articles</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                    <MessageSquareIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{comments.length}</div>
                                    <div className="text-xs text-muted-foreground">Comments</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content section */}
            <section className="py-10">
                <div className="container max-w-6xl mx-auto px-4">
                    <Tabs defaultValue="articles" className="w-full">
                        <TabsList className="w-full max-w-md mx-auto mb-10 rounded-full p-1">
                            <TabsTrigger value="articles" className="flex-1 rounded-full">
                                <BookIcon className="w-4 h-4 mr-2" />
                                Articles
                            </TabsTrigger>
                            <TabsTrigger value="comments" className="flex-1 rounded-full">
                                <MessageSquareIcon className="w-4 h-4 mr-2" />
                                Comments
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="articles">
                            <div>
                                {posts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <BookIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                        <h3 className="text-xl font-medium mb-2">No articles yet</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            This user hasn&apos;t published any articles yet. Check back later for new content.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {/* Featured article - first article gets special treatment */}
                                        {posts.length > 0 && (
                                            <div className="mb-8">
                                                <FeaturedArticleCard article={posts[0]} username={username} />
                                            </div>
                                        )}

                                        {/* Remaining articles in horizontal layout */}
                                        {posts.length > 1 && (
                                            <div className="space-y-6">
                                                {posts.slice(1).map((article) => (
                                                    <HorizontalArticleCard key={article.id} article={article} username={username} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="comments">
                            <div>
                                {comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <MessageSquareIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                        <h3 className="text-xl font-medium mb-2">No comments yet</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            This user hasn&apos;t made any comments yet. Check back later for new activity.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {comments.map(async (comment: Comment) => {
                                            const post = await getPost(comment.post_id)

                                            return (
                                                <Card key={comment.id} className="group hover:shadow-md transition-all">
                                                    <CardHeader>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarIcon className="w-3 h-3" />
                                                                <time dateTime={comment.created_at}>
                                                                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    })}
                                                                </time>
                                                            </div>
                                                        </div>
                                                        <CardTitle className="mt-2 text-base flex items-center gap-2">
                                                            <CornerDownRightIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                            <a
                                                                href={`/${username}/${post.slug}`}
                                                                className="hover:text-primary transition-colors line-clamp-1"
                                                            >
                                                                On: {post.title}
                                                            </a>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <blockquote className="border-l-2 pl-4 italic text-muted-foreground line-clamp-2 text-sm">
                                                            {post.excerpt}
                                                        </blockquote>
                                                        <div className="relative bg-muted/30 p-4 mt-3 rounded-lg">
                                                            <div className="absolute -top-2 left-4 w-4 h-4 bg-muted/30 rotate-45"></div>
                                                            <p className="text-sm">{comment.text}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
            <footer className="bg-neutral-100 dark:bg-neutral-900 py-8 mt-16">
                <div className="container max-w-6xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <h2 className="text-lg font-bold flex gap-2"><Feather /> FlowBlog</h2>
                            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FlowBlog. All rights reserved.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/about" className="text-sm text-primary hover:underline">
                                About
                            </Link>
                            <Link href="/contact" className="text-sm text-primary hover:underline">
                                Contact
                            </Link>
                            <Link href="/privacy" className="text-sm text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-primary hover:underline">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Featured article component - large, prominent display for the first article
async function FeaturedArticleCard({ article, username }: { article: BlogPost; username: string }) {
    const readTime = Math.ceil(sanitizeMarkdown(article.content).split(" ").length / 200) || 1

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md group">
            <div className="md:flex">
                {article.cover_image && (
                    <div className="md:w-1/2 lg:w-2/5 overflow-hidden">
                        <div className="aspect-video md:h-full w-full relative">
                            <Image
                                src={article.cover_image || "/placeholder.svg"}
                                alt={article.title}
                                className="object-cover transition-transform group-hover:scale-105"
                                fill
                            />
                        </div>
                    </div>
                )}

                <div className={`flex flex-col ${article.cover_image ? "md:w-1/2 lg:w-3/5" : "w-full"}`}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                <time dateTime={article.published_at as string}>
                                    {new Date(article.published_at as string).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                <span>
                                    {readTime} {readTime === 1 ? "min" : "mins"}
                                </span>
                            </div>
                        </div>
                        <a href={`/${(await getProfileFromId(article.author_id))?.full_name as string}/${article.id}`}>
                            <CardTitle className="text-2xl md:text-3xl hover:text-primary transition-colors">
                                {article.title}
                            </CardTitle>
                        </a>
                    </CardHeader>

                    <CardContent className="flex-1 py-2">
                        <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 text-base">{article.excerpt}</p>

                        {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-4 mb-4 flex-wrap">
                                <TagIcon className="w-3 h-3 text-muted-foreground" />
                                {article.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="font-normal text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="text-sm border-t py-3 bg-muted/20 mt-auto">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <HeartIcon className="w-4 h-4 text-rose-500" />
                                    <span>{article.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquareIcon className="w-4 h-4 text-primary" />
                                    <span>{article.comments || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                                    <span>{article.views || 0}</span>
                                </div>
                            </div>

                            <a href={`/${username}/${article.slug}`} className="flex items-center gap-1 text-primary hover:underline">
                                <span className="flex gap-2 items-center">
                                    Read More
                                    <ArrowRightIcon className="w-3 h-3" />
                                </span>
                            </a>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    )
}

// Horizontal article card component for remaining articles
async function HorizontalArticleCard({ article, username }: { article: BlogPost; username: string }) {
    const readTime = Math.ceil(sanitizeMarkdown(article.content).split(" ").length / 200) || 1

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md group">
            <div className="flex flex-col sm:flex-row">
                {article.cover_image && (
                    <div className="sm:w-1/3 md:w-1/4 overflow-hidden">
                        <div className="aspect-video sm:h-full w-full relative">
                            <Image
                                src={article.cover_image || "/placeholder.svg"}
                                alt={article.title}
                                className="object-cover transition-transform group-hover:scale-105"
                                fill
                            />
                        </div>
                    </div>
                )}

                <div className={`flex flex-col ${article.cover_image ? "sm:w-2/3 md:w-3/4" : "w-full"}`}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <div className="flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                <time dateTime={article.published_at as string}>
                                    {new Date(article.published_at as string).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>
                            <span>&bull;</span>
                            <div className="flex items-center">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                <span>
                                    {readTime} {readTime === 1 ? "min" : "mins"}
                                </span>
                            </div>
                        </div>
                        <a href={`/${(await getProfileFromId(article.author_id))?.full_name as string}/${article.id}`}>
                            <CardTitle className="text-xl hover:text-primary transition-colors line-clamp-1">
                                {article.title}
                            </CardTitle>
                        </a>
                    </CardHeader>

                    <CardContent className="py-1">
                        <p className="text-muted-foreground line-clamp-2 text-sm">{article.excerpt}</p>

                        {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 mb-4 flex-wrap">
                                <TagIcon className="w-3 h-3 text-muted-foreground" />
                                {article.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="font-normal text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {article.tags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">+{article.tags.length - 3} more</span>
                                )}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="text-sm border-t py-2 bg-muted/20 mt-auto">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <HeartIcon className="w-4 h-4 text-rose-500" />
                                    <span>{article.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquareIcon className="w-4 h-4 text-primary" />
                                    <span>{article.comments || 0}</span>
                                </div>
                            </div>

                            <Link
                                href={`/${username}/${article.slug}`}
                                className="flex items-center gap-1 text-primary hover:underline text-xs"
                            >
                                <span className="flex gap-2 items-center">
                                    Read more
                                    <ArrowRightIcon className="w-3 h-3" />
                                </span>
                            </Link>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    )
}

