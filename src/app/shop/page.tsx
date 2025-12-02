// src/app/shop/page.tsx
import { client } from "@/lib/graphql-client";
import ShopClient from "./shop-client";

export default async function Shop({ searchParams }: { searchParams?: { brand?: string; category?: string } }) {
  const brandSlug = searchParams?.brand || null;
  const categorySlug = searchParams?.category || null;

  // ✅ Fetch everything server-side for instant first load
  // NOTE: productCategories must be requested inside inline fragments because
  // `products.nodes` is a ProductUnion — fields on concrete product types must be requested via fragments.
  const query = `
    query ShopInit {
      productCategories(first: 100) {
        nodes { id name slug }
      }
      productBrands(first: 100) {
        nodes { id name slug }
      }
      products(first: 60) {
        nodes {
          databaseId
          name
          slug
          ... on SimpleProduct { price(format: RAW) }
          image { sourceUrl }

          # productCategories is only available on concrete product types — use inline fragments:
          ... on SimpleProduct { productCategories { nodes { id slug name } } }
          ... on VariableProduct { productCategories { nodes { id slug name } } }
          ... on GroupProduct { productCategories { nodes { id slug name } } }
          ... on ExternalProduct { productCategories { nodes { id slug name } } }
          ... on Product { productCategories { nodes { id slug name } } }
        }
      }
    }
  `;

  const res = await client.request(query);

  const categories = res?.productCategories?.nodes || [];
  const brands = res?.productBrands?.nodes || [];
  const allProducts = res?.products?.nodes || [];

  return (
    <ShopClient
      categories={categories}
      brands={brands}
      initialProducts={allProducts}
      initialBrand={brandSlug}
      initialCategory={categorySlug}
    />
  );
}
