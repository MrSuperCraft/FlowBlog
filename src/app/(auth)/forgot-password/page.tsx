"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/shared/lib/supabase/client"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to send reset password email. Please try again.")
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
                        <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
                        <CardDescription>
                            {!success
                                ? "Enter your email address and we'll send you a link to reset your password"
                                : "Check your email for a link to reset your password"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {!success ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
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
                                            Sending reset link...
                                        </>
                                    ) : (
                                        <>
                                            Send reset link
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center py-4">
                                    <CheckCircle className="h-12 w-12 text-primary" />
                                </div>
                                <Alert>
                                    <AlertDescription>
                                        We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                                        instructions to reset your password.
                                    </AlertDescription>
                                </Alert>
                            </div>
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

