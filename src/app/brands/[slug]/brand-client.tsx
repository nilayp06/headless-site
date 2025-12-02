"use client";

import ProductCard from "@/components/ProductCard";

export default function BrandClient({
  brand,
  products,
}: {
  brand: { name: string; image?: string | null };
  products: any[];
}) {
  return (
    <main className="max-w-7xl mx-auto p-8 bg-white text-gray-900">
      <div className="flex items-center gap-6 mb-10">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.name}
            className="w-24 h-24 object-contain border rounded-lg"
          />
        )}
        <h1 className="text-3xl font-bold">{brand.name}</h1>
      </div>

      {products.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {products.map((p: any) => (
            <ProductCard
              key={p.databaseId}
              product={{
                id: p.databaseId,
                name: p.name,
                slug: p.slug,
                price: parseFloat(p.price || "0"),
                image: p.image?.sourceUrl || "/placeholder.png",
              }}
            />
          ))}
        </div>
      ) : (
        <p>No products found for this brand.</p>
      )}
    </main>
  );
}
