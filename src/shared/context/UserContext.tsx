"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "../lib/supabase/client"

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const getUser = useCallback(async () => {
    console.log("[UserProvider] Fetching user session")
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.log("[UserProvider] No session found")
        setUser(null)
      } else {
        console.log("[UserProvider] Session found:", user)
        setUser(user)
      }
    } catch (err) {
      console.error("[UserProvider] Error fetching session:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Set up auth state listener
  useEffect(() => {
    getUser()

    // Subscribe to auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getUser])

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser: getUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
