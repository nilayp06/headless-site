import { client } from "@/lib/graphql-client"
import ProductClient from "./product-client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default async function ProductPage(props: any) {
  const params = await props.params
  const slug = params?.slug
  if (!slug)
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-destructive">Product not found</h1>
        </div>
      </main>
    )

  const q = `
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        databaseId
        name
        description
        shortDescription
        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
          salePrice(format: RAW)
        }
        image { sourceUrl altText }
        productCategories { nodes { name slug } }
      }
    }
  `

  const res = await client.request(q, { slug })
  const p = res?.product
  if (!p)
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-destructive">Product not found</h1>
        </div>
      </main>
    )

  const product = {
    id: p.databaseId,
    name: p.name,
    price: Number.parseFloat(p.salePrice || p.price || p.regularPrice || "0"),
    description: p.description,
    shortDescription: p.shortDescription,
    image: p.image?.sourceUrl || "/diverse-products-still-life.png",
    category: p.productCategories?.nodes?.[0],
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-b border-border bg-gradient-to-r to-transparent">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link href="/shop" className="hover:text-primary transition-colors font-medium">
            Shop
          </Link>
          <ChevronRight size={16} />
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-primary transition-colors font-medium"
              >
                {product.category.name}
              </Link>
              <ChevronRight size={16} />
            </>
          )}
          <span className="text-foreground font-bold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex items-center justify-center bg-gradient-to-br from-secondary to-muted rounded-2xl overflow-hidden aspect-square shadow-lg">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-start">
            {product.category && (
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">{product.category.name}</p>
            )}

            <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight text-balance">
              {product.name}
            </h1>

            <p className="text-3xl lg:text-4xl font-bold text-foreground mb-6">${product.price.toFixed(2)}</p>

            {product.shortDescription && (
              <div className="text-base text-muted-foreground leading-relaxed mb-8 prose prose-invert max-w-none">
                <p>{product.shortDescription.replace(/<[^>]*>/g, "")}</p>
              </div>
            )}

            {/* Product Client (Quantity + Add to Cart) */}
            <div className="mb-10">
              <ProductClient product={product} />
            </div>

            {product.description && (
              <div className="border-t border-border pt-8">
                <h2 className="text-lg font-bold mb-4">Description</h2>
                <div className="text-sm text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                  <p>{product.description.replace(/<[^>]*>/g, "").substring(0, 300)}...</p>
                </div>
              </div>
            )}

            {/* Additional Info with creative badges */}
            <div className="border-t border-border mt-8 pt-8 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">✓</span>
                </div>
                <p>Free shipping on orders over $100</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <span className="text-accent font-bold text-lg">↩</span>
                </div>
                <p>30-day return policy for all items</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">🔒</span>
                </div>
                <p>Secure checkout with SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

