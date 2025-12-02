import { client } from "@/lib/graphql-client"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: { brand?: string }
}) {
  const { slug } = await params
  const brandSlug = searchParams?.brand || null

  if (!slug) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Category not found</h1>
        </div>
      </main>
    )
  }

  const query = `
    query CatWithSidebar($slug: [String], $brand: String) {
      products(first: 60, where: { categoryIn: $slug, brand: $brand }) {
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
      allCategories: productCategories(first: 100) {
        nodes {
          id
          name
          slug
        }
      }
      allBrands: productBrands(first: 100) {
        nodes { id name slug }
      }
      currentCategory: productCategories(where: { slug: $slug }) {
        nodes { id name slug }
      }
    }
  `

  try {
    const res = await client.request(query, { slug: [slug], brand: brandSlug || undefined })

    const products = res?.products?.nodes || []
    const categories = res?.allCategories?.nodes || []
    const brands = res?.allBrands?.nodes || []
    const categoryName = res?.currentCategory?.nodes?.[0]?.name || slug

    return (
      <main className="w-full bg-background">
        <div className="w-full bg-secondary py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-3">{categoryName}</h1>
            <p className="text-base text-muted-foreground font-light">
              {brandSlug ? `Filtered by ${brandSlug}` : "Browse all products in this collection"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1 space-y-8 border-b lg:border-b-0 lg:border-r border-border lg:pr-12 pb-8 lg:pb-0">
              {/* Categories Links */}
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
                        className={`text-sm transition-colors flex items-center gap-2 group ${cat.slug === slug
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <ChevronRight
                          size={16}
                          className={
                            cat.slug === slug ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
                          }
                        />
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-6">Brands</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/categories/${slug}`}
                      className={`text-sm transition-colors flex items-center gap-2 group ${!brandSlug ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <ChevronRight
                        size={16}
                        className={!brandSlug ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}
                      />
                      All Brands
                    </Link>
                  </li>
                  {brands.map((b: any) => (
                    <li key={b.slug}>
                      <Link
                        href={`/categories/${slug}?brand=${b.slug}`}
                        className={`text-sm transition-colors flex items-center gap-2 group ${brandSlug === b.slug
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <ChevronRight
                          size={16}
                          className={
                            brandSlug === b.slug
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 transition-opacity"
                          }
                        />
                        {b.name}
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
                  <p className="text-lg text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    )
  } catch (err: any) {
    console.error("Error loading category:", slug, err)
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Error loading category</h1>
          <p className="text-muted-foreground mt-4">{err.message}</p>
        </div>
      </main>
    )
  }
}
