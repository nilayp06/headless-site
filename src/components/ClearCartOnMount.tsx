// src/components/ClearCartOnMount.tsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext"; // adjust import path to your cart context

export default function ClearCartOnMount() {
    const { clearCart } = useCart();

    useEffect(() => {
        // Delay/double-check to avoid race conditions in some browsers
        // Clear the cart once user reached the thank-you page.
        if (typeof window !== "undefined") {
            try {
                clearCart?.();
            } catch (err) {
                console.warn("Failed to clear cart on thank-you mount:", err);
            }
        }
    }, [clearCart]);

    return null;
}
