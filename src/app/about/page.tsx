import Link from "next/link"

export default function About() {
  return (
    <main className="w-full bg-background">
      <div className="w-full bg-secondary py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight">About Studio</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-light tracking-tight mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Studio was founded with a simple mission: to bring together the best curated products for the modern
              lifestyle. We believe that quality, design, and functionality should work together seamlessly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-light tracking-tight mb-6">Our Values</h2>
            <ul className="space-y-4">
              {[
                "Quality first - Every product is carefully selected for its quality and design",
                "Sustainability - We partner with brands that share our commitment to the environment",
                "Innovation - We stay ahead of trends to bring you the latest in design and technology",
                "Customer satisfaction - Your experience is our top priority",
              ].map((value, i) => (
                <li key={i} className="text-lg text-muted-foreground leading-relaxed">
                  {value}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-light tracking-tight mb-6">Our Team</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded by designers and product enthusiasts, our team is passionate about creating an exceptional
              shopping experience. We're dedicated to bringing you the best products from around the world.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-normal hover:bg-primary/90 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
