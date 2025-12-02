import { client } from "@/lib/graphql-client";

export default async function CategoryGrid() {
  const query = `
    query GetCategories {
      productCategories(first: 6) {
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
  `;

  const { productCategories } = await client.request(query);

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-6">Our Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productCategories.nodes.map((cat: any) => (
          <a
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="text-center hover:scale-105 transition"
          >
            <img
              src={cat.image?.sourceUrl}
              alt={cat.name}
              className="rounded-lg shadow-sm mb-2 h-32 w-full object-cover"
            />
            <p className="font-medium">{cat.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
