"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { getPostBySlug } from "@/actions/post"
import type { PostType } from "@/shared/types"
import { Header } from "@/components/Header"
import { ModeToggle } from "@/components/ThemeToggle"
import { sanitizeMarkdown } from "@/shared/lib/utils"
import { ArticleInner } from "@/components/articles/ArticleInner"
import { useUser } from "@/shared/context/UserContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ArticlePage = () => {
    const [article, setArticle] = useState<PostType | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [unauthorized, setUnauthorized] = useState(false)
    const router = useRouter()
    const { user, loading: authLoading } = useUser() // Get current authenticated user

    useEffect(() => {
        const username = window.location.pathname.split("/")[1]
        const slug = window.location.pathname.split("/")[2]

        if (!slug || typeof username !== "string") {
            notFound();
        }

        setUsername(username)

        const fetchArticle = async () => {
            try {
                setLoading(true)
                const fetchedArticle = await getPostBySlug(slug)

                if (!fetchedArticle) {
                    notFound();
                }

                // Check if article is published or if current user is the author
                const isPublished = fetchedArticle.status === "published"
                const isAuthor = user && user.id === fetchedArticle.author_id

                if (isPublished || isAuthor) {
                    setArticle(fetchedArticle)
                } else {
                    // Article exists but user is not authorized to view it
                    setUnauthorized(true)
                }
            } catch (error) {
                console.error("Error fetching article:", error)
                notFound();
            } finally {
                setLoading(false)
            }
        }

        // Only fetch the article once auth state is determined
        if (!authLoading) {
            fetchArticle()
        }
    }, [router, user, authLoading])

    // Show loading state while fetching article or checking auth
    if (loading || authLoading) {
        return (
            <>
                <Header>
                    <ModeToggle />
                </Header>
                <div className="container max-w-4xl mx-auto px-4 py-32 animate-pulse">
                    {/* Title */}
                    <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full w-3/4 mb-4"></div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                            <div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-24"></div>
                                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16 mt-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
                        </div>
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full w-10"></div>
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full w-12"></div>
                    </div>

                    {/* Article Content Placeholder */}
                    <div className="space-y-4">
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-full"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-full"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-5/6"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-3/4"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-full"></div>
                    </div>
                </div>
            </>
        )
    }

    // Show unauthorized message
    if (unauthorized) {
        return (
            <>
                <Header>
                    <ModeToggle />
                </Header>
                <div className="container mx-auto h-screen py-32 text-center">
                    <h1 className="text-2xl font-bold mb-4">Article Not Available</h1>
                    <p className="flex flex-col justify-center">Guess you wandered too far. Do you want to go back? <Link href='/'><Button variant="default" className="mt-4">Click Here.</Button></Link></p>
                </div>
            </>
        )
    }

    // If article is null at this point, return null (should not happen due to redirects)
    if (!article) return null

    const articleDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "Unknown Date"

    const articleReadTime = Math.ceil(sanitizeMarkdown(article.content).split(/\s+/).length / 200) + " minute read"

    return (
        <>
            <Header>
                <ModeToggle />
            </Header>
            {article.status !== "published" && (
                <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 mt-14 text-center">
                    You&apos;re viewing {article.status === "draft" ? "a drafted" : "an archived"} article. This is only visible to you as the author.
                </div>
            )}

            <ArticleInner
                article={article}
                articleMode={article.status}
                articleDate={articleDate}
                username={username ?? ""}
                articleReadTime={articleReadTime}
            />
        </>
    )
}

export default ArticlePage

