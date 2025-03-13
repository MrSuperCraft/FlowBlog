"use client"

import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { locales, type PartialBlock } from "@blocknote/core"
import debounce from "lodash.debounce"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"

export default function BlockNoteEditor({
    initialContent,
    onChange,
}: { initialContent: string; onChange: (value: string) => void }) {
    const { theme } = useTheme()
    const locale = locales["en"]

    const editor = useCreateBlockNote({
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : [{ type: "paragraph", content: "Start writing your article here..." }],
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                default: "Press '/' to see available blocks & commands.",
            },
        },
    })

    const handleEditorChange = debounce(() => {
        onChange(JSON.stringify(editor.document, null, 2))
    }, 1000)

    return (
        <Card className="overflow-hidden border-none">
            <BlockNoteView
                theme={theme === "dark" ? "dark" : "light"}
                editor={editor}
                onChange={handleEditorChange}
                className="min-h-[50vh] py-12"
            />
        </Card>
    )
}

