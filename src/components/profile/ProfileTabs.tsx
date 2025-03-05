"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

// Placeholder data for demonstration purposes
const posts = [
    {
        id: 1,
        title: "Sample Post Title One",
        excerpt: "Sample excerpt content for post one...",
        date: new Date("2024-02-22"),
        reactions: 10,
        comments: 5,
    },
    {
        id: 2,
        title: "Sample Post Title Two",
        excerpt: "Sample excerpt content for post two...",
        date: new Date("2024-02-20"),
        reactions: 20,
        comments: 3,
    },
]

const comments = [
    {
        id: 1,
        content: "This is a sample comment on a post.",
        postTitle: "Sample Post Title One",
        date: new Date("2024-02-23"),
    },
    {
        id: 2,
        content: "Another sample comment on a different post.",
        postTitle: "Sample Post Title Two",
        date: new Date("2024-02-21"),
    },
]


export function ProfileTabs() {
    const [, setActiveTab] = useState("posts")

    return (
        <Tabs defaultValue="posts" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="posts" className="bg-transparent active:border-b active:border">Posts</TabsTrigger>
                <TabsTrigger value="comments" className="bg-transparent active:border-b active:border">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                <Link href="#" className="hover:text-primary">
                                    {post.title}
                                </Link>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(post.date, { addSuffix: true })}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{post.excerpt}</p>
                            <div className="mt-4 text-sm text-muted-foreground">
                                {post.reactions} reactions • {post.comments} comments
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </TabsContent>
            <TabsContent value="comments" className="space-y-4">
                {comments.map((comment) => (
                    <Card key={comment.id}>
                        <CardHeader>
                            <CardTitle className="text-base font-normal">
                                <span className="text-muted-foreground">Commented on </span>
                                <Link href="#" className="font-medium hover:text-primary">
                                    {comment.postTitle}
                                </Link>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(comment.date, { addSuffix: true })}</p>
                        </CardHeader>
                        <CardContent>
                            <p>{comment.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </TabsContent>
        </Tabs>
    )
}

