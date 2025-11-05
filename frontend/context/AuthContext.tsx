"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ===================================================================
  //  FETCH USER + 401 REDIRECT
  // ===================================================================
  const fetchUser = async (): Promise<User | null> => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/users/me", {
        credentials: "include",
      });

      // CRITICAL: 401 → Immediate redirect
      if (res.status === 401) {
        setUser(null);
        if (typeof window !== "undefined") {
          const publicRoutes = [
            "/login",
            "/signup",
            "/admin-login",
            "/forgot-password",
            "/reset-password",
            "/",
          ];
          const current = window.location.pathname;
          const isPublic = publicRoutes.some((route) => current.startsWith(route));
          if (!isPublic) {
            router.replace("/login");
          }
        }
        return null;
      }

      if (!res.ok) throw new Error("Not authenticated");

      const userData = await res.json();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================================
  //  LOGOUT
  // ===================================================================
  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/users/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  // ===================================================================
  //  INITIAL AUTH CHECK (runs once)
  // ===================================================================
  useEffect(() => {
    fetchUser();
  }, []);

  // ===================================================================
  //  ROUTE PROTECTION & POST-LOGIN FLOW
  // ===================================================================
  useEffect(() => {
    if (loading) return; // Wait for auth check

    const publicRoutes = [
      "/login",
      "/signup",
      "/admin-login",
      "/forgot-password",
      "/reset-password",
      "/",
    ];
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    // USER IS AUTHENTICATED
    if (user) {
      // 1. Onboarding not done → go to onboarding
      if (!user.onboarding_completed && pathname !== "/onboarding" && pathname !== "/ai-intro") {
        router.replace("/onboarding");
        return;
      }

      // 2. Onboarding done, AI intro not viewed → go to AI intro
      const hasViewedAiIntro =
        typeof window !== "undefined" ? sessionStorage.getItem("ai_intro_viewed") : null;
      if (
        user.onboarding_completed &&
        !hasViewedAiIntro &&
        pathname !== "/ai-intro"
      ) {
        router.replace("/ai-intro");
        return;
      }

      // 3. Logged in + on login page → go to dashboard
      if (pathname === "/login") {
        router.replace("/dashboard");
        return;
      }
    }
    // USER IS NOT AUTHENTICATED
    else {
      // Trying to access protected route → go to login
      if (!isPublic) {
        router.replace("/login");
      }
    }
  }, [user, loading, pathname, router]);

  // ===================================================================
  //  CONTEXT VALUE
  // ===================================================================
  const value: AuthContextType = {
    user,
    loading,
    setUser,
    fetchUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===================================================================
//  HOOK
// ===================================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};