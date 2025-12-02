import Link from "next/link"
import { client } from "@/lib/graphql-client"
import ProductCard from "@/components/ProductCard"
import Slider from "@/components/Slider"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const query = `
    query HomeData {
      products(first: 8, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          databaseId
          id
          name
          slug
          image { sourceUrl }
          ... on SimpleProduct { price(format: RAW) }
        }
      }
      productCategories(first: 100) {
        nodes {
          id
          name
          slug
          image { sourceUrl }
        }
      }
    }
  `

  const { products, productCategories } = await client.request(query)

  const newArrivals = (products?.nodes || []).slice(0, 4).map((p: any) => ({
    id: p.databaseId,
    name: p.name,
    slug: p.slug,
    price: p.price ?? null,
    image: p.image?.sourceUrl || "/placeholder.svg",
  }))

  const categories = (productCategories?.nodes || []).slice(0, 4)

  return (
    <main className="w-full bg-white">
      {/* Hero Slider Section */}
      <section className="w-full">
        <Slider />
      </section>

      {/* Features Section */}
      <section className="w-full py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <h3 className="text-base lg:text-lg font-semibold text-black mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50. Fast delivery to your door.</p>
            </div>
            <div className="text-center">
              <h3 className="text-base lg:text-lg font-semibold text-black mb-2">Secure Checkout</h3>
              <p className="text-sm text-gray-600">100% encrypted payments. Your data is safe.</p>
            </div>
            <div className="text-center">
              <h3 className="text-base lg:text-lg font-semibold text-black mb-2">24-Hour Support</h3>
              <p className="text-sm text-gray-600">We're here to help with any questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      {categories.length > 0 && (
        <section className="w-full py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-black text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 lg:gap-8">
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 relative border border-lightgray-800">
                    <img
                      src={cat.image?.sourceUrl || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-center text-base font-semibold text-black group-hover:text-blue-500 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Two Image Banners Section */}
      <section className="w-full py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <Link href="/brands/lost-mary" className="group">
              <div className="w-full aspect-rectangle lg:aspect-[700/300] bg-gray-200 rounded-2xl overflow-hidden relative">
                <img
                  src="https://headlesswp.dev.brainbean.us/wp-content/uploads/2025/11/LostMaryVapes.webp"
                  alt="Featured Collection 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <Link href="/shop" className="group">
              <div className="w-full aspect-rectangle lg:aspect-[700/300] bg-gray-200 rounded-2xl overflow-hidden relative">
                <img
                  src="https://headlesswp.dev.brainbean.us/wp-content/uploads/2025/11/geekVape.webp"
                  alt="Featured Collection 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="w-full py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-black text-center mb-12">New Arrivals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="w-full py-20 lg:py-24 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Explore Our Full Collection</h2>
          <p className="text-base lg:text-lg text-gray-300 mb-10">
            Discover thousands of premium products curated just for you.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  )
}
