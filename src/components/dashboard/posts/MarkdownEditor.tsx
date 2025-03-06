"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, Edit2, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useTheme } from "next-themes"
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MarkdownCallout from "./MarkdownCallout"


interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [mode, setMode] = useState<"write" | "preview">("write")
    const [copied, setCopied] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { theme } = useTheme()


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
        setCharCount(value.length)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Tabs value={mode} onValueChange={(v) => setMode(v as "write" | "preview")} className="w-auto">
                    <TabsList>
                        <TabsTrigger value="write" className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            Write
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{charCount} characters</span>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-1">
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {mode === "write" ? (
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    placeholder="Write your post content in Markdown... Use **bold**, *italic*, # headings, > quotes, - lists, ```code blocks```, and more!"
                    className="min-h-[300px] placeholder:md:text-xl md:text-xl font-mono"
                    style={{ overflow: "hidden" }}
                />
            ) : (
                <div className="border rounded-md p-4 min-h-[300px] prose-pre:bg-transparent  prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
                    {value ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ children, className }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const language = match ? match[1] : "";

                                    return match ? (
                                        <SyntaxHighlighter
                                            PreTag="div"
                                            language={language}
                                            style={theme === "light" ? oneLight
                                                : oneDark}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {value}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in the editor tab!</p>
                    )}
                </div>
            )}

            {mode === "write" && (
                <MarkdownCallout />
            )}
        </div>
    )
}

