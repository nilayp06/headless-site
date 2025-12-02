"use client"
import Link from "next/link"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart.reduce((s, i) => s + (i.qty || 0), 0)
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-black hover:opacity-70 transition-opacity">
            HEADLESS WOO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
              Shop
            </Link>
            <Link href="/categories" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
              Categories
            </Link>
            <Link href="/brands" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
              Brands
            </Link>
            <Link href="/about" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
              Contact
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Hello, {user.displayName || user.username || user.email}</span>
                <button
                  onClick={logout}
                  className="text-sm text-black hover:text-red-500 transition-colors font-medium"
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
                  Login
                </Link>
                <Link href="/register" className="text-sm text-black hover:text-blue-500 transition-colors font-medium">
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:opacity-60 transition-opacity text-black" aria-label="Search">
              <Search size={18} />
            </button>
            <Link href="/cart" className="relative p-2 hover:opacity-60 transition-opacity text-black">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 text-xs font-bold bg-blue-500 text-white rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 transition-opacity hover:opacity-60 text-black"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200 py-4 space-y-1 pb-4">
            <Link
              href="/shop"
              className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brands
            </Link>
            <Link
              href="/about"
              className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left text-sm font-semibold text-black hover:text-red-500 px-3 py-2"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-sm font-semibold text-black hover:text-blue-500 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
