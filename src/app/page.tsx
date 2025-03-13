import BlogFeed from "@/components/BlogFeed";
import { Header } from "@/components/Header";
import LandingSidebar from "@/components/LandingSidebar";
import RightContent from "@/components/RightContent";
import { ModeToggle } from "@/components/ThemeToggle";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "FlowBlog | Where Your Thoughts Flow",
  description: "FlowBlog is a minimalist, developer-first blogging platform. Share your insights, document your journey, and write freely—whether it’s code, ideas, or stories.",
  keywords: [
    "FlowBlog",
    "developer blogging platform",
    "minimalist blogging",
    "write and publish blogs",
    "technical blogging",
    "developer journals",
    "coding blog",
    "open-source blogging"
  ],
  openGraph: {
    title: "FlowBlog | Where Your Thoughts Flow",
    description: "FlowBlog is a lightweight, developer-first blogging platform designed for sharing ideas, code, and personal insights with ease.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "FlowBlog",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FlowBlog – Where Your Thoughts Flow"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    site: "@ItamarHanan",
    title: "FlowBlog | Where Your Thoughts Flow",
    description: "A modern, developer-first blogging platform built for simplicity and customization. Share your code, ideas, and insights effortlessly.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },

};





export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Header>
            <ModeToggle />
          </Header>
        </div>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div className="hidden md:flex md:col-span-1">
          <LandingSidebar />
        </div>
        <div className="md:col-span-2">
          <BlogFeed />
        </div>
        <div className="hidden lg:flex lg:col-span-1">
          <RightContent />
        </div>
      </main>
    </div>
  );
}
