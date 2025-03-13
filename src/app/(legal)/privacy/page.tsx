import Link from "next/link"
import { ArrowRight, Feather } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { ModeToggle } from "@/components/ThemeToggle"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <Header>
                        <ModeToggle />
                    </Header>
                </div>
            </header>

            <main className="flex-grow container py-16 md:py-24">
                <div className="max-w-5xl mx-auto space-y-20">
                    {/* Intro Section */}
                    <section className="space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                            Privacy Policy
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            Your Privacy on FlowBlog
                        </h1>
                        <p>
                            <strong>Last Updated: March 13, 2025</strong>
                        </p>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                At FlowBlog, we are committed to protecting your privacy. This Privacy Policy outlines the types of personal information that we collect and how we use, store, and protect it.
                            </p>
                        </div>
                    </section>


                    {/* Data Collection */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">Data We Collect</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                We collect the following types of information:
                            </p>
                            <ul className="list-disc pl-12">
                                <li>Personal identification details (e.g., name, email address) when you sign up.</li>
                                <li>Usage data from within the website, such as posts being created, comments on posts and IP addresses to provide analytics to creators.</li>
                                <li>Cookies for authentication and sessions (so you can use the website).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Use */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">How We Use Your Data</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                Your data is used to:
                            </p>
                            <ul className="list-disc pl-12">
                                <li>Provide and personalize the FlowBlog platform.</li>
                                <li>Respond to inquiries, comments, and support requests.</li>
                                <li>Improve the website&apos;s functionality and user experience.</li>
                                <li>Send you occasional updates or newsletters if you choose to subscribe.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Protection */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">How We Protect Your Data</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                At FlowBlog, we take the security and privacy of your personal data very seriously. We implement industry-standard security measures to ensure that your information remains safe, confidential, and protected from unauthorized access or misuse. Here’s an overview of the measures we use:
                            </p>

                            <h3 className="text-xl font-semibold">1. Data Encryption</h3>
                            <p>
                                We use strong encryption protocols (e.g., SSL/TLS) to protect your data during transmission over the internet. This ensures that sensitive information, such as login credentials and personal details, is securely encrypted and cannot be intercepted by unauthorized parties while in transit.
                            </p>

                            <h3 className="text-xl font-semibold">2. Secure Storage</h3>
                            <p>
                                All personal information stored on our servers is encrypted at rest. We use secure database technologies and storage systems to keep your data safe from unauthorized access, data breaches, or loss. We also regularly monitor our systems for any potential vulnerabilities and take action to fix them.
                            </p>


                            <h3 className="text-xl font-semibold">3. Data Minimization</h3>
                            <p>
                                We practice data minimization, collecting only the necessary information required to provide our services. By limiting the amount of personal information we collect and retain, we reduce the risk of exposure in the event of a security breach.
                            </p>


                            <h3 className="text-xl font-semibold">4. Supabase as Our Backend Provider</h3>
                            <p>
                                FlowBlog uses Supabase as our backend service provider. Supabase is a trusted platform that offers a secure environment for storing and handling data. While we rely on Supabase for data management, we ensure that all sensitive information is stored and processed in compliance with industry-standard security protocols.
                            </p>

                            <p>
                                By implementing these measures, we aim to provide a safe environment for your data while using FlowBlog. However, it’s important to remember that no system is completely infallible. We continuously review our security practices and are always looking for ways to improve the protection of your data.
                            </p>
                        </div>
                    </section>


                    {/* Your Rights */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">Your Rights</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                As a user, you have the following rights concerning your personal data:
                            </p>
                            <ul className="list-disc pl-12">
                                <li>Access: You can request a copy of the personal data we have on file.</li>
                                <li>Correction: You can update or correct your data at any time.</li>
                                <li>Deletion: You can request the deletion of your account and personal data.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">Contact Us</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at <Link href="mailto:support@flowblog.vercel.app" className="text-primary">support@flowblog.vercel.app</Link>.
                            </p>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="rounded-xl border bg-card text-card-foreground p-8 md:p-10 space-y-6">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold">Join Us at FlowBlog</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Enjoy the privacy and security that FlowBlog offers while you share your ideas with the world.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/sign-in">
                                <Button size="lg" className="gap-2">
                                    Start Writing <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button size="lg" variant="outline">
                                    Explore New Publications
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="border-t py-8 mt-12">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Feather className="h-5 w-5" />
                        <span className="text-lg font-semibold">FlowBlog</span>
                    </div>
                    <div className="text-sm text-muted-foreground">© 2025 FlowBlog. All rights reserved.</div>
                </div>
            </footer>
        </div>
    )
}
