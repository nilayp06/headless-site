import { client } from "@/lib/graphql-client"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { ChevronRight } from "lucide-react"

export default async function BrandPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  if (!slug) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Brand not found</h1>
        </div>
      </main>
    )
  }

  const query = `
    query ProductsByBrandWithCategories($slug: String!) {
      products(first: 60, where: { brand: $slug }) {
        nodes {
          databaseId
          name
          slug
          ... on SimpleProduct { price(format: RAW) }
          image { sourceUrl }
          ... on SimpleProduct { productCategories { nodes { name } } }
          ... on VariableProduct { productCategories { nodes { name } } }
          ... on GroupProduct { productCategories { nodes { name } } }
          ... on ExternalProduct { productCategories { nodes { name } } }
          ... on Product { productCategories { nodes { name } } }
        }
      }
      productBrands(where: { slug: [$slug] }) {
        nodes {
          name
          slug
          image { sourceUrl }
        }
      }
      allCategories: productCategories(first: 100) {
        nodes { id name slug }
      }
    }
  `

  let res: any
  try {
    res = await client.request(query, { slug: slug })
  } catch (err: any) {
    console.error("Error fetching brand:", err)
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Error loading brand</h1>
          <p className="text-muted-foreground mt-4">{err.message}</p>
        </div>
      </main>
    )
  }

  const products = res?.products?.nodes || []
  const brand = res?.productBrands?.nodes?.[0]
  const brandData = {
    name: brand?.name || slug,
    image: brand?.image?.sourceUrl || null,
  }
  const categories = res?.allCategories?.nodes || []

  return (
    <main className="w-full bg-background">
      <div className="w-full bg-secondary py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            {brandData.image && (
              <img
                src={brandData.image || "/placeholder.svg"}
                alt={brandData.name}
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight">{brandData.name}</h1>
              <p className="text-base text-muted-foreground font-light mt-2">Discover our collection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 space-y-8 border-b lg:border-b-0 lg:border-r border-border lg:pr-12 pb-8 lg:pb-0">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-6">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/categories"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    All Categories
                  </Link>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p: any) => (
                  <ProductCard
                    key={p.databaseId}
                    product={{
                      id: p.databaseId,
                      name: p.name,
                      slug: p.slug,
                      price: Number.parseFloat(p.price || "0"),
                      image: p.image?.sourceUrl || "/diverse-products-still-life.png",
                      category: p.productCategories?.nodes?.[0]?.name,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No products found for this brand.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
