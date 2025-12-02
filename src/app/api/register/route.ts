import { NextResponse } from "next/server"

function getWooCreds() {
  const baseRaw = process.env.WC_URL || process.env.NEXT_PUBLIC_WC_URL || ""
  const base = baseRaw.replace?.(/\/$/, "") || ""
  const key = process.env.WC_KEY || process.env.NEXT_PUBLIC_WC_KEY || ""
  const secret = process.env.WC_SECRET || process.env.NEXT_PUBLIC_WC_SECRET || ""
  return { base, key, secret }
}

export async function POST(req: Request) {
  try {
    const { base, key, secret } = getWooCreds()

    if (!base || !key || !secret) {
      console.error("Missing WooCommerce credentials on server (WC_URL/WC_KEY/WC_SECRET).")
      return NextResponse.json(
        { error: true, message: "Missing WooCommerce credentials on server. Please set WC_URL, WC_KEY, WC_SECRET." },
        { status: 500 },
      )
    }

    const { name, email, password } = await req.json().catch(() => ({}))

    if (!email || !password) {
      return NextResponse.json({ error: true, message: "Email and password are required" }, { status: 400 })
    }

    const payload: any = {
      email,
      username: email,
      password,
    }

    if (name) {
      payload.first_name = name
    }

    const url = `${base}/wp-json/wc/v3/customers?consumer_key=${encodeURIComponent(
      key,
    )}&consumer_secret=${encodeURIComponent(secret)}`

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const text = await resp.text()
    let body: any
    try {
      body = JSON.parse(text)
    } catch {
      body = { raw: text }
    }

    if (!resp.ok) {
      const msg = body?.message || body?.code || (typeof body === "object" ? JSON.stringify(body) : String(body))
      return NextResponse.json({ error: true, message: msg || "WooCommerce customer creation failed" }, { status: resp.status })
    }

    return NextResponse.json({ success: true, customer: body }, { status: 201 })
  } catch (err: any) {
    console.error("API/register error:", err)
    return NextResponse.json({ error: true, message: err?.message || "Server error" }, { status: 500 })
  }
}
