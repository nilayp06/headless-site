import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Cart is stored per user as a single JSON blob in the `carts` table.
// Table schema (run in Supabase SQL editor):
// create table if not exists carts (
//   user_email text primary key,
//   items jsonb not null default '[]'::jsonb,
//   updated_at timestamptz not null default now()
// );

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("carts")
    .select("items")
    .eq("user_email", userEmail)
    .maybeSingle();

  if (error) {
    console.error("Supabase GET cart error", error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }

  return NextResponse.json({ items: (data?.items as any[]) || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, items } = body as { userEmail?: string; items?: any[] };

    if (!userEmail) {
      return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const { error } = await supabase
      .from("carts")
      .upsert(
        {
          user_email: userEmail,
          items,
        },
        {
          onConflict: "user_email",
        }
      );

    if (error) {
      console.error("Supabase POST cart error", error);
      return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/cart error", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
