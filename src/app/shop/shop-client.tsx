"use client"

import { useState, useEffect } from "react"
import { client } from "@/lib/graphql-client"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, X } from "lucide-react"

export default function ShopClient({
  categories,
  brands,
  initialProducts,
  initialBrand,
}: {
  categories: any[]
  brands: any[]
  initialProducts: any[]
  initialBrand: string | null
}) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const fetchByBrand = async (brand?: string | null) => {
    setLoading(true)
    try {
      const q = `
        query ShopData($brand: String) {
          products(first: 60, where: { brand: $brand }) {
            nodes {
              databaseId
              name
              slug
              ... on SimpleProduct { price(format: RAW) }
              image { sourceUrl }
            }
          }
        }
      `
      const res = await client.request(q, { brand })
      setProducts(res?.products?.nodes || [])
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBrand) {
      fetchByBrand(selectedBrand)
    } else {
      setProducts(initialProducts)
    }
  }, [selectedBrand, initialProducts])

  const handleBrandChange = (brand: string) => {
    const newBrand = selectedBrand === brand ? null : brand
    setSelectedBrand(newBrand)

    const params = new URLSearchParams(window.location.search)
    if (newBrand) params.set("brand", newBrand)
    else params.delete("brand")

    router.replace(`/shop?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-black mb-3">
            {selectedBrand ? `${selectedBrand}` : "Shop All Products"}
          </h1>
          <p className="text-base text-gray-600">
            {selectedBrand ? `Browse all ${selectedBrand} products` : `Explore our complete collection`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        <aside className={`lg:block ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-xl font-bold text-black">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-black uppercase tracking-wide mb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-gray-700 hover:text-blue-500 transition-colors flex items-center gap-2 font-medium"
                    >
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-black uppercase tracking-wide mb-4">Brands</h3>
              <ul className="space-y-3">
                {brands.map((brand) => (
                  <li key={brand.slug}>
                    <button
                      onClick={() => handleBrandChange(brand.slug)}
                      className={`text-sm transition-colors flex items-center gap-2 w-full font-medium ${selectedBrand === brand.slug ? "text-blue-500 font-bold" : "text-gray-700 hover:text-blue-500"
                        }`}
                    >
                      <ChevronRight size={16} className={selectedBrand === brand.slug ? "opacity-100" : "opacity-0"} />
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black font-semibold hover:bg-gray-300 transition-all text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <section className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600 font-medium mb-6">No products found.</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.databaseId}
                  product={{
                    id: p.databaseId,
                    name: p.name,
                    slug: p.slug,
                    price: Number.parseFloat(p.price || "0"),
                    image: p.image?.sourceUrl || "/placeholder.svg",
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
