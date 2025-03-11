"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowUpDown, Calendar, Eye, BarChart3, TrendingUp, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import type { PostType } from "@/shared/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ArticleAnalyticsSelectorProps {
    posts: PostType[]
}

type SortOption = "newest" | "oldest" | "mostViews" | "leastViews" | "mostComments"

const ArticleAnalyticsSelector: React.FC<ArticleAnalyticsSelectorProps> = ({ posts }) => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [filteredPosts, setFilteredPosts] = useState<PostType[]>(posts)
    const [selectedView, setSelectedView] = useState<"grid" | "list">("grid")

    // Add mock analytics to posts
    const postsWithAnalytics = filteredPosts.map((post) => ({
        ...post,
        views: post.views || 0,
        comments: post.comments || 0,
        likes: post.likes || 0,
        publishedAt: post.published_at ? new Date(post.published_at) : new Date(),
    }))

    // Filter and sort posts when dependencies change
    useEffect(() => {
        let result = [...posts]

        // Apply search filter
        if (searchQuery) {
            result = result.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        // Apply sorting
        result = sortPosts(result, sortBy)

        setFilteredPosts(result)
    }, [posts, searchQuery, sortBy])

    // Sort posts based on selected option
    const sortPosts = (postsToSort: PostType[], sortOption: SortOption) => {
        switch (sortOption) {
            case "newest":
                return [...postsToSort].sort(
                    (a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime(),
                )
            case "oldest":
                return [...postsToSort].sort(
                    (a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime(),
                )
            case "mostViews":
                return [...postsToSort].sort((a, b) => (b.views || 0) - (a.views || 0))
            case "leastViews":
                return [...postsToSort].sort((a, b) => (a.views || 0) - (b.views || 0))
            case "mostComments":
                return [...postsToSort].sort((a, b) => (b.comments || 0) - (a.comments || 0))
            default:
                return postsToSort
        }
    }

    // Navigate to article analytics page
    const viewArticleAnalytics = (postId: string) => {
        router.push(`/dashboard/analytics/${postId}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search articles..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Tabs defaultValue="grid" onValueChange={(value) => setSelectedView(value as "grid" | "list")}>
                        <TabsList className="grid w-24 grid-cols-2">
                            <TabsTrigger value="grid">Grid</TabsTrigger>
                            <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest first</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest first</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("mostViews")}>Most views</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("leastViews")}>Least views</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("mostComments")}>Most comments</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {postsWithAnalytics.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No articles found</p>
                </div>
            ) : selectedView === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {postsWithAnalytics.map((post) => (
                        <Card
                            key={post.id}
                            className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                            onClick={() => viewArticleAnalytics(post.id)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 line-clamp-2">{post.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">
                                    {post.excerpt || "View analytics for this article"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col items-center rounded-md border p-2">
                                        <Eye className="mb-1 h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-semibold">{post.views.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">Views</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-md border p-2">
                                        <MessageSquare className="mb-1 h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-semibold">{post.comments.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">Comments</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-md border p-2">
                                        <TrendingUp className="mb-1 h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-semibold">{post.likes.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">Likes</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button variant="secondary" className="w-full">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Analytics
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {postsWithAnalytics.map((post) => (
                        <Card
                            key={post.id}
                            className="cursor-pointer overflow-hidden transition-all hover:shadow-md"
                            onClick={() => viewArticleAnalytics(post.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-1 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold line-clamp-1 mb-1">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {post.excerpt || "View analytics for this article"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 p-4 border-t md:border-t-0 md:border-l">
                                    <div className="flex flex-col items-center px-3">
                                        <div className="flex items-center">
                                            <Eye className="mr-1 h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{post.views.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Views</span>
                                    </div>
                                    <div className="flex flex-col items-center px-3">
                                        <div className="flex items-center">
                                            <MessageSquare className="mr-1 h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{post.comments.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Comments</span>
                                    </div>
                                    <div className="flex flex-col items-center px-3">
                                        <div className="flex items-center">
                                            <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{post.likes.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Likes</span>
                                    </div>
                                    <Button variant="secondary" size="sm" className="ml-2">
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        Analytics
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ArticleAnalyticsSelector

