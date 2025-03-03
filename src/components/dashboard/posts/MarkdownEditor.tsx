import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write your post content in Markdown..."
            className="min-h-[300px] placeholder:md:text-xl md:text-xl"
            style={{ overflow: "hidden" }}
        />
    );
}
