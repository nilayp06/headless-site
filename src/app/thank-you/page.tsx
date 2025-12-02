// src/app/thank-you/page.tsx
import React from "react";
import Link from "next/link";
import ClearCartOnMount from "@/components/ClearCartOnMount";

type WooOrder = any;

async function fetchOrderFromWoo(orderId: string): Promise<WooOrder | null> {
  try {
    // Prefer server-only envs; fallback to NEXT_PUBLIC_* for dev only
    const baseRaw = process.env.WC_URL || process.env.NEXT_PUBLIC_WC_URL || "";
    const key = process.env.WC_KEY || process.env.NEXT_PUBLIC_WC_KEY || "";
    const secret = process.env.WC_SECRET || process.env.NEXT_PUBLIC_WC_SECRET || "";

    const base = baseRaw.replace?.(/\/$/, "") || "";

    if (!base || !key || !secret) {
      console.error("WooCommerce credentials missing (WC_URL/WC_KEY/WC_SECRET).");
      return null;
    }

    const auth = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");

    const res = await fetch(`${base}/wp-json/wc/v3/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });

    if (!res.ok) {
      // log body for debugging
      let bodyText = await res.text().catch(() => "");
      try {
        const parsed = JSON.parse(bodyText);
        console.error("Woo fetch error:", res.status, parsed);
      } catch {
        console.error("Woo fetch error:", res.status, bodyText);
      }
      return null;
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: { order?: string };
}) {
  const orderId = searchParams?.order;

  // If an order query param exists, try to fetch it and render the order details
  if (orderId) {
    const order = await fetchOrderFromWoo(orderId);

    if (!order) {
      return (
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-semibold text-foreground">Error Loading Order</h1>
              <p className="text-muted-foreground">
                We couldn't find your order. Please try again or contact support.
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <Link
                  href="/shop"
                  className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="px-5 py-3 border border-border rounded-lg text-foreground"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      );
    }

    // Render order summary
    const customer = order.billing || order.customer || {};
    const items = order.line_items || order.items || [];

    return (
      <main className="min-h-screen bg-background">
        {/* client component clears client cart once mounted */}
        <ClearCartOnMount />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-semibold text-foreground mb-2">Thank You for Your Order!</h1>
            <p className="text-lg text-muted-foreground">
              Your order <span className="font-semibold text-foreground">#{order.id}</span> has been successfully placed.
            </p>
            <p className="text-sm text-muted-foreground mt-1">A confirmation email was sent to {order.billing?.email || "your email"}.</p>
          </div>

          {/* Order Details */}
          <div className="border border-border rounded-lg p-8 space-y-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Details</h2>
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={item.id || item.product_id || Math.random()} className="flex justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity ?? item.qty ?? 1}</p>
                    </div>
                    <p className="font-semibold text-foreground">${Number.parseFloat(item.total || item.price || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${Number.parseFloat(order.subtotal || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">${Number.parseFloat(order.shipping_total || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-foreground">${Number.parseFloat(order.total || "0").toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-foreground mb-2"><strong>Delivery Address:</strong></p>
              <p className="text-sm text-muted-foreground">
                {order.billing?.first_name} {order.billing?.last_name}
                <br />
                {order.billing?.address_1}
                <br />
                {order.billing?.city}, {order.billing?.state} {order.billing?.postcode}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/shop" className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-center font-medium">
              Continue Shopping
            </Link>
            <Link href="/" className="flex-1 px-6 py-3 border border-border rounded-lg text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // No order query — show a simple thank-you landing (not the homepage)
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold mb-2">Thank you — your order is being processed</h1>
          <p className="text-muted-foreground">We’ll email your order confirmation shortly.</p>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <Link href="/shop" className="px-5 py-3 bg-primary text-primary-foreground rounded-lg">
            Continue Shopping
          </Link>
          <Link href="/categories" className="px-5 py-3 border border-border rounded-lg">
            Shop by Category
          </Link>
          <Link href="/brands" className="px-5 py-3 border border-border rounded-lg">
            Shop by Brand
          </Link>
        </div>
      </div>
    </main>
  );
}
