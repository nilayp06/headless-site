// src/app/api/place-order/route.ts
import { NextResponse } from "next/server";

type ReqBody = {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing: any;
  shipping?: any;
  line_items?: Array<{ product_id: number; quantity: number }>;
  cart?: any;
};

function getWooCreds() {
  // prefer server-only envs
  const baseRaw = process.env.WC_URL || process.env.NEXT_PUBLIC_WC_URL || "";
  const base = baseRaw.replace?.(/\/$/, "") || "";
  const key = process.env.WC_KEY || process.env.NEXT_PUBLIC_WC_KEY || "";
  const secret = process.env.WC_SECRET || process.env.NEXT_PUBLIC_WC_SECRET || "";
  return { base, key, secret };
}

async function createWooOrder(base: string, key: string, secret: string, payload: any) {
  const url = `${base}/wp-json/wc/v3/orders?consumer_key=${encodeURIComponent(
    key,
  )}&consumer_secret=${encodeURIComponent(secret)}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await resp.text();
  let parsed: any;
  try {
    parsed = JSON.parse(body);
  } catch (e) {
    parsed = { raw: body };
  }
  return { ok: resp.ok, status: resp.status, body: parsed };
}

export async function POST(req: Request) {
  try {
    const { base, key, secret } = getWooCreds();

    if (!base || !key || !secret) {
      console.error("Missing WooCommerce credentials on server (WC_URL/WC_KEY/WC_SECRET).");
      return NextResponse.json(
        { error: true, message: "Missing WooCommerce credentials on server. Please set WC_URL, WC_KEY, WC_SECRET." },
        { status: 500 }
      );
    }

    const body: ReqBody = await req.json().catch(() => ({}));
    if (!body || !body.billing || !Array.isArray(body.line_items) || body.line_items.length === 0) {
      return NextResponse.json({ error: true, message: "Invalid payload: billing and line_items are required." }, { status: 400 });
    }

    // Build order payload for WooCommerce REST v3
    const wcPayload: any = {
      payment_method: body.payment_method || "cod",
      payment_method_title: body.payment_method_title || "Cash on Delivery",
      set_paid: Boolean(body.set_paid),
      billing: body.billing,
      shipping: body.shipping || body.billing,
      line_items: body.line_items.map((li) => ({
        product_id: Number(li.product_id),
        quantity: Number(li.quantity),
      })),
      // optionally include meta or fees if you need to preserve client cart
      meta_data: [
        { key: "_placed_from_headless", value: "true" },
        { key: "_client_cart", value: JSON.stringify(body.cart || []) },
      ],
    };

    const { ok, status, body: respBody } = await createWooOrder(base, key, secret, wcPayload);

    if (!ok) {
      console.error("WooCommerce create order failed", { status, respBody });
      // Try to parse helpful message
      const msg =
        respBody?.message ||
        respBody?.code ||
        (typeof respBody === "object" ? JSON.stringify(respBody) : String(respBody));
      return NextResponse.json({ error: true, message: msg || "WooCommerce order creation failed" }, { status: status || 500 });
    }

    // Success — return created order
    return NextResponse.json({ success: true, id: respBody.id, order: respBody }, { status: 201 });
  } catch (err: any) {
    console.error("API/place-order error:", err);
    return NextResponse.json({ error: true, message: err?.message || "Server error" }, { status: 500 });
  }
}
