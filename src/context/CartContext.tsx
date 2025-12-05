// src/context/CartContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  qty: number
}

export interface CartContextType {
  cart: CartItem[]
  add: (item: CartItem) => void
  remove: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({
  children,
  userId = null,
}: {
  children: React.ReactNode
  userId?: string | number | null
}) {
  const [cart, setCart] = useState<CartItem[]>([])
  const isInitialized = useRef(false)
  const isSyncingToRemote = useRef(false)

  const getStorageKey = (uid: string | number | null) => {
    if (uid) return `cart_user_${uid}`
    return "cart_guest"
  }

  // Load cart when userId changes: first from localStorage, then from Supabase for logged-in users
  useEffect(() => {
    isInitialized.current = false

    const load = async () => {
      try {
        const key = getStorageKey(userId as any)
        const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null
        let initialCart: CartItem[] = stored ? JSON.parse(stored) : []

        // If we have a logged-in user, try to load from Supabase via API to share cart across devices
        if (userId) {
          try {
            const res = await fetch(`/api/cart?userEmail=${encodeURIComponent(String(userId))}`)
            if (res.ok) {
              const data = await res.json()
              if (Array.isArray(data.items)) {
                initialCart = data.items
              }
            }
          } catch {
            // ignore remote load errors, fallback to local
          }
        }

        setCart(initialCart)
      } catch {
        setCart([])
      } finally {
        isInitialized.current = true
      }
    }

    load()
  }, [userId])

  // Save cart to localStorage and Supabase (for logged-in users)
  useEffect(() => {
    if (!isInitialized.current) return

    const key = getStorageKey(userId as any)

    // Always keep localStorage in sync (for guests and offline access)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(cart))
      }
    } catch {
      // ignore
    }

    // For logged-in users, also sync to Supabase through the API
    if (userId && !isSyncingToRemote.current) {
      const controller = new AbortController()

      const sync = async () => {
        try {
          isSyncingToRemote.current = true
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: String(userId),
              items: cart,
            }),
            signal: controller.signal,
          })
        } catch {
          // ignore sync errors, cart is still in localStorage
        } finally {
          isSyncingToRemote.current = false
        }
      }

      sync()

      return () => {
        controller.abort()
      }
    }
  }, [cart, userId])

  const add = (item: CartItem) => {
    setCart(prev => {
      const id = Number(item.id)
      const existing = prev.find(i => Number(i.id) === id)

      if (existing) {
        return prev.map(i =>
          Number(i.id) === id
            ? { ...i, qty: i.qty + item.qty }
            : i
        )
      }

      return [...prev, { ...item, id }]
    })
  }

  const remove = (id: number) =>
    setCart(prev => prev.filter(i => Number(i.id) !== Number(id)))

  const updateQty = (id: number, qty: number) =>
    setCart(prev =>
      prev.map(i =>
        Number(i.id) === Number(id)
          ? { ...i, qty }
          : i
      )
    )

  const clear = () => {
    setCart([])
    try {
      const key = getStorageKey(userId as any)
      localStorage.removeItem(key)
    } catch {}
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const value: CartContextType = {
    cart,
    add,
    remove,
    updateQty,
    clear,
    total,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
