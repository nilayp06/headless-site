"use client"

import type React from "react"
import { useRouter } from "next/navigation"

export default function Slider() {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/brands/starmax")
  }

  return (
    <section className="w-full">
      <div
        role="link"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e as any)
        }}
        className="w-full overflow-hidden cursor-pointer group"
        aria-label="View featured collection - click to shop"
      >
        <img
          src="https://headlesswp.dev.brainbean.us/wp-content/uploads/2025/11/starmax-30k-V01.webp"
          alt="Featured collection banner"
          className="w-full h-80 sm:h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>
  )
}

