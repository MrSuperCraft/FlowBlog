"use client"

import { SidebarProvider } from "@/shared/context/SidebarContext"
import DashboardLayout from "./DashboardLayout"
import type { Post, PostSummaryMetrics } from "@/shared/types"
import { useEffect, useState } from "react"
import { MetricsCards } from "./MetricsCards"
import { PostsTable } from "./PostsTable"
import { getPosts } from "@/actions/post"
import { createClient } from "@/shared/lib/supabase/client"
import { useUser } from "@/shared/context/UserContext"

const DashboardApp = () => {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [postMetrics, setPostMetrics] = useState<PostSummaryMetrics>({
    totalViews: 0,
    totalReactions: 0,
    totalComments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const fetchedPosts = await getPosts(user?.id as string)
      setPosts(
        fetchedPosts.map((post) => ({
          ...post,
          publishedAt: post.published_at ? new Date(post.published_at) : null,
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          authorId: post.author_id,
        })),
      )
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts(null)
    } finally {
      setIsLoading(false)
    }
  }



  useEffect(() => {
    async function getTotalMetrics() {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const user_id = user?.id!
      console.log("[getTotalMetrics] Fetching metrics for user:", user_id)

      // Correctly pass the named parameter
      const { data, error } = await supabase.rpc("sum_user_activity", { user_id })

      if (error) {
        console.error("[getTotalMetrics] Error fetching metrics:", error.message)
        setPostMetrics({ totalViews: 0, totalComments: 0, totalReactions: 0 })
      }
      // Now destructure data correctly
      const { views, comments, reactions } = (data && data[0]) || { views: 0, comments: 0, reactions: 0 }

      console.log({ views, comments, reactions })

      setPostMetrics({ totalViews: views, totalComments: comments, totalReactions: reactions })
    }
    getTotalMetrics()
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <SidebarProvider>
      <DashboardLayout>
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
          <div className="flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl flex-1">Dashboard</h2>
          </div>
          <MetricsCards metrics={postMetrics} />
          <div className="space-y-4">
            <PostsTable initialData={posts ?? []} isLoading={isLoading} onRefresh={fetchPosts} />
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  )
}

export default DashboardApp

