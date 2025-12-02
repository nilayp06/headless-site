// src/components/CheckoutForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext"; // adjust as necessary

export default function CheckoutForm() {
    const router = useRouter();
    const { getCartPayload, clearCart } = useCart(); // assume helpers exist
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = getCartPayload ? getCartPayload() : { /* build order payload */ };

            const res = await fetch("/api/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to place order");
            }

            const data = await res.json();
            const orderId = data?.orderId || data?.id || data?.order?.id;
            if (!orderId) throw new Error("No order id returned");

            // navigate to server-rendered thank-you page
            await router.push(`/thank-you/${orderId}`);

            // Clear the client cart after user reaches thank-you page
            clearCart?.();

            // optionally set local state or analytics events here

        } catch (err: any) {
            console.error("Place order failed:", err);
            setError(err?.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* your billing/shipping inputs */}
            <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded"
                disabled={loading}
            >
                {loading ? "Placing order…" : "Place order"}
            </button>

            {error && <div className="mt-2 text-red-500">{error}</div>}
        </form>
    );
}
