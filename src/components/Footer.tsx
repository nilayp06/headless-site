"use client"

import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wide text-black mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <Link href="/shop" className="hover:text-black transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-black transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-black transition-colors">
                  Brands
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wide text-black mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wide text-black mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wide text-black mb-6">Connect</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {currentYear} All rights reserved.</p>
          <p>Premium retail experience</p>
        </div>
      </div>
    </footer>
  )
}
