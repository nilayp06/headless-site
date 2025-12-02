// src/lib/woo-client.ts
import fetch from "node-fetch";

const WC_BASE = process.env.WC_BASE_URL; // e.g. https://your-wp-site.com/wp-json/wc/v3
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WC_BASE || !WC_KEY || !WC_SECRET) {
    // Do not throw at import time in case you want to run in environments without envs.
    // But log to help debugging.
    // console.warn("WooCommerce env vars not configured (WC_BASE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET).");
}

export async function getOrderById(orderId: string) {
    if (!WC_BASE || !WC_KEY || !WC_SECRET) {
        throw new Error("WooCommerce credentials not configured for server order fetch.");
    }

    const url = `${WC_BASE}/orders/${encodeURIComponent(orderId)}?consumer_key=${encodeURIComponent(WC_KEY)}&consumer_secret=${encodeURIComponent(WC_SECRET)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch order ${orderId}: ${res.status} ${txt}`);
    }

    const json = await res.json();
    return json;
}
