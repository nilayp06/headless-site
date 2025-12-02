"use client"

import type React from "react"
import { CartProvider } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

type CartProviderWithAuthProps = {
  children: React.ReactNode
}

export default function CartProviderWithAuth({ children }: CartProviderWithAuthProps) {
  const { user } = useAuth()
  const userId: string | null = user?.email || null

  return <CartProvider userId={userId}>{children}</CartProvider>
}
