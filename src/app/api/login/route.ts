import { NextResponse } from "next/server"

// This implementation assumes you have a JWT auth plugin enabled on your WordPress site
// that exposes: POST /wp-json/jwt-auth/v1/token with { username, password }

function getWpBase() {
  const raw = process.env.WC_URL || process.env.NEXT_PUBLIC_WC_URL || ""
  return raw.replace?.(/\/$/, "") || ""
}

export async function POST(req: Request) {
  try {
    const base = getWpBase()
    if (!base) {
      console.error("Missing WC_URL / NEXT_PUBLIC_WC_URL for login")
      return NextResponse.json(
        { error: true, message: "Missing WC_URL / NEXT_PUBLIC_WC_URL for login" },
        { status: 500 },
      )
    }

    const { email, password } = await req.json().catch(() => ({}))

    if (!email || !password) {
      return NextResponse.json({ error: true, message: "Email and password are required" }, { status: 400 })
    }

    const resp = await fetch(`${base}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    })

    const text = await resp.text()
    let body: any
    try {
      body = JSON.parse(text)
    } catch {
      body = { raw: text }
    }

    if (!resp.ok || body?.success === false) {
      const msg = body?.message || body?.code || (typeof body === "object" ? JSON.stringify(body) : String(body))
      return NextResponse.json({ error: true, message: msg || "Login failed" }, { status: resp.status || 401 })
    }

    // body typically contains token, user_email, user_nicename, user_display_name
    return NextResponse.json(
      {
        success: true,
        token: body.token,
        user: {
          email: body.user_email,
          username: body.user_nicename,
          displayName: body.user_display_name,
        },
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("API/login error:", err)
    return NextResponse.json({ error: true, message: err?.message || "Server error" }, { status: 500 })
  }
}
