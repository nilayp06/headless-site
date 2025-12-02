"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <main className="w-full bg-background">
      <div className="w-full bg-secondary py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground font-light mt-4">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-light mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full px-8 py-3 font-normal transition-all duration-300 ${submitted ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
              >
                {submitted ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-light mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <Mail size={24} className="text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-normal text-foreground mb-2">Email</h3>
                  <a
                    href="mailto:support@studio.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    support@studio.com
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <Phone size={24} className="text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-normal text-foreground mb-2">Phone</h3>
                  <a href="tel:+1555123456" className="text-muted-foreground hover:text-foreground transition-colors">
                    +1 (555) 123-456
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <MapPin size={24} className="text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-normal text-foreground mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    123 Design Street
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8">
              <h3 className="font-normal text-foreground mb-4">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
