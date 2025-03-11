"use client"

import { getPosts } from "@/actions/post"
import ArticleAnalyticsSelector from "@/components/dashboard/analytics/ArticleAnalyticsSelector"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { SidebarProvider } from "@/shared/context/SidebarContext"
import { useUser } from "@/shared/context/UserContext"
import type { PostType } from "@/shared/types"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
    const [posts, setPosts] = useState<PostType[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useUser()

    useEffect(() => {
        async function fetchPosts() {
            if (!user?.id) return
            setLoading(true)
            try {
                const fetchedPosts = await getPosts(user.id, "published")
                setPosts(fetchedPosts)
            } catch (error) {
                console.error("Failed to fetch posts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [user?.id])

    return (
        <SidebarProvider>
            <DashboardLayout>
                <div className="container py-10 mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Article Analytics</h1>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            <div className="flex justify-between">
                                <Skeleton className="h-10 w-96" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-64 w-full" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <ArticleAnalyticsSelector posts={posts} />
                    )}
                </div>
            </DashboardLayout>
        </SidebarProvider>
    )
}

