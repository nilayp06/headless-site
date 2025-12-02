"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type AuthUser = {
  email?: string | null
  username?: string | null
  displayName?: string | null
}

export type AuthContextType = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("wp_jwt_token") : null
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("wp_user") : null
      if (storedToken) setToken(storedToken)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          setUser(null)
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (newUser: AuthUser, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("wp_jwt_token", newToken)
        localStorage.setItem("wp_user", JSON.stringify(newUser))
      } catch {
        // ignore
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("wp_jwt_token")
        localStorage.removeItem("wp_user")
      } catch {
        // ignore
      }
    }
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
