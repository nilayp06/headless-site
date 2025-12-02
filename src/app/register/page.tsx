"use client"

import type React from "react"
import { useState } from "react"

export default function Register() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") || "")
    const email = String(formData.get("email") || "")
    const password = String(formData.get("password") || "")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || data?.error) {
        setError(data?.message || "Registration failed")
      } else {
        setMessage("Account created successfully. You can now log in.")
        form.reset()
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="w-full bg-background">
      <div className="w-full bg-secondary py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight">Create Account</h1>
          <p className="text-lg text-muted-foreground font-light mt-4">Join Studio to manage your orders and wishlist</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-foreground mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-3 bg-primary text-primary-foreground font-normal hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-600 text-center">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Already have an account? <a href="/login" className="text-foreground hover:underline">Login</a>
        </p>
      </div>
    </main>
  )
}
