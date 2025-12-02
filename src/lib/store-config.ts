export async function getStoreSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/v3/settings/general`, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${process.env.WC_KEY}:${process.env.WC_SECRET}`).toString("base64"),
    },
    next: { revalidate: 3600 }, // cache 1h for performance
  })

  if (!res.ok) throw new Error("Failed to fetch store settings")

  const data = await res.json()
  const currencyOption = data.find((setting: any) => setting.id === "woocommerce_currency")
  const currencyCode = currencyOption ? currencyOption.value : "USD"

  const symbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  }

  return {
    currencyCode,
    currencySymbol: symbols[currencyCode] || "$",
  }
}
