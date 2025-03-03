"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import {
  Home,
  Bookmark,
  TrendingUp,
  PenSquare,
  Menu,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { isAuthenticated } from "@/shared/lib/supabase/helpers"; // Import the isAuthenticated function
import type { User } from "@supabase/supabase-js";
import { Separator } from "./ui/separator";
import { getProfileFromUsername } from "@/actions/user";
import type { Profile } from "@/shared/types";
import { Avatar } from "./ui/avatar";

const sidebarItems = [
  { icon: Home, label: "Home" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: TrendingUp, label: "Trending" },
  { icon: PenSquare, label: "Write" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
  { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
];

export default function LandingSidebar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean;
    user: User | null;
  }>({ authenticated: false, user: null });
  const [profile, setProfile] = useState<Profile | null>(null); // New state for profile
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status = await isAuthenticated();
      setAuthStatus(status);
      if (status.authenticated && status.user) {
        const userProfile = await getProfileFromUsername(status.user.id);
        setProfile(userProfile);
      }
    };
    checkAuthStatus();
  }, []);

  const SidebarContent = () => (
    <div className="flex h-full max-h-2/3 flex-col">
      <div className="flex-1">
        <div className="space-y-4 py-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeItem === item.label && "bg-accent"
              )}
              onClick={() => setActiveItem(item.label)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const UserProfile = () => {
    const { user } = authStatus;
    if (!user || !profile) return null;
    console.log(profile.avatar_url);

    if (!profile.avatar_url) return null;

    return (
      <div className="flex items-center space-x-4 p-4 pt-12">
        <Avatar
          src={profile.avatar_url ?? ""}
          alt="User Avatar"
          fallback={user.user_metadata.name}
        />
        <div className="text-left">
          <h3 className="text-sm md:text-base lg:text-lg font-medium">
            {user.user_metadata.name}
          </h3>
          {/* {profile.bio && <p className="text-xs text-gray-500">{profile.bio}</p>}
                    {profile.location && <p className="text-xs text-gray-500">{profile.location}</p>}
                    {profile.website && (
                        <a href={profile.website} className="text-xs text-blue-500 hover:underline">
                            {profile.website}
                        </a>
                    )} */}
        </div>
      </div>
    );
  };

  const Footer = () => (
    <div className="flex justify-around p-4">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <link.icon
            className={cn("h-5 w-5 text-gray-500 hover:text-gray-700")}
          />
        </a>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <ScrollArea className="h-full">
            {authStatus.authenticated && <UserProfile />}
            <SidebarContent />
            <Footer />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden h-[calc(100vh-8rem)] flex-col md:flex fixed max-w-[25%] lg:max-w-[20%]">
        {authStatus.authenticated && (
          <>
            <UserProfile />
            <Separator className="w-full h-1 rounded-full mb-6" />
          </>
        )}

        <ScrollArea className="flex-1">
          <SidebarContent />
        </ScrollArea>
        <Separator className="w-full h-1 rounded-full mb-6" />
        <Footer />
      </aside>
    </>
  );
}
