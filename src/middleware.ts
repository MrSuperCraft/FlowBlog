import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Configure allowed origins
const allowedOrigins =
    process.env.NODE_ENV === "production" ? [`${process.env.NEXT_PUBLIC_BASE_URL}`] : ["http://localhost:3000"]

export function middleware(request: NextRequest) {
    // Get the origin from the request headers
    const origin = request.headers.get("origin") || ""
    const isAllowedOrigin = allowedOrigins.includes(origin)

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
        const preflightHeaders = {
            ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
                "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
            "Access-Control-Max-Age": "86400", // 24 hours
        }

        return NextResponse.json({}, { headers: preflightHeaders })
    }

    // Handle regular requests
    const response = NextResponse.next()

    // Add CORS headers to the response
    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin)
    } else {
        // For public APIs, you might want to set this to '*'
        // Only do this if you don't need credentials
        response.headers.set("Access-Control-Allow-Origin", "*")
    }

    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
}

// Apply middleware only to API routes
export const config = {
    matcher: "/api/:path*",
}

