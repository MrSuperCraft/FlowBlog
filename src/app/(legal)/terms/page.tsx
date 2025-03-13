import Link from "next/link"
import { Feather, Shield } from "lucide-react"
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
                            Terms of Service
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                            FlowBlog&apos;s Terms of Use
                        </h1>
                        <p>
                            <strong>Last Updated: March 13, 2025</strong>
                        </p>
                        <div className="prose prose-lg dark:prose-invert">
                            <p>
                                At FlowBlog, we are committed to being transparent about our policies and how we handle your data. Our
                                Terms of Service outline the rules and regulations for using our website and services. By accessing or
                                using FlowBlog, you agree to comply with these Terms.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="prose prose-lg dark:prose-invert">

                            <h3 className="text-xl font-semibold">1. Introduction</h3>
                            <p>
                                Welcome to <strong>FlowBlog</strong>! These Terms of Service (&quot;Terms&quot;) govern your access to and use of
                                our website, applications, and services (collectively referred to as &quot;Services&quot;). By accessing or using
                                FlowBlog, you agree to comply with these Terms. If you do not agree to these Terms, you must refrain
                                from using our Services.
                            </p>
                            <p>
                                We reserve the right to update or modify these Terms at any time, and such changes will be effective
                                immediately upon posting. Please review this page periodically for updates.
                            </p>

                            <h3 className="text-xl font-semibold">2. User Responsibilities</h3>
                            <p>By using FlowBlog, you agree to:</p>
                            <ul>
                                <li>
                                    Provide accurate, current, and complete information when creating an account or interacting with our
                                    Services.
                                </li>
                                <li>
                                    Maintain the confidentiality of your account information and notify us immediately of any unauthorized
                                    use of your account.
                                </li>
                                <li>Use our Services only for lawful purposes and in accordance with these Terms.</li>
                                <li>
                                    Not engage in any activities that could harm or disrupt the Services, including hacking, spamming, or
                                    introducing malicious software.
                                </li>
                                <li>Not violate any applicable laws or regulations while using FlowBlog.</li>
                            </ul>

                            <h3 className="text-xl font-semibold">3. Account Security</h3>
                            <p>
                                You are responsible for maintaining the security of your account. You agree to immediately notify us of
                                any unauthorized access to your account or any other security breach. We take security seriously but
                                cannot guarantee complete protection against unauthorized access.
                            </p>

                            <h3 className="text-xl font-semibold">4. Content Ownership and Use</h3>
                            <p>
                                <strong>Your Content:</strong> You retain ownership of the content you upload or create on FlowBlog. By
                                submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and
                                distribute your content as part of the Services. This license is necessary for us to provide you with
                                the Services.
                            </p>
                            <p>
                                <strong>Our Content:</strong> All content provided by FlowBlog, including the website design, logos,
                                text, and other materials, is the property of FlowBlog or its licensors and is protected by copyright
                                laws. You may not use, reproduce, or distribute this content without permission.
                            </p>

                            <h3 className="text-xl font-semibold">5. Prohibited Activities</h3>
                            <p>You may not:</p>
                            <ul>
                                <li>
                                    Engage in any activities that could harm, disable, or overload our Services, including unauthorized
                                    access to our systems.
                                </li>
                                <li>Violate the privacy rights of other users or share their personal data without consent.</li>
                                <li>
                                    Post or distribute any content that is unlawful, defamatory, threatening, or infringes on the
                                    intellectual property rights of others.
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold">6. Termination</h3>
                            <p>
                                We reserve the right to suspend or terminate your access to FlowBlog at our discretion, without prior
                                notice, if you violate these Terms or engage in any activity deemed harmful to the Services or other
                                users.
                            </p>

                            <h3 className="text-xl font-semibold">7. Disclaimers</h3>
                            <p>
                                Our Services are provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee that the Services will always
                                be available, error-free, or meet your expectations. We are not responsible for any losses or damages
                                that may result from using FlowBlog, including but not limited to data loss, system failures, or
                                interruptions in service.
                            </p>

                            <h3 className="text-xl font-semibold">8. Limitation of Liability</h3>
                            <p>
                                To the fullest extent permitted by law, FlowBlog and its affiliates will not be liable for any indirect,
                                incidental, special, or consequential damages arising out of or related to these Terms or your use of
                                our Services. This includes damages for loss of profits, data, or other intangible losses.
                            </p>

                            <h3 className="text-xl font-semibold">9. Indemnification</h3>
                            <p>
                                You agree to indemnify and hold harmless FlowBlog, its officers, employees, and partners from any
                                claims, damages, or expenses (including legal fees) arising from your use of the Services or violation
                                of these Terms.
                            </p>

                            <h3 className="text-xl font-semibold">10. Governing Law</h3>
                            <p>
                                These Terms are governed by and construed in accordance with the laws of the jurisdiction in which
                                FlowBlog operates. Any disputes related to these Terms shall be resolved in the courts of that
                                jurisdiction.
                            </p>

                            <h3 className="text-xl font-semibold">11. Changes to the Terms of Service</h3>
                            <p>
                                We may update or modify these Terms at any time. When we do, the revised Terms will be posted on this
                                page, and the &quot;Last Updated&quot; date will be updated accordingly. Your continued use of the Services after
                                such updates constitutes your acceptance of the revised Terms.
                            </p>

                            <h3 className="text-xl font-semibold">12. Contact Information</h3>
                            <p>If you have any questions or concerns about these Terms of Service, please contact us at:</p>
                            <ul>
                                <li>
                                    <strong>Email</strong>: <a href="mailto:support@flowblog.vercel.app">support@flowblog.vercel.app</a>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Call to Action - Modified for privacy policy page */}
                    <section className="rounded-xl border bg-card text-card-foreground p-8 md:p-10 space-y-6">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold">Have Questions About Our Policies?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We&apos;re committed to transparency and protecting your data. If you have any questions about our privacy
                                policy or terms of service, please reach out.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/privacy">
                                <Button size="lg" variant="outline" className="gap-2">
                                    Read the Privacy Policy <Shield className="h-4 w-4" />
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
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms of Service
                        </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">© 2025 FlowBlog. All rights reserved.</div>
                </div>
            </footer>
        </div>
    )
}

