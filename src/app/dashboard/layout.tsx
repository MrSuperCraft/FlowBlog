import { ProtectedRoute } from "@/shared/providers/ProtectedRoute";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s | FlowBlog"
    },
    description:
        "Manage your account, posts, and settings in your FlowBlog dashboard.",
    openGraph: {
        siteName: "FlowBlog",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: "FlowBlog – A Developer-First Blogging Platform"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        site: "@ItamarHanan",
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`]
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png"
    },
    robots: {
        index: false,
        follow: false
    }
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <section>
                <div className="flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                </div>
                <Toaster />
            </section>
        </ProtectedRoute>
    );
}
