"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

export default function ArticleContent({ content }: { content: string }) {
    const [isClient, setIsClient] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Show skeleton while loading
    if (!isClient || !theme) {
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
    return (
        <article
            className="prose max-w-none dark:prose-invert prose-pre:bg-transparent prose-code:bg-transparent prose-sm md:prose-base lg:prose-lg"
            id="blog-content"
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return match ? (
                            <SyntaxHighlighter

                                style={theme === "light" ? oneLight : oneDark}
                                language={match[1]}
                                PreTag="div"
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...props} className={className}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    )
}

