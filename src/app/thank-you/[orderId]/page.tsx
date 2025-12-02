// src/app/thank-you/[orderId]/page.tsx
import React from "react";
import { getOrderById } from "@/lib/woo-client";
import ClearCartOnMount from "@/components/ClearCartOnMount";

type Props = {
    params: { orderId: string };
};

export default async function ThankYouPage({ params }: Props) {
    const orderId = params?.orderId;
    if (!orderId) {
        return (
            <main className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
                <p className="mt-4">No order id provided.</p>
            </main>
        );
    }

    // Server-side fetch of order details using server credentials.
    // getOrderById must be a server-side function that calls WooCommerce REST (or GraphQL).
    let order;
    try {
        order = await getOrderById(orderId);
    } catch (err: any) {
        console.error("Error fetching order on thank-you page:", err);
        return (
            <main className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-red-600">Error loading order</h1>
                <p className="mt-4">{err?.message || "Unknown error"}</p>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold">Order not found</h1>
                <p className="mt-4">We couldn't find an order with id {orderId}.</p>
            </main>
        );
    }

    const customer = order.billing || order.customer || {};
    const items = order.line_items || order.items || [];

    // Render server-side order summary and customer info.
    return (
        <main className="max-w-4xl mx-auto p-8">
            {/* This client component clears the client-side cart once the page is mounted */}
            <ClearCartOnMount />

            <h1 className="text-3xl font-bold mb-4">Thank you — Order received</h1>

            <section className="mb-6">
                <div className="text-sm text-gray-600">Order</div>
                <div className="text-lg font-semibold">#{order.id || order.number || order.id}</div>
                <div className="text-sm text-gray-600">Placed on {new Date(order.date_created || order.date_created_gmt || order.created_at || Date.now()).toLocaleString()}</div>
                <div className="mt-2">Total: <strong>{order.total || order.price || order.total_formatted}</strong></div>
                <div className="mt-1">Payment method: {order.payment_method_title || order.payment_method || "—"}</div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Customer details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div>{customer.first_name ? `${customer.first_name} ${customer.last_name || ""}` : customer.name || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div>{customer.email || order.billing?.email || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div>{customer.phone || order.billing?.phone || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Shipping address</div>
                        <div>
                            {order.shipping?.address_1 ? (
                                <>
                                    <div>{order.shipping.address_1}</div>
                                    <div>{[order.shipping.city, order.shipping.state, order.shipping.postcode, order.shipping.country].filter(Boolean).join(", ")}</div>
                                </>
                            ) : (
                                <div>{order.billing?.address_1 || "—"}</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                <div className="space-y-4">
                    {items.map((it: any) => (
                        <div key={it.id || it.product_id || Math.random()} className="flex items-center gap-4 border rounded p-3">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                                {it.image ? <img src={it.image.src || it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{it.name || it.product_name}</div>
                                <div className="text-sm text-gray-600">Qty: {it.quantity || it.qty || 1}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{it.price || it.total || it.subtotal || order.currency_symbol ? `${order.currency_symbol || ""} ${it.total || it.price || ""}` : ""}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-8">
                <a className="inline-block bg-primary-600 text-white px-4 py-2 rounded" href="/shop">Continue shopping</a>
            </div>
        </main>
    );
}
