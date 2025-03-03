"use client"

import { useState } from "react"
import { Facebook, Linkedin, LinkIcon, Mail, ShareIcon, Twitter, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/shared/lib/utils"

interface ShareButtonProps {
    url?: string
    title?: string
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export default function ShareButton({
    url = typeof window !== "undefined" ? window.location.href : "",
    title = "Check out this page",
    className,
    size = "sm",
    variant = "ghost",
}: ShareButtonProps) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const shareOptions = [
        {
            name: "Twitter",
            icon: <Twitter className="h-4 w-4" />,
            onClick: () => {
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                    "_blank",
                )
            },
        },
        {
            name: "Facebook",
            icon: <Facebook className="h-4 w-4" />,
            onClick: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
            },
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-4 w-4" />,
            onClick: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
            },
        },
        {
            name: "Email",
            icon: <Mail className="h-4 w-4" />,
            onClick: () => {
                window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, "_blank")
            },
        },
    ]

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size} className={cn("", className)}>
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Share this page</DialogTitle>
                    <DialogDescription>Choose how you want to share this content</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {shareOptions.map((option) => (
                            <Button
                                key={option.name}
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-12"
                                onClick={() => {
                                    option.onClick()
                                    setOpen(false)
                                }}
                            >
                                {option.icon}
                                <span>{option.name}</span>
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-grow min-w-0">
                            <div className="w-full rounded-md border px-3 py-2 text-sm">
                                <span className="block truncate">{url}</span>
                            </div>
                        </div>
                        <Button onClick={copyToClipboard} disabled={copied} className="shrink-0">
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

