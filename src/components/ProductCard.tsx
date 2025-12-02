"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/components/ToastProvider"
import { ShoppingCart } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function ProductCard({ product }: { product: any }) {
  const { add } = useCart()
  const { show } = useToast()
   const { token } = useAuth()

  const price =
    typeof product.price === "number"
      ? product.price
      : Number.parseFloat(product.price || "0") || 0

  const productHref = `/product/${product.slug ?? product.id ?? ""}`

  const handleAdd = () => {
    add({
      id: Number(product.id ?? 0),
      name: product.name,
      price,
      image: product.image,
      qty: 1,
    })

    show(`${product.name} added to cart`)
  }

  const isLoggedIn = Boolean(token)

  return (
    <article className="group">
      <div className="space-y-4">
        <Link href={productHref} className="block overflow-hidden">
          <div className="bg-gray-100 aspect-square relative overflow-hidden rounded-2xl border border-lightgray-800">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 "
            />
          </div>
        </Link>

        <Link href={productHref}>
          <h3 className="text-sm font-semibold text-black group-hover:text-blue-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          {isLoggedIn ? (
            <>
              <p className="text-base font-semibold text-black">${price.toFixed(2)}</p>

              <button
                onClick={handleAdd}
                className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={18} />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">Login to see price</span>
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
