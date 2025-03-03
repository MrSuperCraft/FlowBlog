"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import MarkdownEditor from "./MarkdownEditor"
import BlockNoteEditor from "./BlockNoteEditor"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { createPost } from "@/actions/post"
import { useCreateBlockNote } from "@blocknote/react"
import { sanitizeMarkdown } from "@/shared/lib/utils"
import { useUser } from "@/shared/context/UserContext"
import { useRouter } from "next/navigation"

export function CreateNewPostPage() {
    const [title, setTitle] = useState("")
    const { session } = useUser();
    const router = useRouter();
    const id = session?.user.id ?? ""


    const editor = useCreateBlockNote({
        trailingBlock: true
    })

    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState("")
    const [markdownContent, setMarkdownContent] = useState("")
    const [blockNoteContent, setBlockNoteContent] = useState("")

    const handleAddTag = () => {
        const trimmedTag = currentTag.trim().toLowerCase()
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags((prevTags) => [...prevTags, trimmedTag])
            setCurrentTag("")
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
        const slug = generateSlug(title)
        let content = markdownContent

        if (!content && blockNoteContent) {
            try {
                const blocks = JSON.parse(blockNoteContent)
                content = await editor.blocksToMarkdownLossy(blocks)
            } catch (error) {
                console.error("Failed to parse blockNoteContent:", error)
            }
        }

        try {
            await createPost({
                author_id: id,
                title,
                slug,
                tags,
                excerpt: sanitizeMarkdown(content).substring(0, 50) + "...",
                content,
                status,
                published_at: status === "published" ? new Date().toISOString() : null
            })

            if (status === "published") {
                const username = session?.user.user_metadata.name
                router.push(`/${username}/${slug}`)
            } else {
                // For drafts, you might want to update the UI with a confirmation
                console.log("Draft saved successfully")
            }
        } catch (error) {
            console.error("Failed to create post:", error)
        }
    }

    const handlePublish = () => handleSave("published")
    const handleDraft = () => handleSave("draft")

    return (
        <div className="container mx-auto max-w-4xl p-4 space-y-8">
            {/* Title Input */}
            <div className="relative">
                <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title"
                    className="w-full bg-transparent shadow-none border-none focus:ring-0 focus-visible:ring-0 placeholder:font-extrabold font-extrabold p-0"
                    style={{ fontSize: "3rem" }}
                />
                <Separator className="w-full h-0.5 rounded-full bg-primary/70" />
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add tags (press Enter to add)"
                        className="flex-grow"
                    />
                    <Button onClick={handleAddTag}>Add Tag</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-sm flex items-center cursor-pointer group"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveTag(tag)
                            }}
                        >
                            {tag}
                            <X className="ml-2 h-4 w-4 duration-300 transition-colors group-hover:text-red-500" />
                        </Badge>
                    ))}
                </div>
            </div>

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
                    <BlockNoteEditor
                        initialContent={blockNoteContent ?? " "}
                        onChange={setBlockNoteContent}
                    />
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <Button onClick={handlePublish} className="flex-1">
                    Publish Post
                </Button>
                <Button variant="secondary" onClick={handleDraft} className="flex-1">
                    Save Draft
                </Button>
            </div>
        </div>
    )
}
