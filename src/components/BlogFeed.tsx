"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Loader, MessageCircle, Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
  cover_image: string
  score?: number
}

const fetchPosts = async (page: number, tag?: string): Promise<BlogPost[]> => {
  const url = tag ? `/api/posts?page=${page}&post_limit=10&tag=${tag}` : `/api/posts?page=${page}&post_limit=10`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  return res.json()
}

export default function BlogFeed({ tag }: { tag?: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const newPosts = await fetchPosts(page, tag)
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        // Add deduplication logic to prevent duplicate posts
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id))
          const uniqueNewPosts = newPosts.filter((post) => !existingIds.has(post.id))
          return [...prevPosts, ...uniqueNewPosts]
        })
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [page, loading, hasMore, tag])

  useEffect(() => {
    // Only load posts on initial mount
    loadMorePosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once

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

  if (!initialLoad && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-neutral-800 p-6 mb-6">
          <Eye className="h-10 w-10 text-gray-400 dark:text-neutral-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2 dark:text-neutral-200">No posts found</h3>
        <p className="text-gray-500 dark:text-neutral-400 max-w-md mb-6">
          {tag ? `We couldn't find any posts with the tag "${tag}".` : "No posts are available at the moment."}
        </p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700"
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-2 md:px-8 lg:px-24 pb-12">
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/${post.author_full_name}/${post.slug}`}
          className="block transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg"
        >
          <Card className="overflow-hidden border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-gray-600 transition-transform duration-200 dark:bg-neutral-900">
            {index === 0 && post.cover_image && (
              <Image
                src={post.cover_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 object-cover"
                width={500}
                height={200}
              />
            )}
            <CardHeader className={cn("pb-2 pt-6 px-6", index === 0 && post.cover_image != null && "pt-2")}>
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

