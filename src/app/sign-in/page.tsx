"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/shared/lib/supabase/client"

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        // Add credentials to ensure cookies are sent with the request
        credentials: "same-origin",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Invalid email or password.")
      }

      // Redirect user on success
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const origin = window.location.origin;
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/api/auth/callback`,
        },
      })
      if (data.url) {
        // Redirect to the OAuth provider
        router.push(data.url)
      } else {
        // If we get a redirect response directly, the browser will follow it
        router.push("/dashboard")
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col gap-4 items-center p-4 justify-center min-h-screen">
      <section className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
        <h1 className="font-semibold text-2xl sm:text-3xl dark:text-zinc-100 text-zinc-900 w-full mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 w-full">
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="email" className="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="placeholder@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md py-2 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="password" className="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="rounded-md py-2 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="dark:bg-zinc-100 bg-zinc-900 border-zinc-900 py-2 border dark:border-zinc-100 rounded-md mt-4 dark:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-6 w-full">
          New to FlowBlog?{" "}
          <a href="/sign-up" className="dark:text-blue-400 text-blue-600 underline underline-offset-2 font-medium">
            Create an account
          </a>
        </p>
        <hr className="h-0 border-t mt-8 dark:border-zinc-600 border-zinc-300" />
        <p className="-mt-2.5 text-xs text-center dark:text-zinc-400 text-zinc-500">
          <span className="bg-background dark:bg-zinc-900 px-4">Or with</span>
        </p>
        <Button
          variant="outline"
          className="w-full dark:bg-zinc-100 p-2 border border-zinc-300 dark:border-zinc-100 flex justify-center items-center gap-2 rounded-md mt-2 dark:text-zinc-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-auto"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            ></path>
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          Sign in with Google
        </Button>
      </section>
    </main>
  )
}

