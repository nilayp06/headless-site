import Link from "next/link"
import { client } from "@/lib/graphql-client"

export default async function CategoriesCarousel() {
  const query = `
    query GetCategories {
      productCategories(first: 20) {
        nodes { 
          databaseId
          id
          name
          slug
          image { sourceUrl } 
        }
      }
    }
  `

  const { productCategories } = await client.request(query)
  const catsRaw = productCategories?.nodes || []

  const cats = catsRaw
    .slice()
    .sort((a: any, b: any) => (b.databaseId || 0) - (a.databaseId || 0))
    .slice(0, 4)

  return (
    <nav aria-label="Shop categories">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {cats.map((c: any) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group block"
            aria-label={`View category ${c.name}`}
          >
            <div className="overflow-hidden bg-secondary aspect-square mb-3">
              <img
                src={c.image?.sourceUrl || "/placeholder.svg?height=300&width=300&query=category"}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-sm font-light text-foreground group-hover:opacity-60 transition-opacity truncate">
              {c.name}
            </h3>
          </Link>
        ))}
      </div>
    </nav>
  )
}
