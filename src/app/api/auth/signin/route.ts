import { createClient } from "@/shared/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  let email: string | undefined
  let password: string | undefined
  let provider: string | undefined

  console.log("Received POST request to /api/auth/signin")

  try {
    const contentType = request.headers.get("content-type") || ""
    console.log("Content-Type:", contentType)

    if (contentType.includes("application/json")) {
      const body = await request.json()
      email = body.email
      password = body.password
      provider = body.provider
      console.log("Parsed JSON body:", { email, provider })
    } else {
      const formData = await request.formData()
      email = formData.get("email")?.toString()
      password = formData.get("password")?.toString()
      provider = formData.get("provider")?.toString()
      console.log("Parsed form data:", { email, provider })
    }

    if (provider === "google") {
      console.log("Initiating Google OAuth")
      const supabase = createClient(cookies())

      // Fix the redirectTo URL to ensure it's consistent
      const redirectTo =
        process.env.NODE_ENV === "production"
          ? "https://your-production-domain.com/api/auth/callback"
          : "http://localhost:3000/api/auth/callback"

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      })

      if (error || !data.url) {
        console.error("OAuth error:", error?.message || "OAuth failed")
        return NextResponse.json({ error: error?.message || "OAuth failed" }, { status: 500 })
      }

      console.log("Redirecting to:", data.url)
      return NextResponse.redirect(data.url, { status: 302 })
    }

    if (!email || !password) {
      console.error("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Attempting sign up for email:", email)
    const supabase = createClient(cookies())
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("Sign up error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("User signed up successfully, redirecting to /sign-in")
    return NextResponse.redirect(new URL("/sign-in", request.url))
  } catch (error) {
    console.error("Internal server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

