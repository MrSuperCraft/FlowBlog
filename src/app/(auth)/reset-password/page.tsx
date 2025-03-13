"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/shared/lib/supabase/client"

export default function ResetPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [validToken, setValidToken] = useState(false)
    const router = useRouter()

    // Check if the URL contains a valid reset token
    useEffect(() => {
        const checkToken = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getSession()

            // If we have a session and an access token, the reset token is valid
            if (data?.session && !error) {
                setValidToken(true)
            } else {
                setError("Invalid or expired password reset link. Please request a new one.")
            }
        }

        checkToken()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validate passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })

            if (error) {
                throw error
            }

            setSuccess(true)

            // Redirect to sign in page after 3 seconds
            setTimeout(() => {
                router.push("/sign-in")
            }, 3000)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to reset password. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with logo */}
            <header className="w-full p-4 sm:p-6 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold">
                        FlowBlog
                    </Link>
                </div>
            </header>

            {/* Main content area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <Card className="w-full max-w-md mx-auto shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">
                            {success ? "Password reset successful" : "Create new password"}
                        </CardTitle>
                        <CardDescription>
                            {success ? "Your password has been successfully reset" : "Enter a new password for your account"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {!validToken ? (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : success ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center py-4">
                                    <CheckCircle className="h-12 w-12 text-primary" />
                                </div>
                                <Alert>
                                    <AlertDescription>
                                        Your password has been successfully reset. You will be redirected to the sign in page shortly.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting password...
                                        </>
                                    ) : (
                                        "Reset password"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <Link href="/sign-in" className="text-sm text-primary hover:underline">
                            Back to sign in
                        </Link>
                    </CardFooter>
                </Card>
            </main>

            {/* Footer */}
            <footer className="w-full p-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} FlowBlog. All rights reserved.</p>
            </footer>
        </div>
    )
}

