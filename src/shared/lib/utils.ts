import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const sanitizeMarkdown = (text: string) => {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/#+\s/g, "") // Remove headers
    .replace(/>\s/g, "") // Remove blockquotes
    .replace(/[*_~`]/g, "") // Remove formatting characters
    .replace(/^\s*[\r\n]/gm, "") // Remove empty lines
}
