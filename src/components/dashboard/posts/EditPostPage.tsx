"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Save, Send, Hash, ImageIcon, Upload } from "lucide-react"
import MarkdownEditor from "./MarkdownEditor"
import BlockNoteEditor from "./BlockNoteEditor"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { updatePost } from "@/actions/post"
import { useCreateBlockNote } from "@blocknote/react"
import { sanitizeMarkdown } from "@/shared/lib/utils"
import { useUser } from "@/shared/context/UserContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { uploadCoverImage, deleteCoverImage } from "@/actions/image"
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
import type { PostType, PostUpdate } from "@/shared/types"

export function EditPostPage({ postData }: { postData: PostType }) {
    const [post, setPost] = useState<PostType | null>(postData)
    const [title, setTitle] = useState(postData.title)
    const { profile } = useUser()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(postData.cover_image || null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isRemovingCoverImage, setIsRemovingCoverImage] = useState(false)

    const editor = useCreateBlockNote({
        trailingBlock: true,
    })

    const [tags, setTags] = useState<string[]>(postData.tags || [])
    const [currentTag, setCurrentTag] = useState("")
    const [markdownContent, setMarkdownContent] = useState(postData.content)
    const [blockNoteContent, setBlockNoteContent] = useState("")
    const MAX_TAGS = 5

    // Fetch post data
    useEffect(() => {
        setIsLoading(false)
    }, [])

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
        if (
            post &&
            (title !== post.title ||
                JSON.stringify(tags) !== JSON.stringify(post.tags) ||
                markdownContent !== post.content ||
                coverImage !== null ||
                (post.cover_image && !coverImageUrl))
        ) {
            setHasUnsavedChanges(true)
        } else {
            setHasUnsavedChanges(false)
        }
    }, [title, tags, markdownContent, blockNoteContent, coverImage, coverImageUrl, post])

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

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (limit to 5MB)
        if (file.size > 1 * 1024 * 1024) {
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
        if (coverImageUrl && !coverImageUrl.startsWith("blob:")) {
            // If there's an existing non-blob URL, keep track that we're replacing it
            setIsRemovingCoverImage(true)
        }

        const objectUrl = URL.createObjectURL(file)
        setCoverImageUrl(objectUrl)

        // Update unsaved changes flag
        setHasUnsavedChanges(true)
    }

    const handleRemoveCoverImage = async () => {
        if (post?.cover_image) {
            setIsRemovingCoverImage(true)
        }

        setCoverImage(null)
        if (post?.id) await deleteCoverImage(post.id);
        if (coverImageUrl) {
            if (coverImageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(coverImageUrl)
            }
            setCoverImageUrl(null)
        }

        setHasUnsavedChanges(true)
    }

    // Unified save handler for both published posts and drafts
    const handleSave = async (status?: "published" | "draft") => {
        if (!post) return

        if (title.trim() === "") {
            toast.error("The title cannot be left empty. Please add a title before saving.")
            return
        }

        setIsSubmitting(true)
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
            // Handle cover image changes
            let coverImagePath = post.cover_image

            // If removing existing cover image
            if (isRemovingCoverImage && post.cover_image) {
                try {
                    await deleteCoverImage(post.id)
                    coverImagePath = null
                } catch (error) {
                    console.error("Failed to delete cover image:", error)
                    toast.error("Failed to remove cover image, but post will be updated.")
                }
            }

            // If uploading new cover image
            if (coverImage) {
                setIsUploadingImage(true)
                try {
                    coverImagePath = await uploadCoverImage(coverImage, post.id)
                } catch (error) {
                    console.error("Failed to upload cover image:", error)
                    toast.error("Failed to upload cover image. Post will be saved without updating the cover image.")
                } finally {
                    setIsUploadingImage(false)
                }
            }

            // Prepare update data
            const updateData: PostUpdate = {
                title,
                tags,
                excerpt: sanitizeMarkdown(content).substring(0, 150) + "...",
                content,
                cover_image: coverImagePath,
                updated_at: new Date().toISOString(),
            }

            // Update status if provided
            if (status) {
                updateData.status = status
                if (status === "published" && post.status !== "published") {
                    updateData.published_at = new Date().toISOString()
                }
            }

            // Update post
            await updatePost(post.id, updateData)

            // Update local state
            setPost({
                ...post,
                ...updateData,
            })

            setHasUnsavedChanges(false)
            setIsRemovingCoverImage(false)

            toast.success("Post updated successfully!")
            const username = profile?.full_name
            router.push(`/${username}/${post.slug}`)

        } catch (error) {
            console.error("Failed to update post:", error)
            toast.error("Failed to update post. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
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


    const handlePublish = () => handleSave("published")
    const handleUpdate = () => handleSave()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Post not found</h2>
                <p className="text-muted-foreground mt-2">
                    The post you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
                </p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                </Button>
            </div>
        )
    }

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

            {/* Cover Image */}
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
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-2"
                                >
                                    Select Image
                                </Button>
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
                {post.status !== "published" ? (
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
                ) : (
                    <Button
                        className="flex-1 flex items-center gap-2"
                        disabled={!hasUnsavedChanges || isSubmitting || isUploadingImage}
                        onClick={handleUpdate}
                    >
                        {isSubmitting || isUploadingImage ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                {isUploadingImage ? "Uploading..." : "Updating..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Update Post
                            </>
                        )}
                    </Button>
                )}

                <Button variant="secondary" onClick={() => router.push("/dashboard")} className="flex-1">
                    Cancel
                </Button>
            </div>
        </div>
    )
}

