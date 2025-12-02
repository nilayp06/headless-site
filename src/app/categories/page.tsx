import { client } from "@/lib/graphql-client"
import Link from "next/link"

export default async function CategoriesPage() {
  const q = `
    query AllCategories {
      productCategories(first: 100) {
        nodes {
          id
          name
          slug
          image {
            sourceUrl
          }
        }
      }
    }
  `

  const res = await client.request(q)
  const categories = res?.productCategories?.nodes || []

  return (
    <main className="w-full bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-black mb-3">Collections</h1>
          <p className="text-base text-gray-600">Explore our curated product categories</p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 relative border border-lightgray-800">
                    <img
                      src={cat.image?.sourceUrl || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h2 className="text-base font-semibold text-black group-hover:text-blue-500 transition-colors line-clamp-1">
                    {cat.name}
                  </h2>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600">No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
