"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Loader, MessageCircle, Share2, Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  published_at: string
  views: number
  likes: number
  comments: number
  author_full_name: string
  author_avatar_url: string
  tags: string[]
  score?: number
}

const fetchPosts = async (page: number): Promise<BlogPost[]> => {
  const res = await fetch(`/api/posts?page=${page}&post_limit=10`)
  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }
  return res.json()
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const newPosts = await fetchPosts(page)
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    loadMorePosts()
  }, [loadMorePosts])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        loadMorePosts()
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMorePosts, hasMore, loading])

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "recently"
    }
  }

  if (initialLoad) {
    return <PostSkeletons count={3} />
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4 pb-12">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/${post.author_full_name}/${post.slug}`}
          className="block transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg"
        >
          <Card className="overflow-hidden border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-gray-600 transition-transform duration-200 dark:bg-neutral-900">
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex items-center space-x-2 mb-3">
                <Avatar src={post.author_avatar_url} alt={post.author_full_name} fallback="User Avatar" />

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                    {post.author_full_name}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400 space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight line-clamp-2 dark:text-neutral-50">
                {post.title}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs text-gray-800 dark:text-neutral-300 bg-gray-200 dark:bg-neutral-800 rounded-xl cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        {tag}
                      </span>
                    ))}

                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <p className="text-gray-600 dark:text-neutral-300 leading-relaxed line-clamp-3 text-base tracking-wide">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex items-center space-x-4 text-gray-600 dark:text-neutral-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{post.views}</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full dark:hover:bg-neutral-800 dark:text-neutral-300"
                  tabIndex={-1}
                >
                  <Heart className="mr-1 h-4 w-4" />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full dark:hover:bg-neutral-800 dark:text-neutral-300"
                  tabIndex={-1}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  <span className="text-sm">{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full dark:hover:bg-neutral-800 dark:text-neutral-300"
                  tabIndex={-1}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}

      {!initialLoad && hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={(e) => {
              e.preventDefault()
              loadMorePosts()
            }}
            disabled={loading}
            variant="outline"
            className="min-w-[180px] dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-700"
          >
            {loading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-neutral-400 italic">
          You&apos;ve reached the end of the feed
        </div>
      )}
    </div>
  )
}

function PostSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4 animate-pulse">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden border-gray-200 dark:border-neutral-800 dark:bg-neutral-900">
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex items-center space-x-3 mb-3">
                <Skeleton className="w-8 h-8 rounded-full dark:bg-neutral-800" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 dark:bg-neutral-800" />
                  <Skeleton className="h-3 w-16 dark:bg-neutral-800" />
                </div>
              </div>
              <Skeleton className="h-7 w-full mb-2 dark:bg-neutral-800" />
              <Skeleton className="h-7 w-3/4 dark:bg-neutral-800" />
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <Skeleton className="h-4 w-full mb-2 dark:bg-neutral-800" />
              <Skeleton className="h-4 w-full mb-2 dark:bg-neutral-800" />
              <Skeleton className="h-4 w-2/3 dark:bg-neutral-800" />
            </CardContent>
            <CardFooter className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800">
              <Skeleton className="h-4 w-16 dark:bg-neutral-800" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16 rounded-full dark:bg-neutral-800" />
                <Skeleton className="h-8 w-16 rounded-full dark:bg-neutral-800" />
                <Skeleton className="h-8 w-8 rounded-full dark:bg-neutral-800" />
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

