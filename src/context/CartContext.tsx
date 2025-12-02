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

  const getStorageKey = (uid: string | number | null) => {
    if (uid) return `cart_user_${uid}`
    return "cart_guest"
  }

  // Load cart from localStorage when userId changes
  useEffect(() => {
    isInitialized.current = false
    try {
      const key = getStorageKey(userId as any)
      const stored = localStorage.getItem(key)
      setCart(stored ? JSON.parse(stored) : [])
    } catch {
      setCart([])
    } finally {
      isInitialized.current = true
    }
  }, [userId])

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized.current) return
    try {
      const key = getStorageKey(userId as any)
      localStorage.setItem(key, JSON.stringify(cart))
    } catch {}
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
