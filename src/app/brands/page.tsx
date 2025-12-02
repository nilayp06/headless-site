import { client } from "@/lib/graphql-client"
import Link from "next/link"

export default async function BrandsPage() {
  const query = `
    query AllBrands {
      productBrands(first: 100) {
        nodes {
          id
          name
          slug
          image { sourceUrl } 
        }
      }
    }
  `

  let res: any
  try {
    res = await client.request(query)
  } catch (err: any) {
    console.error("Error fetching brands:", err)
    return (
      <main className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500">Failed to load brands</h1>
          <p className="mt-3 text-gray-600">{err.message}</p>
        </div>
      </main>
    )
  }

  const brands = res?.productBrands?.nodes || []

  return (
    <main className="w-full bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-black mb-3">Featured Brands</h1>
          <p className="text-base text-gray-600">Discover premium brands we partner with</p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {brands.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600">No brands found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {brands.map((brand: any) => (
                <Link key={brand.id} href={`/brands/${brand.slug}`} className="group">
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center border border-lightgray-800">
                    {brand.image?.sourceUrl ? (
                      <img
                        src={brand.image.sourceUrl || "/placeholder.svg"}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700 text-center px-4">
                          {brand.name?.charAt(0) ?? "B"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-center text-base font-semibold text-black group-hover:text-blue-500 transition-colors line-clamp-1">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
