"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/ThemeToggle"

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

            throw new Error("Sign ups with email & password are temporarily disabled.")
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
        <div className="min-h-screen flex flex-col">
            {/* Header with logo and theme toggle */}
            <header className="w-full p-4 sm:p-6 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/">
                        <h1 className="text-2xl font-bold">FlowBlog</h1>
                    </Link>
                </div>
                <ModeToggle />
            </header>

            {/* Main content area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Left side - Branding and illustration */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-8 p-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Join our writing community</h2>
                            <p className="text-muted-foreground text-lg">
                                Create an account to start sharing your ideas and connecting with readers around the world.
                            </p>
                        </div>

                        <div className="relative h-[300px] w-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-6">
                                <div className="space-y-3 max-w-xs">
                                    <div className="h-4 bg-primary/20 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-primary/20 rounded-full w-full"></div>
                                    <div className="h-4 bg-primary/20 rounded-full w-5/6"></div>
                                    <div className="h-4 bg-primary/20 rounded-full w-2/3"></div>
                                    <div className="h-20 bg-primary/10 rounded-xl mt-6"></div>
                                    <div className="flex space-x-2 mt-4">
                                        <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                                        <div className="h-8 bg-primary/20 rounded-full w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <blockquote className="border-l-4 border-primary pl-4 italic">
                            <p className="text-muted-foreground">&quot;The scariest moment is always just before you start.&quot;</p>
                            <footer className="text-sm mt-2">— Stephen King</footer>
                        </blockquote>
                    </div>

                    {/* Right side - Registration form */}
                    <div className="lg:col-span-3 w-full max-w-md mx-auto">
                        <Card className="shadow-xl border-border/40">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                                <CardDescription>Sign up to start your writing journey with FlowBlog</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="Email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                                    </div>

                                    {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Create account
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={loading}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-auto mr-2"
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
                                    Sign up with Google
                                </Button>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-primary font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </div>

                                <p className="text-xs text-center text-muted-foreground">
                                    By creating an account, you agree to our{" "}
                                    <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full p-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} FlowBlog. All rights reserved.</p>
            </footer>
        </div>
    )
}

