'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";

interface UserContextType {
  session: Session | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    console.log("[UserProvider] Fetching user session");
    setLoading(true);
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession();
      console.log(session);
      if (error || !data.session) {
        console.error("[UserProvider] No session found:", error);
        setSession(null);
        router.push("/sign-in");
      } else {
        console.log("[UserProvider] Session found:", data.session);
        setSession(data.session);
      }
    } catch (err) {
      console.error("[UserProvider] Error fetching session:", err);
      setSession(null);
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ session, loading, refreshUser: getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
