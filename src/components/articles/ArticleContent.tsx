"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ArticleContent({ content }: { content: string }) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Show skeleton while loading
    if (!isClient) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-6 w-full" />
            </div>
        )
    }

    // Render markdown content
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
}
