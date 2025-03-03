"use client"

import { BlockNoteView } from '@blocknote/mantine';
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from '@blocknote/react';
import { locales, type PartialBlock } from '@blocknote/core';
import debounce from 'lodash.debounce'

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent: string, onChange: (value: string) => void }) {
    // Define a default non-empty content block as fallback

    const locale = locales["en"];

    const editor = useCreateBlockNote({
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : [{ type: "paragraph", content: "Start writing your article here..." }],
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                default: "Press '/' to see available blocks & commands."
            }
        },
    })

    const handleEditorChange = debounce(() => {
        onChange(JSON.stringify(editor.document, null, 2));
    }, 1000);

    return (
        <>
            <BlockNoteView theme="light" editor={editor} onChange={handleEditorChange} className='border-t py-12' />
        </>
    )
}