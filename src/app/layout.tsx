import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ToastProvider from "@/components/ToastProvider"
import { AuthProvider } from "@/context/AuthContext"
import CartProviderWithAuth from "@/context/CartProviderWithAuth"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Headless WooCommerce Shop - By Brainbean",
  description: "A high-performance headless commerce solution powered by WooCommerce REST APIs, delivering a modern frontend architecture with seamless product management, dynamic checkout flows, and scalable integration capabilities.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>
          <CartProviderWithAuth>
            <ToastProvider>
              <Header />
              <main className="w-full">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProviderWithAuth>
        </AuthProvider>
      </body>
    </html>
  )
}
