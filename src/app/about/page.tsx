import Link from "next/link"
import { ArrowRight, Feather, Zap, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { ModeToggle } from "@/components/ThemeToggle"

export default function AboutPage() {
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
                            About FlowBlog
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            Where Ideas Take Shape and Stories Flow
                        </h1>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                FlowBlog is a minimalistic blogging platform built for thinkers, writers, and developers who value
                                clarity, performance, and creativity. We believe that writing should be seamless, reading should be
                                effortless, and performance should never be compromised.
                            </p>
                            <p>
                                In a world of cluttered interfaces and noisy platforms, we take a different approach—no unnecessary
                                features, just the essentials, done right.
                            </p>
                        </div>
                    </section>

                    {/* Philosophy & Vision */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">Our Philosophy</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>We built FlowBlog on three core principles that guide everything we do:</p>
                            <blockquote className="not-italic border-l-primary">
                                <p className="font-medium">
                                    Writing is thinking. To write well is to think clearly. That&apos;s why it&apos;s so hard.
                                </p>
                                <footer className="text-muted-foreground">— David McCullough</footer>
                            </blockquote>
                            <p>
                                When you remove distractions and focus on the essentials, you create space for clarity. FlowBlog strips
                                away the unnecessary to help you focus on what matters most—your ideas and how you express them.
                            </p>
                            <p>
                                We believe that technology should serve the writer, not the other way around. That&apos;s why we&apos;ve built a
                                platform that gets out of your way, letting your words take center stage.
                            </p>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-4xl font-bold">Why Writers Choose Us</h2>
                        </div>
                        <div className="grid gap-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Optimized for Speed</h3>
                                </div>
                                <div className="prose prose-lg dark:prose-invert pl-12">
                                    <p>
                                        Built with Next.js for lightning-fast performance, FlowBlog ensures a seamless experience whether
                                        you&apos;re reading or writing. Pages load instantly, edits save automatically, and your readers never
                                        have to wait.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Feather className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Minimal Distractions</h3>
                                </div>
                                <div className="prose prose-lg dark:prose-invert pl-12">
                                    <p>
                                        A clean, focused writing experience with no unnecessary UI elements—just you and your words. Our
                                        distraction-free editor helps you enter a state of flow, where your best ideas emerge naturally and
                                        your writing finds its rhythm.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Community-Driven</h3>
                                </div>
                                <div className="prose prose-lg dark:prose-invert pl-12">
                                    <p>
                                        Connect with like-minded individuals who share insights, knowledge, and creativity in an open
                                        environment. FlowBlog isn&apos;t just a platform—it&apos;s a community of thinkers, creators, and innovators
                                        who value meaningful content.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Reader-Focused Design</h3>
                                </div>
                                <div className="prose prose-lg dark:prose-invert pl-12">
                                    <p>
                                        Typography that respects readability, layouts that adapt to any device, and features that enhance
                                        the reading experience. We believe that great writing deserves a great reading experience, so we&apos;ve
                                        optimized every aspect of FlowBlog for your readers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="rounded-xl border bg-card text-card-foreground p-8 md:p-10 space-y-6">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold">Start Your Writing Journey Today</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Join thousands of writers who have found their voice on FlowBlog. Whether you&apos;re documenting your
                                journey, sharing technical insights, or exploring creative storytelling, this is where your words find
                                their home.
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

