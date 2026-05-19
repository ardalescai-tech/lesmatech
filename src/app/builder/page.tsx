'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const budgetTiers = [
  { id: 'budget', label: 'Budget Build', range: 'Up to £500', description: 'Great for everyday tasks, office work, and light gaming.', icon: '💰' },
  { id: 'mid', label: 'Mid-Range Build', range: '£500 – £1000', description: 'Perfect for 1080p gaming, content creation, and multitasking.', icon: '⚡' },
  { id: 'high', label: 'High-End Build', range: '£1000 – £2000', description: 'Serious performance for 1440p gaming and heavy workloads.', icon: '🔥' },
  { id: 'no_limit', label: 'No Limit', range: '£2000+', description: 'The best of the best. Maximum performance, no compromises.', icon: '👑' },
]

const steps = ['Budget', 'CPU', 'GPU', 'RAM', 'Storage', 'Case', 'Review']
const componentSteps = ['CPU', 'GPU', 'RAM', 'Storage', 'Case']
const hasBrands = (category: string) => category === 'CPU' || category === 'GPU'

export default function BuilderPage() {
  const [step, setStep] = useState(0)
  const [budget, setBudget] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, any>>({})
  const [brandChoice, setBrandChoice] = useState<Record<string, string>>({})
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [components, setComponents] = useState<Record<string, any[]>>({})

  const currentStep = steps[step]
  const total = Object.values(selected).reduce((sum, item) => sum + (item?.price || 0), 0)

  useEffect(() => {
    const fetchComponents = async () => {
      const { data } = await supabase
        .from('builder_components')
        .select('*')
        .eq('in_stock', true)
        .order('price', { ascending: true })

      if (data) {
        const grouped: Record<string, any[]> = {}
        data.forEach((c) => {
          if (!grouped[c.category]) grouped[c.category] = []
          grouped[c.category].push(c)
        })
        setComponents(grouped)
      }
    }
    fetchComponents()
  }, [])

  const getFilteredComponents = (category: string, brand?: string) => {
    const items = components[category] || []
    const filtered = brand && brand !== 'Any'
      ? items.filter((i) => i.brand === brand)
      : items
    if (!budget) return filtered
    return filtered.filter((i) => i.budget_tiers.includes(budget))
  }

  const getBrands = (category: string) => {
    const items = components[category] || []
    return [...new Set(items.map((i) => i.brand))].filter((b) => b !== 'Any')
  }

  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1) }
  const handleBack = () => { if (step > 0) setStep(step - 1) }

  const handleSubmitBuild = async () => {
    setSubmitStatus('loading')
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          budget,
          components: selected,
          total,
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
          <span className="text-[#3b82f6] text-sm font-medium">Custom PC Builder</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Build Your PC</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Choose your budget and components. We'll build and deliver it to you.
        </p>
      </div>

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

      {total > 0 && (
        <div className="bg-[#111111] border border-[#2563eb]/30 rounded-xl px-6 py-3 mb-8 flex items-center justify-between">
          <span className="text-[#a1a1aa] text-sm">Current total</span>
          <span className="text-white font-bold text-xl">£{total}</span>
        </div>
      )}

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 sm:p-8 mb-8">

        {currentStep === 'Budget' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Choose Your Budget</h2>
            <p className="text-[#a1a1aa] mb-8">This helps us recommend the best components for your money.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {budgetTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBudget(tier.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                    budget === tier.id ? 'border-[#2563eb] bg-[#2563eb]/10' : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="text-2xl mb-2">{tier.icon}</div>
                  <div className="text-white font-bold mb-1">{tier.label}</div>
                  <div className="text-[#2563eb] text-sm font-medium mb-2">{tier.range}</div>
                  <div className="text-[#a1a1aa] text-sm">{tier.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {componentSteps.includes(currentStep) && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Choose Your {currentStep}</h2>
            <p className="text-[#a1a1aa] mb-6">
              {selected[currentStep] && (
                <span className="text-green-400">Selected: {selected[currentStep].name}</span>
              )}
            </p>

            {hasBrands(currentStep) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {getBrands(currentStep).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setBrandChoice({ ...brandChoice, [currentStep]: brand })}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${
                      brandChoice[currentStep] === brand
                        ? 'border-[#2563eb] bg-[#2563eb]/10'
                        : 'border-[#27272a] hover:border-[#3f3f46] bg-[#1a1a1a]'
                    }`}
                  >
                    <img
                      src={
                        brand === 'AMD' ? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg' :
                        brand === 'Intel' ? 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' :
                        brand === 'Nvidia' ? 'https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg' : ''
                      }
                      alt={brand}
                      className="h-12 object-contain mb-3"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <span className="text-white font-semibold">{brand}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {getFilteredComponents(currentStep, hasBrands(currentStep) ? brandChoice[currentStep] : 'Any').map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelected({ ...selected, [currentStep]: component })}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                    selected[currentStep]?.id === component.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div>
                    <div className="text-white font-medium">{component.name}</div>
                    <div className="text-[#a1a1aa] text-sm mt-0.5">{component.specs}</div>
                  </div>
                  <div className="text-white font-bold text-lg ml-4">£{component.price}</div>
                </button>
              ))}

              {hasBrands(currentStep) && !brandChoice[currentStep] && (
                <p className="text-[#a1a1aa] text-sm text-center py-4">Select a brand above to see options.</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 'Review' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">Your Build</h2>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <span className="text-[#a1a1aa] text-sm">Budget</span>
                <span className="text-white text-sm font-medium">{budgetTiers.find(t => t.id === budget)?.label}</span>
              </div>
              {componentSteps.map((cat) => (
                selected[cat] && (
                  <div key={cat} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <span className="text-[#a1a1aa] text-sm">{cat}</span>
                    <div className="text-right">
                      <div className="text-white text-sm font-medium">{selected[cat].name}</div>
                      <div className="text-[#2563eb] text-xs">£{selected[cat].price}</div>
                    </div>
                  </div>
                )
              ))}
              <div className="flex items-center justify-between p-3 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg">
                <span className="text-white font-bold">Total (components only)</span>
                <span className="text-white font-bold text-xl">£{total}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-white font-semibold">Your Details</h3>
              <input
                type="text"
                placeholder="Full Name *"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              />
              <input
                type="email"
                placeholder="Email *"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              />
            </div>

            <p className="text-[#a1a1aa] text-sm mb-6">
              * Final price includes labour, cable management, OS installation, and stress testing. We'll confirm the exact price via WhatsApp.
            </p>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-white font-bold text-xl mb-2">Build Submitted!</h3>
                <p className="text-[#a1a1aa]">We'll contact you within 24 hours to confirm your build.</p>
              </div>
            ) : (
              <button
                onClick={handleSubmitBuild}
                disabled={submitStatus === 'loading' || !customerInfo.name || !customerInfo.email}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
              >
                {submitStatus === 'loading' ? 'Submitting...' : 'Submit My Build →'}
              </button>
            )}

            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm mt-3 text-center">Something went wrong. Please try again.</p>
            )}
          </div>
        )}
      </div>

      {currentStep !== 'Review' && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="border border-[#27272a] text-[#a1a1aa] hover:text-white disabled:opacity-30 px-6 py-3 rounded-xl transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 'Budget' && !budget) ||
              (componentSteps.includes(currentStep) && !selected[currentStep])
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