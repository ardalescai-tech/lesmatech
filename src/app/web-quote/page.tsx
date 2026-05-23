'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, Wrench } from 'lucide-react'

const steps = ['Business Type', 'Package', 'Add-ons', 'Details', 'Submit']

const businessTypes: { id: string; label: string; icon: ReactNode; description: string }[] = [
  { id: 'restaurant', label: 'Restaurant / Café', icon: <span className="text-2xl">🍽️</span>, description: 'Menu, reservations, location, hours' },
  { id: 'retail', label: 'Retail / Shop', icon: <span className="text-2xl">🛍️</span>, description: 'Products, online store, payments' },
  { id: 'service', label: 'Service Business', icon: <Wrench className="w-6 h-6" />, description: 'Plumber, electrician, cleaner, etc.' },
  { id: 'portfolio', label: 'Portfolio / Freelancer', icon: <span className="text-2xl">🎨</span>, description: 'Showcase your work and skills' },
  { id: 'startup', label: 'Startup / SaaS', icon: <span className="text-2xl">🚀</span>, description: 'Landing page, waitlist, product info' },
  { id: 'healthcare', label: 'Healthcare / Beauty', icon: <span className="text-2xl">💆</span>, description: 'Appointments, services, team' },
  { id: 'education', label: 'Education / Coaching', icon: <span className="text-2xl">📚</span>, description: 'Courses, booking, resources' },
  { id: 'other', label: 'Other', icon: <span className="text-2xl">💼</span>, description: 'Something else — we\'ll figure it out' },
]

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    description: 'Up to 5 pages, mobile responsive, contact form, basic SEO.',
    best_for: 'Small businesses, portfolios, simple landing pages',
  },
  {
    id: 'business',
    name: 'Business',
    price: 699,
    description: 'Up to 15 pages, blog, admin panel, advanced SEO, speed optimisation.',
    best_for: 'Growing businesses, blogs, service companies',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    price: 1299,
    description: 'Full online shop, Stripe payments, order management, admin panel.',
    best_for: 'Online stores, product-based businesses',
  },
  {
    id: 'custom',
    name: 'Custom',
    price: null,
    description: 'Fully custom web application tailored to your exact requirements.',
    best_for: 'Complex platforms, SaaS, custom integrations',
  },
]

const addons = [
  { id: 'hosting', label: 'Hosting & Domain Setup', price: 49, per: 'one-time' },
  { id: 'maintenance', label: 'Monthly Maintenance', price: 29, per: 'month' },
  { id: 'logo', label: 'Logo Design', price: 149, per: 'one-time' },
  { id: 'copywriting', label: 'Copywriting', price: 39, per: 'per page' },
  { id: 'multilingual', label: 'Multilingual Support', price: 199, per: 'one-time' },
  { id: 'seo', label: 'Advanced SEO Package', price: 99, per: 'one-time' },
]

export default function WebQuotePage() {
  const [step, setStep] = useState(0)
  const [businessType, setBusinessType] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [details, setDetails] = useState({ name: '', email: '', phone: '', description: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const currentStep = steps[step]

  const selectedPackageData = packages.find(p => p.id === selectedPackage)
  const selectedAddonsData = addons.filter(a => selectedAddons.includes(a.id))
  const total = (selectedPackageData?.price || 0) + selectedAddonsData.reduce((sum, a) => sum + a.price, 0)

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          subject: 'Web Development Quote',
          message: `
Business Type: ${businessTypes.find(b => b.id === businessType)?.label}
Package: ${selectedPackageData?.name} ${selectedPackageData?.price ? `(£${selectedPackageData.price})` : '(Custom)'}
Add-ons: ${selectedAddonsData.length > 0 ? selectedAddonsData.map(a => a.label).join(', ') : 'None'}
Estimated Total: £${total}

Project Description:
${details.description}
          `.trim(),
        }),
      })
      if (res.ok) setSubmitStatus('success')
      else setSubmitStatus('error')
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Web Development</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get a Web Quote</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Tell us about your project and we'll give you a tailored quote within 24 hours.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-[#2563eb] text-white' :
              'bg-[#1a1a1a] border border-[#27272a] text-[#a1a1aa]'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : 'text-[#a1a1aa]'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-[#27272a]" />}
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 sm:p-8 mb-8">

        {/* Step 1 - Business Type */}
        {currentStep === 'Business Type' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">What type of business do you have?</h2>
            <p className="text-[#a1a1aa] mb-8">This helps us recommend the right solution for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {businessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBusinessType(type.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                    businessType === type.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="mb-2 text-[#a1a1aa]">{type.icon}</div>
                  <div className="text-white font-semibold text-sm mb-1">{type.label}</div>
                  <div className="text-[#a1a1aa] text-xs">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 - Package */}
        {currentStep === 'Package' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Choose a package</h2>
            <p className="text-[#a1a1aa] mb-8">You can always upgrade later. Not sure? Pick Custom and we'll advise.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                    selectedPackage === pkg.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-lg">{pkg.name}</span>
                    <span className="text-[#2563eb] font-bold">{pkg.price ? `£${pkg.price}` : 'Custom'}</span>
                  </div>
                  <p className="text-[#a1a1aa] text-sm mb-3">{pkg.description}</p>
                  <p className="text-[#3b82f6] text-xs">Best for: {pkg.best_for}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 - Add-ons */}
        {currentStep === 'Add-ons' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Any add-ons?</h2>
            <p className="text-[#a1a1aa] mb-8">Optional extras to enhance your project. You can skip this step.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addons.map((addon) => (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    selectedAddons.includes(addon.id)
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      selectedAddons.includes(addon.id) ? 'bg-[#2563eb] border-[#2563eb]' : 'border-[#27272a]'
                    }`}>
                      {selectedAddons.includes(addon.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-white text-sm font-medium">{addon.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#2563eb] font-bold text-sm">£{addon.price}</span>
                    <span className="text-[#a1a1aa] text-xs ml-1">/ {addon.per}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 - Details */}
        {currentStep === 'Details' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Tell us more</h2>
            <p className="text-[#a1a1aa] mb-8">The more detail you give, the more accurate our quote will be.</p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                  placeholder="+44 XXXX XXXXXX"
                />
              </div>
              <div>
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Project Description *</label>
                <textarea
                  rows={5}
                  required
                  value={details.description}
                  onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors resize-none"
                  placeholder="Tell us about your business, what you need the website to do, any specific features, design preferences, timeline, etc."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - Submit */}
        {currentStep === 'Submit' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">Your Quote Summary</h2>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <span className="text-[#a1a1aa] text-sm">Business Type</span>
                <span className="text-white text-sm font-medium">{businessTypes.find(b => b.id === businessType)?.label}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <span className="text-[#a1a1aa] text-sm">Package</span>
                <div className="text-right">
                  <span className="text-white text-sm font-medium">{selectedPackageData?.name}</span>
                  {selectedPackageData?.price && (
                    <span className="text-[#2563eb] text-xs ml-2">£{selectedPackageData.price}</span>
                  )}
                </div>
              </div>
              {selectedAddonsData.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <span className="text-[#a1a1aa] text-sm">{addon.label}</span>
                  <span className="text-[#2563eb] text-xs">£{addon.price}</span>
                </div>
              ))}
              {total > 0 && (
                <div className="flex items-center justify-between p-3 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg">
                  <span className="text-white font-bold">Estimated Total</span>
                  <span className="text-white font-bold text-xl">£{total}</span>
                </div>
              )}
            </div>

            <p className="text-[#a1a1aa] text-sm mb-6">
              * This is an estimate. We'll review your project details and send you a final quote within 24 hours.
            </p>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4 mx-auto" />
                <h3 className="text-white font-bold text-xl mb-2">Quote Request Sent!</h3>
                <p className="text-[#a1a1aa]">We'll get back to you within 24 hours with a detailed quote.</p>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitStatus === 'loading'}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Quote Request →'}
              </button>
            )}

            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm mt-3 text-center">Something went wrong. Please try again.</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep !== 'Submit' && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="border border-[#27272a] text-[#a1a1aa] hover:text-white disabled:opacity-30 px-6 py-3 rounded-xl transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={
              (currentStep === 'Business Type' && !businessType) ||
              (currentStep === 'Package' && !selectedPackage) ||
              (currentStep === 'Details' && (!details.name || !details.email || !details.description))
            }
            className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-30 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}