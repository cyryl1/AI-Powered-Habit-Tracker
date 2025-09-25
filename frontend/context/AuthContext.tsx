"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    id: number;
    email: string;
    username: string;
    role: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/me", {
        credentials: "include",
      })

      if (res.status === 401) {
        setUser(null)
        return null
      }

      if (!res.ok) throw new Error("Not Authenticated")

      const userData = await res.json()
      setUser(userData)
      return userData
    } catch (err) {
      console.error("Auth error:", err)
      setUser(null)
      return null
    }
  }

  const logout = async () => {
    try {
      // If you have a logout endpoint
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

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/admin-login",
      "/forgot-password",
      "/reset-password",
    ]

    const isPublic = publicRoutes.some(route => pathname.startsWith(route))

    if (!isPublic) {
      fetchUser().then((user) => {
        if (!user) {
          router.push("/login")
          alert("Session expired. Please log in again.")
        }
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [pathname])

  const value = {
    user,
    loading,
    setUser,
    fetchUser,
    logout
  }

  return (
    <AuthContext.Provider value={value as any}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within UserProvider")
  return context
}