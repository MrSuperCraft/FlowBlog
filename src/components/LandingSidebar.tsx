"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/context/UserContext";
import { cn } from "@/shared/lib/utils";

import {
  Home,
  PenSquare,
  Menu,
  BookOpenText,
  Sparkles,
  Shield,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Core nav items for everyone
const baseItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: <Home /> },
  { label: "About", href: "/about", icon: <BookOpenText /> },
  { label: "Guides", href: "/t/guide", icon: <Sparkles /> },
  { label: "Legal", href: "/privacy", icon: <Shield /> }
];

// Social links
// const socialLinks = [
//   { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
//   { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
//   { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
// ];

export default function LandingSidebar() {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState("Home");
  const router = useRouter();

  // Replace this with your actual user logic
  const { profile, user, isAuthenticated } = useUser();

  /**
   * SidebarHeader:
   * - If user is authenticated, show user avatar & name.
   * - Otherwise, show a community CTA (like DEV.to).
   */
  const SidebarHeader = () => {
    if (isAuthenticated && user && profile?.avatar_url) {
      return (
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <Link href={`/${profile.full_name}`}>
            <div className="flex items-center space-x-3">
              <Avatar
                src={profile.avatar_url}
                alt="User Avatar"
                fallback={user.user_metadata.name}
              />
              <div className="flex flex-col">
                <h3 className="text-sm md:text-base lg:text-lg font-medium text-primary">
                  {profile.full_name}
                </h3>
              </div>
            </div>
          </Link>
        </div>
      );
    }

    // Non-auth header
    return (
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold text-primary">Join the FlowBlog Community</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          Be among the first to experience FlowBlog — a new space where passionate bloggers will connect, share, and grow together.
        </p>

        <div className="mt-4 space-x-6">
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            className="text-primary"
          >
            Create account
          </Button>
          <Link href="/sign-in" className="text-sm text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    );
  };

  /**
   * SidebarNav:
   * - Shows core items to everyone.
   * - Adds "Write" button for authenticated users.
   */
  const SidebarNav = () => {
    return (
      <nav className="py-4">
        <div className="space-y-2">
          {baseItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full justify-start text-sm py-2 text-primary",
                activeItem === item.label && "bg-accent"
              )}
              iconBefore={item.icon}
            >
              {item.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/new")}
              className="w-full justify-start text-sm py-2 text-primary"
              iconBefore={<PenSquare />}
            >
              Write
            </Button>
          )}
        </div>
      </nav>
    );
  };

  /**
   * SidebarFooter:
   * - Contains disclaimers, social links, or additional info (like DEV.to).
   */
  const SidebarFooter = () => (
    <footer className="mt-auto p-6 lg:px-6 px-2  border-t border-gray-200 dark:border-neutral-800">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        <span className="font-semibold text-primary">FlowBlog</span> — your custom blogging platform, designed for simplicity and speed.
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Crafted with{' '}
        <Link href="https://nextjs.org" className="underline text-primary">
          Next.js
        </Link>{' '}
        to bring you the best blogging experience.
      </p>
      <div className="flex justify-center gap-6 mt-6">
        {/* {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <link.icon className="h-5 w-5" />
          </Link>
        ))} */}
      </div>
      <p className="text-sm text-neutral-400 dark:text-neutral-400/90 text-center mt-6">
        © {new Date().getFullYear()} FlowBlog. All rights reserved.
      </p>
      <p className="text-sm text-neutral-400 dark:text-neutral-400/90 text-center">
        FlowBlog was created by <Link href="https://itamar-hanan.web.app" className="text-primary underline">Itamar Hanan</Link>.
      </p>
    </footer>
  );

  /**
   * Mobile (Sheet) layout
   */
  const MobileSidebar = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader>
          <SheetTitle>
            FlowBlog
          </SheetTitle>
          <SheetDescription>
            Blogging Made Effortless
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full flex flex-col">
          <SidebarNav />
          <SidebarHeader />
          <SidebarFooter />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  /**
   * Desktop layout
   */
  const DesktopSidebar = () => (
    <aside className="hidden md:flex fixed flex-col max-w-[30%] lg:max-w-[20%] h-[calc(100vh-8rem)] border-gray-200 dark:border-neutral-800">
      <SidebarHeader />
      <ScrollArea className="flex-1">
        <SidebarNav />
      </ScrollArea>
      <SidebarFooter />
    </aside>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}
