import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")

    if (!orderId) {
        return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    try {
        const base = process.env.NEXT_PUBLIC_WC_URL?.replace(/\/$/, "")
        const key = process.env.WC_KEY
        const secret = process.env.WC_SECRET

        if (!base || !key || !secret) {
            console.error("Missing WooCommerce configuration")
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        const res = await fetch(`${base}/wp-json/wc/v3/orders/${orderId}?consumer_key=${key}&consumer_secret=${secret}`, {
            cache: "no-store",
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Order not found" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error: any) {
        console.error("Error fetching order:", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}
