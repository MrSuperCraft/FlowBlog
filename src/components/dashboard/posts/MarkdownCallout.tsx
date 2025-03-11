"use client"

import { useState } from "react"
import { AlertCircle, Code, Heading1, List, Quote, Bold, Italic } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MarkdownCallout() {
    const [open, setOpen] = useState(false)

    return (
        <Alert className="bg-muted/50 border-muted-foreground/20 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4">
            <AlertCircle className="size-6 sm:size-8 mt-1 sm:mt-0" />
            <div className="flex flex-col">
                <AlertTitle className="text-lg sm:text-xl">
                    💡 Want to write like a pro?
                </AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                    <div className="flex gap-1 items-center flex-wrap">
                        Learn more with our Markdown Syntax Guide
                        <Button
                            variant="link"
                            className="px-0 h-auto text-sm font-normal underline-offset-4"
                            onClick={() => setOpen(true)}
                        >
                            Here
                        </Button>
                    </div>
                </AlertDescription>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col">
                    <ScrollArea className="flex-grow mt-4 h-[80vh]">
                        <DialogHeader className="flex-shrink-0">
                            <DialogTitle>Markdown Guide</DialogTitle>
                            <DialogDescription>
                                A quick reference to the Markdown syntax
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Bold className="h-4 w-4" />
                                    <h3>Bold</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">**This text is bold**</div>
                                    <div className="font-bold text-sm">This text is bold</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Italic className="h-4 w-4" />
                                    <h3>Italic</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">*This text is italic*</div>
                                    <div className="italic text-sm">This text is italic</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Heading1 className="h-4 w-4" />
                                    <h3>Headings</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        # Heading 1<br />## Heading 2<br />### Heading 3
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold">Heading 1</div>
                                        <div className="text-xl font-bold">Heading 2</div>
                                        <div className="text-lg font-bold">Heading 3</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Quote className="h-4 w-4" />
                                    <h3>Blockquotes</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">&gt; This is a blockquote</div>
                                    <div className="border-l-4 border-muted-foreground/20 pl-4 text-sm">This is a blockquote</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <List className="h-4 w-4" />
                                    <h3>Lists</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">- Item 1<br />- Item 2<br />- Item 3</div>
                                    <div className="text-sm">
                                        <ul className="list-disc pl-5">
                                            <li>Item 1</li>
                                            <li>Item 2</li>
                                            <li>Item 3</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Code className="h-4 w-4" />
                                    <h3>Code Blocks</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {"```js \n function example() { \n console.log('Hello World!') \n } \n```"}
                                    </div>
                                    <div className="text-sm">
                                        <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                            <code>
                                                {`function example(); return 'Hello World'; }`}
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <h3>Inline Code</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4">
                                    <div className="text-sm text-muted-foreground">`inline code`</div>
                                    <div className="text-sm">
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">inline code</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </Alert>
    )
}

