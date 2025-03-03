import { Avatar } from "../ui/avatar"
import { CalendarIcon, ClockIcon, MessageSquareIcon, ShareIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import ReactionButton from "./ReactionButton"
import { Button } from "../ui/button"
import ArticleContent from "./ArticleContent"
import { CommentSection } from "./CommentSection"
import type { PostType, Profile } from "@/types"
import ShareButton from "./ShareButton"

const ArticleInner = ({
    article,
    authorProfile,
    username,
    articleDate,
    articleReadTime,
    initiallyLiked,
    currentUserId,
}: {
    article: PostType
    authorProfile: Profile
    username: string
    articleDate: string
    articleReadTime: string
    initiallyLiked: boolean
    currentUserId: string | null
}) => {
    return (
        <main className="container max-w-4xl mx-auto px-4 py-32">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{article.title}</h1>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src={authorProfile.avatar_url!}
                                className="w-10 h-10 rounded-full object-cover mr-2"
                                fallback={authorProfile.full_name!}
                                alt="Author Avatar"
                            />
                            <div>
                                <a href={`/${username}`} className="font-medium text-lg hover:underline">
                                    {authorProfile.full_name || username}
                                </a>
                                <div className="text-sm text-muted-foreground">@{username}</div>
                            </div>
                        </div>

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
                    </div>
                </div>

                {/* {article.coverImage && (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    className="object-cover"
                  />
                </div>
              )}  */}

                <Separator className="my-8" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ReactionButton
                            postId={article.id}
                            initialLikes={article.likes}
                            initiallyLiked={initiallyLiked as boolean}
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

                <article className="prose max-w-none dark:prose-invert prose-sm md:prose-base lg:prose-lg">
                    <ArticleContent content={article.content} />
                </article>

                <Separator className="my-16" />

                <CommentSection postId={article.id} userId={currentUserId!} />
            </div>
        </main>
    )
}

export { ArticleInner }

