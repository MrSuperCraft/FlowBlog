"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Edit3, LayoutDashboard, LoaderIcon, Search, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { isAuthenticated as checkAuth } from "@/shared/lib/supabase/helpers"
import { searchPosts } from "@/actions/search"
import LandingSidebar from "./LandingSidebar"
import { Card } from "@/components/ui/card"
// import type { PostType } from "@/shared/types"
import debounce from "lodash.debounce"


export function Header({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const checkForAuthenticatedState = async () => {
    try {
      setIsLoading(true)
      const authState = (await checkAuth()).authenticated
      setIsAuthenticated(authState)
    } catch (error) {
      console.error("Authentication check failed:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkForAuthenticatedState()
  }, [])

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await searchPosts(query)
        setSearchResults(results)
        setShowResults(true)
      } catch (error) {
        console.error("Search failed:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
  ).current

  // Call the debounced function when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery)

    // Cleanup the debounced function on unmount
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchQuery, debouncedSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(true)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    searchInputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowResults(false)
    }
  }

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
        <div className="flex flex-1 justify-center px-2 relative">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative w-full rounded-full bg-white dark:bg-neutral-800">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search posts..."
                className="pl-8 pr-8 rounded-full placeholder:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showResults && (
            <div
              ref={resultsRef}
              className="absolute top-full mt-1 w-[200px] sm:w-full max-w-2xl rounded-lg border shadow-lg z-50 max-h-[70vh] overflow-auto"
            >
              <Card className="p-2">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <LoaderIcon className="h-5 w-5 animate-spin mr-2" />
                    <span>Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground px-2 pb-1">
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                    </p>
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/${result.full_name}/${result.slug}`}
                        onClick={() => setShowResults(false)}
                        className="block p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <div className="font-medium">{result.title}</div>
                        {result.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{result.excerpt}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-muted-foreground">No results found for &quot;{searchQuery}&quot;</div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">Type to search for posts</div>
                )}
              </Card>
            </div>
          )}
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
                  <User className="sm:mr-2 h-4 w-4" />
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
  )
}

