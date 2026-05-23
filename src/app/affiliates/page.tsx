'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Users, TrendingUp, Wallet, Shield, CheckCircle, AlertTriangle, Star, Percent, ArrowRight } from 'lucide-react'

const commissionTiers = [
  {
    range: 'Up to £500',
    commission: '3%',
    discount: '2%',
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'text-green-400',
    icon: Wallet,
  },
  {
    range: '£500 – £1,500',
    commission: '5%',
    discount: '3%',
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'text-blue-400',
    icon: TrendingUp,
  },
  {
    range: '£1,500+',
    commission: '7%',
    discount: '5%',
    color: 'border-purple-500/30 bg-purple-500/5',
    badge: 'text-purple-400',
    icon: Star,
  },
]

const benefits = [
  { icon: Percent, title: 'Generous Commissions', desc: 'Earn up to 7% on every successful order made with your code.' },
  { icon: Users, title: 'Help Your Audience', desc: 'Give your followers real discounts on quality PC builds and IT services.' },
  { icon: TrendingUp, title: 'Track Your Earnings', desc: 'We keep you updated on every order placed with your code.' },
  { icon: Shield, title: 'Trusted Partner', desc: 'Join a vetted network. Every affiliate is personally approved by our team.' },
]

const platforms = ['YouTube', 'Instagram', 'TikTok', 'Twitch', 'Twitter/X', 'Facebook', 'Blog/Website', 'Other']
const audienceSizes = ['Under 1,000', '1,000 – 5,000', '5,000 – 20,000', '20,000 – 100,000', '100,000+']
const niches = ['Gaming', 'Tech Reviews', 'PC Building', 'Lifestyle', 'Business', 'Education', 'Other']

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
  platform: '',
  audience_size: '',
  niche: '',
  why_join: '',
  experience: '',
}

export default function AffiliatesPage() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    if (!form.full_name || !form.email || !form.platform || !form.why_join) {
      setErrorMsg('Please fill in all required fields.')
      setStatus('idle')
      return
    }

    const { error } = await supabase
      .from('affiliate_applications')
      .insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        platform: form.platform,
        audience_size: form.audience_size,
        niche: form.niche,
        why_join: form.why_join,
        experience: form.experience,
      })

    if (error) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
      return
    }

    setStatus('success')
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(37,99,235,0.2),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-[#3b82f6] text-sm font-medium">Affiliate Programme</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Partner With <span className="text-[#2563eb]">LesmaTech</span>
          </h1>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto mb-10">
            Join our affiliate programme and earn commission on every order placed with your unique code. Help your audience get great deals on custom PCs and IT services — while you earn.
          </p>
          <a href="#apply" className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20 text-lg">
            Apply Now <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Join Our Programme?</h2>
          <p className="text-[#a1a1aa] max-w-xl mx-auto">Everything you need to start earning as a LesmaTech affiliate.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6 hover:border-[#2563eb]/40 transition-all duration-300">
              <div className="w-12 h-12 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-xl flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{b.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Commission Structure</h2>
          <p className="text-[#a1a1aa] max-w-xl mx-auto">Your earnings scale with the value of each order. The bigger the build, the more you earn.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {commissionTiers.map((tier) => (
            <div key={tier.range} className={`border rounded-2xl p-6 ${tier.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <tier.icon className={`w-5 h-5 ${tier.badge}`} />
                </div>
                <span className={`text-sm font-semibold ${tier.badge}`}>{tier.range}</span>
              </div>
              <div className="mb-4">
                <div className="text-white font-bold text-3xl mb-1">{tier.commission}</div>
                <div className="text-[#a1a1aa] text-sm">your commission</div>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="text-white font-semibold text-lg mb-1">{tier.discount}</div>
                <div className="text-[#a1a1aa] text-sm">discount for your audience</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[#a1a1aa] text-sm mt-6">
          Discounts apply to the full order total including delivery. Commissions are paid via bank transfer or PayPal after order completion.
        </p>
      </section>

      {/* How it works */}
      <section className="border-y border-[#1e1e3a] bg-[#0d0d1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Apply', desc: 'Fill in the application form below. Tell us about yourself and your audience.' },
              { step: '02', title: 'Get Reviewed', desc: "We'll review your application and reach out within 48 hours to discuss." },
              { step: '03', title: 'Get Your Code', desc: "Once approved, you'll receive your unique discount code to share." },
              { step: '04', title: 'Start Earning', desc: 'Every order placed with your code earns you commission. Simple.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#2563eb] font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Apply to Join</h2>
          <p className="text-[#a1a1aa]">Fill in the form below and we'll be in touch within 48 hours.</p>
        </div>

        {status === 'success' ? (
          <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h3 className="text-white font-bold text-2xl mb-3">Application Received!</h3>
            <p className="text-[#a1a1aa] mb-4">Thanks for applying to the LesmaTech Affiliate Programme. We'll review your application and get back to you within 48 hours.</p>
            <p className="text-[#a1a1aa] text-sm mb-8">Keep an eye on your inbox — we'll reach out to discuss the details.</p>
            <Link href="/" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Personal Info */}
              <div className="sm:col-span-2">
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Full Name *</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                />
              </div>

              <div>
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@email.com"
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Phone / WhatsApp <span className="text-[#3f3f46]">(optional)</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+44 7700 900000"
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                />
              </div>

              {/* Audience Info */}
              <div className="sm:col-span-2 mt-2">
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Your Audience
                </h3>
              </div>

              <div>
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Primary Platform *</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                >
                  <option value="">Select platform...</option>
                  {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Audience Size <span className="text-[#3f3f46]">(approx.)</span></label>
                <select
                  value={form.audience_size}
                  onChange={(e) => setForm({ ...form, audience_size: e.target.value })}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                >
                  <option value="">Select size...</option>
                  {audienceSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Your Niche / Content Type</label>
                <select
                  value={form.niche}
                  onChange={(e) => setForm({ ...form, niche: e.target.value })}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                >
                  <option value="">Select niche...</option>
                  {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* About */}
              <div className="sm:col-span-2 mt-2">
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Tell Us More
                </h3>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Why do you want to join? *</label>
                <textarea
                  value={form.why_join}
                  onChange={(e) => setForm({ ...form, why_join: e.target.value })}
                  placeholder="Tell us why you'd be a good fit, how you plan to promote LesmaTech, and why your audience would be interested..."
                  rows={4}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46] resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Previous affiliate experience <span className="text-[#3f3f46]">(optional)</span></label>
                <textarea
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Have you worked with other brands before? Any relevant experience?"
                  rows={3}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46] resize-none"
                />
              </div>

              {/* Terms */}
              <div className="sm:col-span-2 bg-[#080818] border border-[#1e1e3a] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[#a1a1aa] text-xs leading-relaxed">
                    By submitting this form you agree that LesmaTech will review your application and contact you via email. Approval is not guaranteed. All affiliate partnerships are subject to our terms and conditions.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="sm:col-span-2 flex items-center gap-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? 'Submitting...' : <>Submit Application <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>

            </form>
          </div>
        )}
      </section>

    </div>
  )
}