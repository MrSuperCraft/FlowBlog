"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { Session } from "@supabase/supabase-js"
import { createClient } from "../lib/supabase/client"

interface UserContextType {
  session: Session | null
  loading: boolean
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const getUser = useCallback(async () => {
    console.log("[UserProvider] Fetching user session")
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.log("[UserProvider] No session found")
        setSession(null)
      } else {
        console.log("[UserProvider] Session found:", data.session)
        setSession(data.session)
      }
    } catch (err) {
      console.error("[UserProvider] Error fetching session:", err)
      setSession(null)
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
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getUser])

  return (
    <UserContext.Provider
      value={{
        session,
        loading,
        refreshUser: getUser,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

