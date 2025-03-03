"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignUp() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Create a FormData object
            const form = new FormData()
            form.append("email", formData.email)
            form.append("password", formData.password)

            const res = await fetch("/api/auth/signin", {
                method: "POST",
                // Don't set Content-Type header when using FormData
                // The browser will automatically set it with the boundary
                body: form,
                credentials: "same-origin",
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Registration failed")
            }

            router.push("/dashboard")
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignUp = async () => {
        setLoading(true)
        setError(null)

        try {
            const form = new FormData()
            form.append("provider", "google")

            const res = await fetch("/api/auth/signin", {
                method: "POST",
                body: form,
                credentials: "same-origin",
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Google sign-up failed")
            }

            // For OAuth, the response might be a redirect URL
            const data = await res.json().catch(() => ({}))
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
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Sign Up</h1>
                {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300">Email</label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="placeholder@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300">Password</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-blue-600 dark:text-blue-400">
                        Sign in
                    </Link>
                </p>
                <hr className="mt-8 border-zinc-300 dark:border-zinc-600" />
                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">Or with</p>
                <Button
                    variant="outline"
                    className="w-full mt-4 flex items-center gap-2"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto" viewBox="0 0 256 262">
                        <path
                            fill="#4285F4"
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        />
                        <path
                            fill="#34A853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        />
                        <path
                            fill="#FBBC05"
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        />
                        <path
                            fill="#EB4335"
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        />
                    </svg>
                    Sign up with Google
                </Button>
            </div>
        </div>
    )
}

