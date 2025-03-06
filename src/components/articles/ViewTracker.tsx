"use client"

import { useEffect, useRef, useState } from "react"
import { useUser } from "@/shared/context/UserContext"
import debounce from 'lodash.debounce'

interface ViewTrackerProps {
    postId: string
    threshold?: number // Minimum time in seconds before counting a view
    apiEndpoint?: string // Customizable API endpoint
}

export default function ViewTracker({
    postId,
    threshold = 5, // Default 5 seconds minimum view time
    apiEndpoint = "/api/views/track",
}: ViewTrackerProps) {
    const startTime = useRef(Date.now())
    const totalTime = useRef(0)
    const maxReadPercentage = useRef(0)
    const viewRegistered = useRef(false)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const contentRef = useRef<HTMLElement | null>(null)
    const { user } = useUser()
    const userId = user?.id
    const [isVisible, setIsVisible] = useState(false)
    const sessionId = useRef(getSessionId())

    // Track if this post has already been viewed in this session
    useEffect(() => {
        const viewKey = `viewed_${postId}`
        const alreadyViewed = localStorage.getItem(viewKey)

        if (alreadyViewed) {
            console.log(`[ViewTracker] Post ${postId} already viewed in this session`)
            viewRegistered.current = true
        }

        return () => {
            if (viewRegistered.current) {
                localStorage.setItem(viewKey, "true")
            }
        }
    }, [postId])

    // Set up intersection observer to track reading progress
    useEffect(() => {
        console.log("[ViewTracker] Component mounted. Tracking started.")

        // Find the article content
        const findContent = () => {
            const article = document.getElementById("blog-content")
            if (article) {
                contentRef.current = article
                return true
            }
            return false
        }

        // If content not found immediately, try again after a short delay
        if (!findContent()) {
            const contentCheckInterval = setInterval(() => {
                if (findContent()) {
                    clearInterval(contentCheckInterval)
                    setupObserver()
                }
            }, 500)

            // Clean up interval if component unmounts before content is found
            return () => clearInterval(contentCheckInterval)
        } else {
            setupObserver()
        }

        function setupObserver() {
            if (!contentRef.current) {
                console.warn("[ViewTracker] Blog content not found.")
                return
            }

            console.log("[ViewTracker] Blog content found. Setting up observer...")

            // Create markers at different points in the article to track reading progress
            const articleHeight = contentRef.current.offsetHeight
            const markers: HTMLDivElement[] = []

            // Create 10 marker points throughout the article
            for (let i = 0; i < 10; i++) {
                const marker = document.createElement("div")
                marker.style.position = "absolute"
                marker.style.height = "1px"
                marker.style.width = "1px"
                marker.style.top = `${(i + 1) * (articleHeight / 10)}px`
                marker.style.opacity = "0"
                marker.dataset.marker = `${(i + 1) * 10}`
                contentRef.current.style.position = "relative"
                contentRef.current.appendChild(marker)
                markers.push(marker)
            }

            // Set up the intersection observer to track which markers are visible
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsVisible(true)
                            const percentage = Number.parseInt(entry.target.getAttribute("data-marker") || "0")
                            maxReadPercentage.current = Math.max(maxReadPercentage.current, percentage)
                            console.log(`[ViewTracker] Read percentage: ${maxReadPercentage.current}%`)
                        }
                    })
                },
                { threshold: 0.1, rootMargin: "0px 0px 0px 0px" },
            )

            // Observe all markers
            markers.forEach((marker) => {
                observerRef.current?.observe(marker)
            })

            // Also observe the article itself to track visibility
            observerRef.current.observe(contentRef.current)

            return () => {
                // Clean up markers when component unmounts
                markers.forEach((marker) => {
                    marker.parentNode?.removeChild(marker)
                    observerRef.current?.unobserve(marker)
                })
                observerRef.current?.disconnect()
            }
        }
    }, [postId])

    // Track time spent on article
    useEffect(() => {
        let intervalId: NodeJS.Timeout

        if (isVisible) {
            intervalId = setInterval(() => {
                totalTime.current = (Date.now() - startTime.current) / 1000
            }, 1000)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [isVisible])

    // Send view data with debouncing to prevent excessive API calls
    const sendViewData = useRef(
        debounce(async () => {
            // Don't send if already registered or if view time is too short
            if (viewRegistered.current || totalTime.current < threshold || !userId) {
                console.log("[ViewTracker] Skipping view registration:", {
                    alreadyRegistered: viewRegistered.current,
                    viewTime: totalTime.current,
                    threshold,
                    hasUserId: !!userId,
                })
                return
            }

            const viewData = {
                postId,
                userId,
                sessionId: sessionId.current,
                viewTime: Math.round(totalTime.current),
                readPercentage: Math.round(maxReadPercentage.current),
                referrer: document.referrer || "direct",
                timestamp: new Date().toISOString(),
            }

            console.log("[ViewTracker] Sending view data:", viewData)

            try {
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(viewData),
                    // Use keepalive to ensure the request completes even if page is unloading
                    keepalive: true,
                })

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`)
                }

                const data = await response.json()
                console.log("[ViewTracker] View registered successfully:", data)
                viewRegistered.current = true
            } catch (error) {
                console.error("[ViewTracker] Failed to register view:", error)
                // Could implement retry logic here
            }
        }, 2000), // Debounce for 1 second
    ).current

    // Register view events
    useEffect(() => {
        // Check if we should register a view (after minimum time threshold)
        const viewCheckInterval = setInterval(() => {
            if (isVisible && totalTime.current >= threshold && !viewRegistered.current && userId) {
                sendViewData()
            }
        }, 2000)

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendViewData()
            }
        }

        // Handle page unload
        const handleBeforeUnload = () => {
            sendViewData()
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            clearInterval(viewCheckInterval)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("beforeunload", handleBeforeUnload)
            sendViewData()
        }
    }, [isVisible, userId, threshold, sendViewData])

    // Get or create session ID
    function getSessionId() {
        let session = localStorage.getItem("session_id")
        if (!session) {
            session = crypto.randomUUID()
            localStorage.setItem("session_id", session)
        }
        return session
    }

    return null // No UI needed
}

