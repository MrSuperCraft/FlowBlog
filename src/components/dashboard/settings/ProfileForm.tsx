"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { User2, Loader2, Camera, MapPin, Github, Globe, Mail, X, Check } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateProfile, uploadAvatar } from "@/actions/user"
import { Profile } from "@/shared/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUser } from "@/shared/context/UserContext"

// Define the form schema with validation using full_name
const profileFormSchema = z.object({
    full_name: z
        .string()
        .min(3, {
            message: "Full name must be at least 3 characters.",
        })
        .max(50, {
            message: "Full name cannot exceed 50 characters.",
        })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Full name can only contain letters, numbers, underscores, and hyphens.",
        }),
    location: z.string().max(100).optional().or(z.literal("")),
    github: z.string().max(100).optional().or(z.literal("")),
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    initialProfile: Profile
    userEmail: string
}

export default function ProfileForm({ initialProfile, userEmail }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile.avatar_url || null)
    const [uploadHover, setUploadHover] = useState(false)
    const router = useRouter()
    const { user } = useUser();

    // Initialize the form with default values
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            full_name: initialProfile.full_name || "",
            location: initialProfile.location || "",
            github: initialProfile.github || "",
            website: initialProfile.website || "",
        },
    })

    // Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid file type", { description: "Please upload a JPEG, PNG or WebP image." })
            return
        }

        // Validate file size (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
            toast.error("File Too Large", { description: "Image must be less than 1MB." })
            return
        }

        setAvatarFile(file)

        // Create a preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    // Handle form submission
    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)

        try {
            let avatarUrl = initialProfile.avatar_url

            // Upload avatar if a new one was selected
            if (avatarFile) {
                const uploadResult = await uploadAvatar(initialProfile.id, avatarFile)

                if (uploadResult.error) {
                    throw new Error(uploadResult.error)
                }

                if (uploadResult.url) {
                    avatarUrl = uploadResult.url
                }
            }

            // Update profile with form data and new avatar URL
            const result = await updateProfile(user?.id as string, {
                id: initialProfile.id,
                ...data,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            })

            if (result.error) {
                throw new Error(result.error)
            }

            toast.success("Profile updated", { description: "Your profile has been updated successfully." })

            // Refresh the page to show updated data
            router.refresh()
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Error", { description: error instanceof Error ? error.message : "Failed to update profile" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="personal" className="w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Profile Settings</h2>
                            <p className="text-muted-foreground">Manage how your profile appears to others</p>
                        </div>
                        <TabsList className="grid w-full sm:w-auto grid-cols-2 h-auto p-1">
                            <TabsTrigger value="personal" className="px-4 py-2">Personal Info</TabsTrigger>
                            <TabsTrigger value="social" className="px-4 py-2">Social Links</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="personal" className="space-y-6 mt-0">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                {/* Profile Header with Avatar */}
                                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 mb-8">
                                    <div
                                        className="relative group"
                                        onMouseEnter={() => setUploadHover(true)}
                                        onMouseLeave={() => setUploadHover(false)}
                                    >
                                        <div className={cn(
                                            "h-32 w-32 rounded-full overflow-hidden border-4 border-background transition-all duration-200",
                                            uploadHover ? "opacity-80" : "opacity-100"
                                        )}>
                                            {avatarPreview ? (
                                                <Image
                                                    src={avatarPreview || "/placeholder.svg"}
                                                    alt="Avatar"
                                                    width={128}
                                                    height={128}
                                                    className="object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <User2 className="h-16 w-16 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <label
                                            htmlFor="avatar"
                                            className={cn(
                                                "absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-200",
                                                uploadHover ? "opacity-100" : "opacity-0"
                                            )}
                                        >
                                            <div className="bg-black/50 flex items-center justify-center h-full w-full rounded-full">
                                                <Camera className="h-8 w-8 text-white" />
                                            </div>
                                            <input
                                                id="avatar"
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={handleAvatarChange}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>

                                    <div className="space-y-2 text-center sm:text-left">
                                        <h3 className="text-xl font-medium">
                                            {form.watch("full_name") || "Your Profile"}
                                        </h3>
                                        <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            {userEmail}
                                        </p>
                                        {form.watch("location") && (
                                            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {form.watch("location")}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Upload a photo (JPEG, PNG or WebP, max 1MB)
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Email (read-only) */}
                                    <FormItem className="space-y-2">
                                        <FormLabel htmlFor="email" className="text-sm font-medium">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={userEmail}
                                                    disabled
                                                    className="pl-10 bg-muted/50"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Your email address is associated with your account and cannot be changed here.
                                        </FormDescription>
                                    </FormItem>

                                    {/* username */}
                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-0.5">
                                                <FormLabel className="text-sm font-medium">Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your username"
                                                        {...field}
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    This is your publicly displayed username.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Location */}
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-sm font-medium">Location</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="San Francisco, CA"
                                                            {...field}
                                                            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Where you&apos;re based (optional).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-6 mt-0">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="grid gap-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-muted/30 rounded-lg">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                            <Globe className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h3 className="font-medium">Connect Your Online Presence</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Add your social links to help others connect with you
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {/* GitHub */}
                                        <FormField
                                            control={form.control}
                                            name="github"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-medium">GitHub</FormLabel>
                                                    <div className="relative">
                                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <FormControl>
                                                            <Input
                                                                placeholder="username"
                                                                {...field}
                                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormDescription className="text-xs">
                                                        Your GitHub username (optional).
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Website */}
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-medium">Website</FormLabel>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <FormControl>
                                                            <Input
                                                                placeholder="https://example.com"
                                                                {...field}
                                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormDescription className="text-xs">
                                                        Your personal website (optional).
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[120px] gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    )
}