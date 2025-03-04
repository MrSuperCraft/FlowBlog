"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "../context/UserContext"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Only check and redirect on dashboard routes
        const isDashboardRoute = pathname.startsWith("/dashboard")

        if (!loading && !isAuthenticated && isDashboardRoute) {
            console.log("[ProtectedRoute] Unauthorized access to dashboard, redirecting to sign-in")
            router.push("/sign-in")
        }
    }, [isAuthenticated, loading, pathname, router])

    // If we're on a dashboard route and still loading or not authenticated,
    // we could show a loading state
    if (loading && pathname.startsWith("/dashboard")) {
        return <div>Loading...</div>
    }

    // For dashboard routes, only render children if authenticated
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
        return null // Don't render anything while redirecting
    }

    // For all other routes or if authenticated, render children
    return <>{children}</>
}

