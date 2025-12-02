// src/app/checkout/page.tsx
"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clear } = useCart();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        router.replace("/login");
      } else if (user?.email) {
        setForm((prev) => ({ ...prev, email: user.email || prev.email }));
      }
    }
  }, [authLoading, token, user?.email, router]);

  if (authLoading) {
    return null;
  }

  if (!token) {
    return null;
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-black">Your bag is empty</h1>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    // Basic required fields
    if (!form.first_name || !form.email || !form.address_1) {
      alert("Please fill in First name, Email and Address.");
      return;
    }

    // Normalize cart items to minimal shape expected
    const safeCart = (cart || [])
      .map((i: any) => ({
        id: i.id ?? i.product_id ?? i.databaseId ?? null,
        qty: Number(i.qty ?? i.quantity ?? 1),
        price: Number(i.price ?? 0),
      }))
      .filter((i: any) => i.id !== null && i.qty > 0);

    if (!safeCart.length) {
      alert("Your cart appears empty");
      return;
    }

    setLoading(true);
    try {
      const billing = {
        first_name: form.first_name,
        last_name: form.last_name,
        address_1: form.address_1,
        city: form.city,
        state: form.state,
        postcode: form.postcode || "",
        country: form.country || "US",
        email: form.email,
        phone: form.phone || "",
      };

      const shipping = { ...billing };

      const line_items = safeCart.map((i: any) => ({
        product_id: Number(i.id),
        quantity: Number(i.qty),
      }));

      const clientCartShape = safeCart.map((i: any) => ({
        product_id: Number(i.id),
        quantity: Number(i.qty),
        price: Number(i.price),
      }));

      const payload: any = {
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        set_paid: false,
        billing,
        shipping,
        line_items,
        cart: clientCartShape, // for your internal reference if needed
      };

      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        // If non-JSON returned
        throw new Error(`Order failed (status ${res.status})`);
      }

      if (!res.ok) {
        // Friendly mapping for known conditions
        const bodyMsg = (data?.message || data?.error || data?.detail || JSON.stringify(data) || "").toString();

        if (bodyMsg.toLowerCase().includes("missing keys") || bodyMsg.toLowerCase().includes("missing credentials") || bodyMsg.toLowerCase().includes("credentials")) {
          // Show clear developer action
          alert(
            "Server cannot contact WooCommerce: missing or invalid credentials. Please set WC_URL, WC_KEY, WC_SECRET on the server (or temporarily NEXT_PUBLIC_WC_* for dev). Check terminal for more details."
          );
          console.error("Place-order server response:", data);
          throw new Error("Missing WooCommerce credentials on server.");
        }

        if (bodyMsg.toLowerCase().includes("cart empty") || bodyMsg.toLowerCase().includes("empty cart")) {
          throw new Error("Server rejected the order: cart is empty.");
        }

        throw new Error(bodyMsg || "Order failed");
      }

      // Success
      clear();
      const orderId = data?.id || data?.order?.id || data?.data?.id || data?.id?.toString?.() || null;

      if (orderId) {
        router.push(`/thank-you?order=${orderId}`);
      } else {
        console.warn("No order ID returned in response:", data);
        alert("Order placed successfully, but no order ID returned.");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Order error:", err);
      alert("Order error: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl lg:text-4xl font-bold text-black">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleOrder();
              }}
            >
              <div className="border border-gray-200 rounded-lg p-8">
                <h2 className="text-xl font-bold text-black mb-8">Billing Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">First Name *</label>
                    <input
                      name="first_name"
                      type="text"
                      required
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.first_name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Last Name</label>
                    <input
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.last_name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.phone}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-3">Address *</label>
                    <input
                      name="address_1"
                      type="text"
                      required
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.address_1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">City</label>
                    <input
                      name="city"
                      type="text"
                      placeholder="New York"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.city}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">State</label>
                    <input
                      name="state"
                      type="text"
                      placeholder="NY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.state}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Postcode</label>
                    <input
                      name="postcode"
                      type="text"
                      placeholder="10001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleChange}
                      value={form.postcode}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="border border-gray-200 rounded-lg p-8 space-y-6 sticky top-24 bg-white">
              <h2 className="text-xl font-bold text-black">Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm pb-3 border-b border-gray-200">
                    <span className="text-gray-600">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold text-black">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 py-6 border-y border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-black">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                {loading ? "Processing..." : "Place Order"}
              </button>

              <p className="text-xs text-center text-gray-600">Your payment information is secure and encrypted.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
