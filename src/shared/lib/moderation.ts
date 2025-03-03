import { Filter } from "bad-words"
import { pipeline, env } from "@xenova/transformers"

// Ensure we're using the WASM backend
env.backends.onnx.wasm.numThreads = 1

class ProfanityFilter {
    private filter: Filter
    private toxicityClassifier: any

    constructor() {
        this.filter = new Filter({
            replaceRegex: /\p{L}|\p{N}|\p{M}/gu
        });

        this.toxicityClassifier = null
    }

    async initialize() {
        // Initialize the toxicity classifier
        this.toxicityClassifier = await pipeline("text-classification", "Xenova/toxic-bert")
    }

    // Algorithmic check
    algorithmicCheck(text: string): boolean {
        return !this.filter.isProfane(text)
    }

    // AI-powered check
    async aiCheck(text: string): Promise<boolean> {
        if (!this.toxicityClassifier) {
            await this.initialize()
        }

        const result = await this.toxicityClassifier(text)
        // Assuming the model returns a score between 0 and 1, where higher means more toxic
        return result[0].score < 0.5 // Adjust this threshold as needed
    }

    // Combined check
    async checkContent(text: string): Promise<{ isAppropriate: boolean; reason?: string }> {
        // First, run the quick algorithmic check
        if (!this.algorithmicCheck(text)) {
            return { isAppropriate: false, reason: "Contains profanity" }
        }

        // If it passes the algorithmic check, run the AI check
        const aiResult = await this.aiCheck(text)
        if (!aiResult) {
            return { isAppropriate: false, reason: "Your message was found offensive and inappropriate by our algorithm. Please revise your message and try again." }
        }

        // If it passes both checks, it's appropriate
        return { isAppropriate: true }
    }

    // Add custom words to the filter
    addWords(words: string[]) {
        this.filter.addWords(...words)
    }

    // Remove words from the filter
    removeWords(words: string[]) {
        this.filter.removeWords(...words)
    }
}

export const profanityFilter = new ProfanityFilter()

