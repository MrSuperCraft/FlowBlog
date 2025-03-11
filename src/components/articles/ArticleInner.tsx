"use client"

import { Avatar } from "../ui/avatar"
import { CalendarIcon, ClockIcon, MessageSquareIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import ReactionButton from "./ReactionButton"
import { Button } from "../ui/button"
import ArticleContent from "./ArticleContent"
import { CommentSection } from "./CommentSection"
import type { PostStatus, PostType, Profile } from "@/shared/types"
import ShareButton from "./ShareButton"
import { useEffect, useState } from "react"
import { useUser } from "@/shared/context/UserContext"
import { supabaseClient } from "@/shared/lib/supabase/client"
import ViewTracker from "./ViewTracker"
import Image from "next/image"

const ArticleInner = ({
    article,
    username,
    articleDate,
    articleReadTime,
    articleMode,
}: {
    article: PostType
    username: string
    articleDate: string
    articleReadTime: string
    articleMode: PostStatus
}) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const { user } = useUser()

    useEffect(() => {
        const fetchUserData = async () => {
            setCurrentUserId(user?.id ?? null)

            // Fetch author profile
            const { data: authorProfile } = await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", article.author_id)
                .single()

            setProfile(authorProfile)
        }

        fetchUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // <-- empty dependency array ensures this runs only once

    return (
        <main className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
            {articleMode === "published" && <ViewTracker postId={article.id} />}

            <div className="space-y-8">
                {/* Article Header */}
                <div className="space-y-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{article.title}</h1>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src={profile?.avatar_url ?? ""}
                                className="w-10 h-10 rounded-full object-cover mr-2"
                                fallback={profile?.full_name ?? ""}
                                alt="Author Avatar"
                            />
                            <div>
                                <a href={`/${username}`} className="font-medium text-lg hover:underline">
                                    {profile?.full_name || username}
                                </a>
                                <div className="text-sm text-muted-foreground">@{username}</div>
                            </div>
                        </div>

                        {articleMode === "published" && (
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    <span>{articleDate}</span>
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="mr-1 h-4 w-4" />
                                    <span>{articleReadTime}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                {article.cover_image && (
                    <div className="relative w-full overflow-hidden rounded-lg shadow-md">
                        <div className="relative w-full" style={{ paddingTop: '56.25%' /* This is for a 16:9 aspect ratio */ }}>
                            <Image
                                src={article.cover_image || "/placeholder.svg"}
                                alt={`Cover image for ${article.title}`}
                                className="object-cover absolute top-0 left-0"
                                layout="fill"  // This makes the image fill the container while maintaining the aspect ratio
                            />
                        </div>
                    </div>
                )}


                <Separator className="my-6" />

                {/* Article Actions */}
                {articleMode === "published" && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ReactionButton postId={article.id} initialLikes={article.likes} />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center"
                                iconBefore={<MessageSquareIcon className="h-4 w-4" />}
                            >
                                {article.comments}
                            </Button>
                        </div>

                        <ShareButton />
                    </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ArticleContent content={article.content} />
                </div>

                {/* Comments Section */}
                {articleMode === "published" && (
                    <>
                        <Separator className="my-12" />
                        <CommentSection postId={article.id} userId={currentUserId!} />
                    </>
                )}
            </div>
        </main>
    )
}

export { ArticleInner }

