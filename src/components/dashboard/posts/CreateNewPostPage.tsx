"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Save, Send, Hash } from "lucide-react"
import MarkdownEditor from "./MarkdownEditor"
import BlockNoteEditor from "./BlockNoteEditor"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { createPost } from "@/actions/post"
import { useCreateBlockNote } from "@blocknote/react"
import { sanitizeMarkdown } from "@/shared/lib/utils"
import { useUser } from "@/shared/context/UserContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"

export function CreateNewPostPage() {
    const [title, setTitle] = useState("")
    const { user } = useUser()
    const router = useRouter()
    const id = user?.id ?? ""
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const editor = useCreateBlockNote({
        trailingBlock: true,
    })

    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState("")
    const [markdownContent, setMarkdownContent] = useState("")
    const [blockNoteContent, setBlockNoteContent] = useState("")
    const MAX_TAGS = 5

    // Track unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                return ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [hasUnsavedChanges])

    // Update unsaved changes flag
    useEffect(() => {
        if (title || tags.length > 0 || markdownContent || blockNoteContent) {
            setHasUnsavedChanges(true)
        }
    }, [title, tags, markdownContent, blockNoteContent])

    const handleAddTag = () => {
        const trimmedTag = currentTag.trim().toLowerCase()
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < MAX_TAGS) {
            setTags((prevTags) => [...prevTags, trimmedTag])
            setCurrentTag("")
        } else if (tags.length >= MAX_TAGS) {
            toast.error(`You can only add up to ${MAX_TAGS} tags`)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
    }

    const generateSlug = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        const identifier = Math.random().toString(36).substring(2, 9)
        return `${slug}-${identifier}`
    }

    // Unified save handler for both published posts and drafts.
    const handleSave = async (status: "published" | "draft") => {
        if (title.trim() === "") {
            toast.error("The title cannot be left empty. Please add a title before saving.")
            return
        }

        setIsSubmitting(true)
        const slug = generateSlug(title)
        let content = markdownContent

        if (!content && blockNoteContent) {
            try {
                const blocks = JSON.parse(blockNoteContent)
                content = await editor.blocksToMarkdownLossy(blocks)
            } catch (error) {
                console.error("Failed to parse blockNoteContent:", error)
                toast.error("Failed to process content. Please try again.")
                setIsSubmitting(false)
                return
            }
        }

        if (!content) {
            toast.error("Please add some content to your post before saving.")
            setIsSubmitting(false)
            return
        }

        try {
            await createPost({
                author_id: id,
                title,
                slug,
                tags,
                excerpt: sanitizeMarkdown(content).substring(0, 150) + "...",
                content,
                status,
                published_at: status === "published" ? new Date().toISOString() : null,
            })

            setHasUnsavedChanges(false)

            if (status === "published") {
                toast.success("Post published successfully!")
                const username = user?.user_metadata.name
                router.push(`/${username}/${slug}`)
            } else {
                toast.success("Draft saved successfully!")
                const username = user?.user_metadata.name
                router.push(`/${username}/${slug}`)

            }
        } catch (error) {
            console.error("Failed to create post:", error)
            toast.error("Failed to save post. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePublish = () => handleSave("published")
    const handleDraft = () => handleSave("draft")

    return (
        <div className="container mx-auto max-w-5xl p-4 space-y-8">
            {/* Title Input */}
            <div className="relative">
                <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title"
                    className="w-full bg-transparent shadow-none border-none focus:ring-0 focus-visible:ring-0 placeholder:font-extrabold font-extrabold p-0"
                    style={{ fontSize: "3rem" }}
                    maxLength={100}
                />
                <div className="flex justify-between items-center">
                    <Separator className="w-full h-0.5 rounded-full bg-primary/70" />
                    <span className="text-sm text-muted-foreground ml-2">{title.length}/100</span>
                </div>
            </div>

            {/* Tags Input */}
            <Card className="mb-8">
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Tags</span>
                        <span className="text-xs text-muted-foreground ml-2">
                            ({tags.length}/{MAX_TAGS})
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add tags (press Enter to add)"
                            className="flex-grow w-full max-w-3xs"
                            maxLength={20}
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddTag}
                            disabled={tags.length >= MAX_TAGS}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                            <div
                                key={tag}
                            >
                                <Badge
                                    variant="secondary"
                                    className="text-sm flex items-center cursor-pointer group px-3 py-1"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveTag(tag)
                                    }}
                                >
                                    {tag}
                                    <X className="ml-2 h-3 w-3 duration-300 transition-colors group-hover:text-red-500" />
                                </Badge>
                            </div>
                        ))}
                        {tags.length === 0 && (
                            <span className="text-sm text-muted-foreground">
                                No tags added yet. Tags help readers discover your content.
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* Content Editor Tabs */}
            <Tabs defaultValue="markdown" className="w-full">
                <TabsList>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    <TabsTrigger value="blocknote">BlockNote</TabsTrigger>
                </TabsList>
                <TabsContent value="markdown">
                    <MarkdownEditor value={markdownContent} onChange={setMarkdownContent} />
                </TabsContent>
                <TabsContent value="blocknote">
                    <BlockNoteEditor initialContent={blockNoteContent ?? " "} onChange={setBlockNoteContent} />
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="flex-1 flex items-center gap-2" disabled={isSubmitting}>
                            <Send className="h-4 w-4" />
                            Publish Post
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Publish this post?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will make your post visible to everyone. Are you sure you want to publish it now?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Button
                    variant="secondary"
                    onClick={handleDraft}
                    className="flex-1 flex items-center gap-2"
                    disabled={isSubmitting}
                >
                    <Save className="h-4 w-4" />
                    Save Draft
                </Button>
            </div>
        </div>
    )
}

