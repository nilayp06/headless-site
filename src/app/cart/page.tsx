"use client"

import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingCartIcon } from "lucide-react"
import { motion } from "framer-motion"

// -------------------------
// Cart Item Type Definition
// -------------------------
interface CartItem {
  id: string | number
  name: string
  price: number
  qty: number
  image?: string
}

export default function CartPage() {
  const { cart, remove, updateQty, total } = useCart()
  const router = useRouter()

  if (!cart || cart.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-6 bg-gray-100 rounded-full">
                <ShoppingCartIcon size={48} className="text-gray-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black">Your bag is empty</h1>
            <p className="text-lg text-gray-600 font-medium">Add items to get started.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl lg:text-4xl font-bold text-black">Bag</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item: CartItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-6 p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        <Link href={`/product/${item.id}`} className="hover:text-blue-500 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-lg font-semibold text-black">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          className="px-4 py-2 hover:bg-gray-100 font-semibold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <div className="px-4 py-2 min-w-12 text-center font-semibold">{item.qty}</div>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-4 py-2 hover:bg-gray-100 font-semibold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => remove(item.id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col justify-center">
                    <p className="text-lg font-semibold text-black">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="border border-gray-200 rounded-lg p-8 space-y-6 sticky top-24 bg-white">
              <h2 className="text-xl font-bold text-black">Summary</h2>

              <div className="space-y-4 py-6 border-y border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-black">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-black">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-black">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
              >
                Checkout
              </button>

              <Link
                href="/shop"
                className="block text-center text-sm text-gray-600 hover:text-blue-500 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
