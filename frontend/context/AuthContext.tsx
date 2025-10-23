"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  _id: string;
  email: string;
  username: string;
  is_active: boolean;
  name?: string;
  personal_goals?: string[];
  preferred_categories?: string[];
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:8000/api/v1/users/me", {
        credentials: "include",
      })

      if (res.status === 401) {
        setUser(null)
        return null
      }

      if (!res.ok) throw new Error("Not Authenticated")

      const userData = await res.json()
      console.log("✅ User data fetched:", userData)
      setUser(userData)
      return userData
    } catch (err) {
      console.error("❌ Auth error:", err)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/users/logout/", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  // Initial authentication check - only run once
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 Initializing auth...")
      await fetchUser()
      setInitialized(true)
      console.log("✅ Auth initialization complete")
    }
    
    initializeAuth()
  }, []) // Empty dependency array - run only once

  // Route protection logic - simplified
  useEffect(() => {
    console.log("🛡️ Route protection check:", {
      initialized,
      loading,
      user: !!user,
      pathname
    })

    // Don't do anything until we've finished the initial auth check
    if (!initialized || loading) {
      console.log("⏳ Waiting for auth initialization...")
      return
    }

    const publicRoutes = [
      "/login",
      "/signup",
      "/admin-login",
      "/forgot-password",
      "/reset-password",
      "/",
    ]

    const isPublic = publicRoutes.some(route => pathname.startsWith(route))
    console.log("📊 Route analysis:", { isPublic, pathname })

    // If user is authenticated
    if (user) {
      console.log("👤 User is authenticated")
      
      // Redirect to onboarding if not completed
      if (!user.onboarding_completed && pathname !== "/onboarding" && pathname !== "/ai-intro") {
        console.log("➡️ Redirecting to onboarding")
        router.push("/onboarding")
        return
      }
      
      // Redirect to AI intro if onboarding completed but intro not viewed
      const hasViewedAiIntro = typeof window !== 'undefined' ? sessionStorage.getItem('ai_intro_viewed') : null
      if (user.onboarding_completed && !hasViewedAiIntro && pathname !== "/ai-intro") {
        console.log("➡️ Redirecting to AI intro")
        router.push("/ai-intro")
        return
      }

      // If user is on login page but already authenticated, redirect to dashboard
      if (pathname === "/login") {
        console.log("➡️ Already authenticated, redirecting to dashboard")
        router.push("/dashboard")
        return
      }
    } 
    // If user is NOT authenticated
    else {
      console.log("❌ User not authenticated")
      
      // Redirect to login if trying to access protected route
      if (!isPublic) {
        console.log("➡️ Redirecting to login (protected route)")
        router.push("/login")
        return
      }
    }

    console.log("✅ Route access granted")
  }, [pathname, user, loading, initialized, router])

  const value = {
    user,
    loading: loading || !initialized,
    setUser,
    fetchUser,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}