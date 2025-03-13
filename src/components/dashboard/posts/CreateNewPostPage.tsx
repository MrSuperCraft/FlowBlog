"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Save, Send, Hash, Upload, ImageIcon } from "lucide-react"
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
import Image from "next/image"
import { uploadCoverImage } from "@/actions/image"
import { v4 as uuidv4 } from 'uuid';


export function CreateNewPostPage() {
    const [title, setTitle] = useState("")
    const { user, profile } = useUser()
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

    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

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
        if (title || tags.length > 0 || markdownContent || blockNoteContent || coverImage) {
            setHasUnsavedChanges(true)
        }
    }, [title, tags, markdownContent, blockNoteContent, coverImage])

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

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (limit to 1MB)
        if (file.size > 1024 * 1024) {
            toast.error("Image size must be less than 1MB")
            return
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            toast.error("File must be an image")
            return
        }

        setCoverImage(file)

        // Create a preview URL
        const objectUrl = URL.createObjectURL(file)
        setCoverImageUrl(objectUrl)

        // Update unsaved changes flag
        setHasUnsavedChanges(true)
    }

    const handleRemoveCoverImage = () => {
        setCoverImage(null)
        if (coverImageUrl) {
            URL.revokeObjectURL(coverImageUrl)
            setCoverImageUrl(null)
        }
        setHasUnsavedChanges(true)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setCoverImageUrl(URL.createObjectURL(file)); // For preview
        }
    };


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

        // Generate a temporary ID for the post to use in the image path
        const newId = uuidv4();
        try {
            // Upload cover image if exists
            let coverImagePath = null
            if (coverImage) {
                setIsUploadingImage(true)
                try {
                    coverImagePath = await uploadCoverImage(coverImage, newId)
                } catch (error) {
                    console.error("Failed to upload cover image:", error)
                    toast.error("Failed to upload cover image. Post will be saved without a cover image.")
                    return;
                } finally {
                    setIsUploadingImage(false)
                }
            }

            await createPost({
                id: newId,
                author_id: id,
                title,
                slug,
                tags,
                excerpt: sanitizeMarkdown(content).substring(0, 150) + "...",
                content,
                status,
                published_at: status === "published" ? new Date().toISOString() : null,
                cover_image: coverImagePath, // Add the cover image URL
            })

            setHasUnsavedChanges(false)

            if (status === "published") {
                toast.success("Post published successfully!")
                const username = profile?.full_name
                router.push(`/${username}/${slug}`)
            } else {
                toast.success("Draft saved successfully!")
                const username = profile?.full_name
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

            <Card className="mb-8">
                <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                        <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Cover Image</span>
                    </div>

                    {coverImageUrl ? (
                        <div className="relative">
                            <div className="aspect-video w-full relative rounded-md overflow-hidden border">
                                <Image
                                    src={coverImageUrl || "/placeholder.svg"}
                                    alt="Cover image preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full p-2 h-8 w-8"
                                onClick={handleRemoveCoverImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="border border-dashed rounded-md p-8 text-center relative cursor-pointer"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("cover-image-upload")?.click()}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm font-medium">Drag and drop or click to upload</p>
                                <p className="text-xs text-muted-foreground">Recommended size: 1200 × 675 pixels (16:9 ratio)</p>
                                <p className="text-xs text-muted-foreground">Maximum size: 1MB</p>
                                <label htmlFor="cover-image-upload" className="cursor-pointer">
                                    <Button variant="secondary" size="sm" className="mt-2 cursor-pointer">
                                        Select Image
                                    </Button>
                                </label>
                                <Input
                                    id="cover-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="sr-only"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

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
                        <Button variant="secondary" size="sm" onClick={handleAddTag} disabled={tags.length >= MAX_TAGS}>
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                            <div key={tag}>
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
                        <Button className="flex-1 flex items-center gap-2" disabled={isSubmitting || isUploadingImage}>
                            {isSubmitting || isUploadingImage ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                    {isUploadingImage ? "Uploading..." : "Publishing..."}
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Publish Post
                                </>
                            )}
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
                    disabled={isSubmitting || isUploadingImage}
                >
                    {isSubmitting || isUploadingImage ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            {isUploadingImage ? "Uploading..." : "Saving..."}
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Draft
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

