"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "../lib/supabase/client"
import { getProfileFromId } from "@/actions/user"
import { Profile } from "../types"


interface UserContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setUser(null)
        setProfile(null)
      } else {
        setUser(user)

        // Fetch profile data
        const userProfile = await getProfileFromId(user.id)
        if (userProfile) {
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
      }
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserData()

    // Subscribe to auth state changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        const userProfile = await getProfileFromId(session.user.id)
        setProfile(userProfile || null)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshUser: fetchUserData,
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
