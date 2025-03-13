import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "sonner";
import { UserProvider } from "@/shared/context/UserContext";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FlowBlog",
    template: "%s | FlowBlog" // Allows dynamic titles per page
  },
  description: "FlowBlog is a developer-first blogging platform designed for simplicity and customization.",
  openGraph: {
    siteName: "FlowBlog",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
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
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
