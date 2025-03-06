'use client';

import { Avatar } from "../ui/avatar";
import { CalendarIcon, ClockIcon, MessageSquareIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import ReactionButton from "./ReactionButton";
import { Button } from "../ui/button";
import ArticleContent from "./ArticleContent";
import { CommentSection } from "./CommentSection";
import type { PostStatus, PostType, Profile } from "@/shared/types";
import ShareButton from "./ShareButton";
import { useEffect, useState } from "react";
import { useUser } from "@/shared/context/UserContext";
import { supabaseClient } from "@/shared/lib/supabase/client";
import ViewTracker from "./ViewTracker";

const ArticleInner = ({
    article,
    username,
    articleDate,
    articleReadTime,
    articleMode,
}: {
    article: PostType;
    username: string;
    articleDate: string;
    articleReadTime: string;
    articleMode: PostStatus;
}) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            setCurrentUserId(user?.id ?? null);

            // Fetch author profile
            const { data: authorProfile } = await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", article.author_id)
                .single();

            setProfile(authorProfile);
        };

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- empty dependency array ensures this runs only once

    return (
        <main className="container max-w-4xl mx-auto px-4 py-32">
            {articleMode === "published" &&
                <ViewTracker postId={article.id} />
            }
            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{article.title}</h1>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src={profile?.avatar_url ?? ''}
                                className="w-10 h-10 rounded-full object-cover mr-2"
                                fallback={profile?.full_name ?? ''}
                                alt="Author Avatar"
                            />
                            <div>
                                <a href={`/${username}`} className="font-medium text-lg hover:underline">
                                    {profile?.full_name || username}
                                </a>
                                <div className="text-sm text-muted-foreground">@{username}</div>
                            </div>
                        </div>

                        {articleMode === "published" &&
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
                        }
                    </div>
                </div>

                <Separator className="my-8" />

                {articleMode === "published" &&
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ReactionButton
                                postId={article.id}
                                initialLikes={article.likes}
                            />
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
                }
                <ArticleContent content={article.content} />

                {articleMode === "published" &&
                    <>
                        <Separator className="my-16" />
                        <CommentSection postId={article.id} userId={currentUserId!} />
                    </>
                }
            </div>
        </main>
    );
};

export { ArticleInner };
