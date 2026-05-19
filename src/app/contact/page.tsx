'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Get In Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Have a question or ready to start a project? We'll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Contact info */}
        <div className="flex flex-col gap-6">
          {[
            {
              icon: '📧',
              title: 'Email',
              value: 'hello@lesmatech.co.uk',
              sub: 'We reply within 24 hours',
            },
            {
              icon: '💬',
              title: 'WhatsApp',
              value: '+44 XXXX XXXXXX',
              sub: 'For quick questions & updates',
            },
            {
              icon: '📍',
              title: 'Location',
              value: 'United Kingdom',
              sub: 'Remote & in-person available',
            },
            {
              icon: '🕐',
              title: 'Hours',
              value: 'Mon – Sat, 9am – 7pm',
              sub: 'UK time',
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#111111] border border-[#27272a] rounded-xl p-5 flex items-start gap-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="text-[#a1a1aa] text-xs uppercase tracking-wider mb-1">{item.title}</div>
                <div className="text-white font-medium text-sm">{item.value}</div>
                <div className="text-[#a1a1aa] text-xs mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#27272a] rounded-xl p-8">
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
              <p className="text-[#a1a1aa]">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="+44 XXXX XXXXXX"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="Custom PC Build">Custom PC Build</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Computer Repair">Computer Repair</option>
                    <option value="Hosting & Maintenance">Hosting & Maintenance</option>
                    <option value="IT Consultation">IT Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors resize-none"
                  placeholder="Tell us about your project or issue..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}