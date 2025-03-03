"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, LayoutDashboard, LoaderIcon, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isAuthenticated as checkAuth } from "@/shared/lib/supabase/helpers";
import LandingSidebar from "./LandingSidebar";

export function Header({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkForAuthenticatedState = async () => {
    try {
      setIsLoading(true);
      const authState = (await checkAuth()).authenticated;
      setIsAuthenticated(authState);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkForAuthenticatedState();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-8">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Edit3 size={24} />
            <span className="font-bold">FlowBlog</span>
          </Link>
          <div className="flex md:hidden">
            <LandingSidebar />
          </div>
        </div>

        {/* Centered Search Bar */}
        <div className="flex flex-1 justify-center px-2">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl"
          >
            <div className="relative w-full rounded-full bg-white dark:bg-neutral-800">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8 rounded-full placeholder:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center justify-end gap-2">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoaderIcon className="animate-spin" />
            </div>
          ) : isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="hidden sm:flex">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button size="sm">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          {children}
        </nav>
      </div>
    </header>
  );
}