import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { franc } from 'franc-min'
import langs from 'langs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function checkLanguage(content: string): string {
  const langCode = franc(content); // Detect language code (ISO 639-3)

  // Convert the code to a full language name
  const language = langs.where("3", langCode);

  return language ? language.name : "Unknown";
}