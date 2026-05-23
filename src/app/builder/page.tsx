'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Wallet, Zap, Flame, Crown, Cpu, Monitor, Gamepad2, Package,
  HardDrive, Wind, Server, Fan, CheckCircle, AlertTriangle,
  ShoppingCart, Trophy, ThumbsUp
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const budgetTiers = [
  { id: 'budget', label: 'Budget Build', range: 'Up to £500', limit: 500, description: 'Great for everyday tasks, office work, and light gaming.', Icon: Wallet },
  { id: 'mid', label: 'Mid-Range Build', range: '£500 – £1000', limit: 1000, description: 'Perfect for 1080p gaming, content creation, and multitasking.', Icon: Zap },
  { id: 'high', label: 'High-End Build', range: '£1000 – £2000', limit: 2000, description: 'Serious performance for 1440p gaming and heavy workloads.', Icon: Flame },
  { id: 'no_limit', label: 'No Limit', range: '£2000+', limit: Infinity, description: 'The best of the best. Maximum performance, no compromises.', Icon: Crown },
]

const steps = ['Budget', 'CPU', 'Motherboard', 'GPU', 'RAM', 'Storage', 'Cooler', 'Case', 'Fans', 'PSU', 'Review']
const componentSteps = ['CPU', 'Motherboard', 'GPU', 'RAM', 'Storage', 'Cooler', 'Case', 'Fans', 'PSU']
const hasBrands = (category: string) => ['CPU', 'GPU', 'Motherboard', 'Cooler'].includes(category)

const stepIcons: Record<string, LucideIcon> = {
  Budget: Wallet,
  CPU: Cpu,
  Motherboard: Monitor,
  GPU: Gamepad2,
  RAM: Package,
  Storage: HardDrive,
  Cooler: Wind,
  Case: Server,
  Fans: Fan,
  PSU: Zap,
  Review: CheckCircle,
}

const getComponentFeedback = (category: string, component: any, selected: Record<string, any>): { type: 'great' | 'good' | 'warning' | null, message: string } => {
  const cpu = selected['CPU']

  if (category === 'CPU') {
    if (component.price >= 400) return { type: 'great', message: 'Excellent choice! This CPU offers top-tier performance for gaming and workloads.' }
    if (component.price >= 200) return { type: 'good', message: 'Good choice! Solid performance for most tasks and gaming at 1080p/1440p.' }
    return { type: 'warning', message: 'Budget pick — fine for everyday use but may bottleneck a high-end GPU.' }
  }

  if (category === 'GPU') {
    if (!cpu) return { type: null, message: '' }
    const cpuPrice = cpu.price || 0
    const gpuPrice = component.price || 0
    const ratio = gpuPrice / (cpuPrice || 1)
    if (ratio > 3.5) return { type: 'warning', message: `Your CPU (£${cpuPrice}) may bottleneck this GPU. Consider upgrading your CPU for max performance.` }
    if (ratio < 0.5) return { type: 'warning', message: `This GPU may be underpowered compared to your CPU. You could get better visuals with a higher-tier GPU.` }
    if (component.price >= 500) return { type: 'great', message: 'Great pairing! This GPU matches your CPU well and will deliver excellent frame rates.' }
    return { type: 'good', message: 'Good balance. This GPU works well with your CPU for smooth gaming.' }
  }

  if (category === 'RAM') {
    if (component.name?.includes('DDR5') && component.price >= 100) return { type: 'great', message: 'DDR5 RAM — future-proof and fast. Great pick for high-end builds.' }
    if (component.name?.includes('DDR4')) return { type: 'good', message: 'DDR4 is reliable and cost-effective. A solid choice for most builds.' }
    return { type: 'good', message: 'Decent RAM choice for your build.' }
  }

  if (category === 'Storage') {
    if (component.name?.includes('4TB') || component.name?.includes('2TB')) return { type: 'great', message: "Plenty of storage! You won't run out of space anytime soon." }
    if (component.name?.includes('NVMe') || component.name?.includes('SSD')) return { type: 'good', message: 'Fast NVMe storage — great boot and load times.' }
    return { type: 'warning', message: 'Consider an NVMe SSD for significantly faster performance.' }
  }

  if (category === 'PSU') {
    if (component.name?.includes('1000W') || component.name?.includes('850W')) return { type: 'great', message: 'Plenty of headroom for your build. Future upgrades covered too.' }
    if (component.name?.includes('650W') || component.name?.includes('750W')) return { type: 'good', message: 'Solid wattage for most builds. Should handle your components well.' }
    return { type: 'warning', message: 'Make sure this PSU has enough wattage for your CPU + GPU combination.' }
  }

  if (category === 'Cooler') {
    if (component.name?.includes('360') || component.name?.includes('280')) return { type: 'great', message: 'High-performance liquid cooling — your CPU will stay ice cold under load.' }
    if (component.name?.includes('240') || component.name?.includes('AIO')) return { type: 'good', message: 'Good cooling solution. Handles most CPUs with ease.' }
    return { type: 'good', message: 'Air cooling is reliable and quiet. Good pick for mid-range builds.' }
  }

  return { type: 'good', message: 'Good choice for your build.' }
}

type CompatibilityChecker = (comp: any) => string | null

const compatibilityRules: Record<string, (selected: Record<string, any>) => CompatibilityChecker | null> = {
  Motherboard: (selected) => {
    const cpu = selected['CPU']
    if (!cpu) return null
    const isAMD = cpu.brand === 'AMD'
    const isIntel = cpu.brand === 'Intel'
    return (comp: any) => {
      if (isAMD && comp.specs?.includes('LGA')) return `Not compatible with AMD CPUs. Choose an AM4/AM5 motherboard.`
      if (isIntel && comp.specs?.includes('AM')) return `Not compatible with Intel CPUs. Choose an LGA motherboard.`
      return null
    }
  },
  RAM: (selected) => {
    const mb = selected['Motherboard']
    if (!mb) return null
    return (comp: any) => {
      if (mb.specs?.includes('DDR4') && comp.name?.includes('DDR5')) return `Not compatible. Your motherboard supports DDR4 only.`
      if (mb.specs?.includes('DDR5') && comp.name?.includes('DDR4')) return `Not compatible. Your motherboard supports DDR5 only.`
      return null
    }
  },
}

export default function BuilderPage() {
  const [showWarning, setShowWarning] = useState(true)
  const [step, setStep] = useState(0)
  const [budget, setBudget] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, any>>({})
  const [brandChoice, setBrandChoice] = useState<Record<string, string>>({})
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [components, setComponents] = useState<Record<string, any[]>>({})
  const [sharedBuildId, setSharedBuildId] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [lastFeedback, setLastFeedback] = useState<{ type: 'great' | 'good' | 'warning' | null, message: string } | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentStep = steps[step]
  const total = Object.values(selected).reduce((sum, item) => sum + (item?.price || 0), 0)
  const budgetTier = budgetTiers.find(t => t.id === budget)
  const budgetLimit = budgetTier?.limit ?? Infinity
  const isOverBudget = budgetLimit !== Infinity && total > budgetLimit
  const budgetPercent = budgetLimit !== Infinity ? Math.min((total / budgetLimit) * 100, 100) : 0
  const remaining = budgetLimit !== Infinity ? budgetLimit - total : 0
  const isWarningBudget = !isOverBudget && budgetPercent >= 80

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

  const getCompatibilityError = (category: string, component: any): string | null => {
    const rule = compatibilityRules[category]
    if (!rule) return null
    const checker = rule(selected)
    if (!checker) return null
    return checker(component)
  }

  const getFilteredComponents = (category: string, brand?: string) => {
    const items = components[category] || []
    const filtered = brand && brand !== 'Any' ? items.filter((i) => i.brand === brand) : items
    if (!budget) return filtered
    return filtered.filter((i) => i.budget_tiers?.includes(budget))
  }

  const getBrands = (category: string) => {
    const items = components[category] || []
    return [...new Set(items.map((i) => i.brand))].filter((b) => b !== 'Any')
  }

  const handleSelectComponent = (category: string, component: any) => {
    setSelected({ ...selected, [category]: component })
    const feedback = getComponentFeedback(category, component, { ...selected, [category]: component })
    setLastFeedback(feedback)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 4000)
  }

  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1) }
  const handleBack = () => { if (step > 0) setStep(step - 1) }

  const handleSubmitBuild = async () => {
    setSubmitStatus('loading')
    try {
      const { data: sharedBuild } = await supabase
        .from('shared_builds')
        .insert({ budget, components: selected, total })
        .select()
        .single()
      if (sharedBuild) setSharedBuildId(sharedBuild.id)
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: customerInfo.name, email: customerInfo.email, phone: customerInfo.phone, budget, components: selected, total }),
      })
      if (res.ok) setSubmitStatus('success')
      else setSubmitStatus('error')
    } catch { setSubmitStatus('error') }
  }

  const handleCopyLink = async () => {
    if (!sharedBuildId) return
    await navigator.clipboard.writeText(`${window.location.origin}/builder/share/${sharedBuildId}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    if (!sharedBuildId) return
    const url = `${window.location.origin}/builder/share/${sharedBuildId}`
    window.open(`https://wa.me/?text=Check out my custom PC build on LesmaTech! ${encodeURIComponent(url)}`, '_blank')
  }

  if (showWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="relative max-w-lg w-full bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,99,235,0.15),transparent)]" />
          <div className="relative">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
            <h2 className="text-white font-bold text-2xl mb-3">Hold on a second!</h2>
            <p className="text-[#a1a1aa] mb-4 leading-relaxed">
              The <span className="text-white font-semibold">PC Builder</span> is designed for users who are comfortable selecting individual components like CPU, GPU, RAM, and motherboard.
            </p>
            <p className="text-[#a1a1aa] mb-8 leading-relaxed">
              If you're not sure where to start, we recommend checking out our <span className="text-[#3b82f6] font-semibold">pre-built PCs</span> — hand-built machines for every budget, ready to ship.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop" className="flex-1 bg-[#0d0d1a] border border-[#1e1e3a] hover:border-[#2563eb]/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Browse Pre-Built PCs
              </Link>
              <button onClick={() => setShowWarning(false)} className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 text-sm">
                I Know What I'm Doing →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(37,99,235,0.15),transparent)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#3b82f6] text-sm font-medium">Custom PC Builder</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Build Your PC</h1>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">Choose your components. We'll build and deliver it to you.</p>
        </div>
      </div>

      {/* Progress bar buget */}
      {budget && total > 0 && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
    <div className={`border rounded-xl px-5 py-4 transition-all duration-300 ${
      isOverBudget ? 'bg-red-500/10 border-red-500/30' :
      isWarningBudget ? 'bg-yellow-400/10 border-yellow-400/30' :
      'bg-green-500/10 border-green-500/30'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#a1a1aa] text-sm">Current total</span>
        <span className="text-white font-bold text-xl">£{total}</span>
      </div>
      {budgetLimit !== Infinity && (
        <>
          <div className="w-full bg-[#1e1e3a] rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : isWarningBudget ? 'bg-yellow-400' : 'bg-green-500'
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <p className={`text-xs font-medium ${
            isOverBudget ? 'text-red-400' : isWarningBudget ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {isOverBudget
              ? `Over budget by £${Math.abs(remaining).toFixed(0)}!`
              : isWarningBudget
              ? `Almost at limit — £${remaining.toFixed(0)} remaining.`
              : `£${remaining.toFixed(0)} remaining within budget.`}
          </p>
        </>
      )}
      {budgetLimit === Infinity && <p className="text-[#a1a1aa] text-xs">No budget limit — build freely.</p>}
    </div>
  </div>
)}

      {/* Steps tabs orizontale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="overflow-x-auto">
          <div className="flex gap-1 p-1 bg-[#080818] border border-[#1e1e3a] rounded-2xl w-fit min-w-full">
            {steps.map((s, i) => {
              const StepIcon = stepIcons[s]
              const isDone = i < step
              const isActive = i === step
              return (
                <button
                  key={s}
                  onClick={() => i < step && setStep(i)}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-200 flex-1 min-w-[60px] ${
                    isActive ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' :
                    isDone ? 'bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20' :
                    'text-[#3f3f46] cursor-default'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone ? 'bg-green-500 text-white' :
                    isActive ? 'bg-white/20 text-white' :
                    'bg-[#1e1e3a] text-[#3f3f46]'
                  }`}>
                    {isDone
                      ? <CheckCircle className="w-3.5 h-3.5" />
                      : <StepIcon className="w-3.5 h-3.5" />
                    }
                  </div>
                  <span className="text-[10px] font-medium hidden sm:block">{s}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-8 items-start">

          {/* MAIN — Content */}
          <div className="flex-1 min-w-0">

            {/* Feedback toast */}
            {showFeedback && lastFeedback?.type && (
              <div className={`mb-4 px-4 py-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                lastFeedback.type === 'great' ? 'bg-green-500/10 border-green-500/30' :
                lastFeedback.type === 'good' ? 'bg-blue-500/10 border-blue-500/30' :
                'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                {lastFeedback.type === 'great'
                  ? <Trophy className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  : lastFeedback.type === 'good'
                  ? <ThumbsUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  : <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                }
                <div>
                  <div className={`text-sm font-semibold ${
                    lastFeedback.type === 'great' ? 'text-green-400' :
                    lastFeedback.type === 'good' ? 'text-blue-400' :
                    'text-yellow-400'
                  }`}>
                    {lastFeedback.type === 'great' ? 'Great Choice!' : lastFeedback.type === 'good' ? 'Good Pick!' : 'Worth Considering'}
                  </div>
                  <div className="text-[#a1a1aa] text-xs mt-0.5">{lastFeedback.message}</div>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6 sm:p-8 mb-6">

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
                          budget === tier.id
                            ? 'border-[#2563eb] bg-[#2563eb]/10 shadow-lg shadow-blue-500/10'
                            : 'border-[#1e1e3a] hover:border-[#2563eb]/40 bg-[#080818]'
                        }`}
                      >
                        <tier.Icon className="w-6 h-6 mb-2 text-[#3b82f6]" />
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
                  <div className="flex items-center gap-3 mb-1">
                    {(() => { const StepIcon = stepIcons[currentStep]; return <StepIcon className="w-6 h-6 text-[#3b82f6]" /> })()}
                    <h2 className="text-white font-bold text-2xl">Choose Your {currentStep}</h2>
                  </div>
                  <p className="text-[#a1a1aa] text-sm mb-6 ml-9">
                    {selected[currentStep]
                      ? <span className="text-green-400">✓ Selected: {selected[currentStep].name}</span>
                      : 'Pick the best option for your build.'}
                  </p>

                  {hasBrands(currentStep) && getBrands(currentStep).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {getBrands(currentStep).map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setBrandChoice({ ...brandChoice, [currentStep]: brand })}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                            brandChoice[currentStep] === brand
                              ? 'border-[#2563eb] bg-[#2563eb]/10'
                              : 'border-[#1e1e3a] hover:border-[#2563eb]/40 bg-[#080818]'
                          }`}
                        >
                          {['AMD', 'Intel', 'Nvidia'].includes(brand) ? (
                            <img
                              src={
                                brand === 'AMD' ? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg' :
                                brand === 'Intel' ? 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' :
                                'https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg'
                              }
                              alt={brand}
                              className="h-8 object-contain mb-2"
                              style={{ filter: 'brightness(0) invert(1)' }}
                            />
                          ) : (
                            <span className="text-white font-bold text-sm mb-2">{brand}</span>
                          )}
                          <span className="text-white text-xs font-medium">{brand}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {getFilteredComponents(currentStep, hasBrands(currentStep) ? brandChoice[currentStep] : 'Any').map((component) => {
                      const compatError = getCompatibilityError(currentStep, component)
                      const isSelected = selected[currentStep]?.id === component.id
                      return (
                        <button
                          key={component.id}
                          onClick={() => !compatError && handleSelectComponent(currentStep, component)}
                          className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                            compatError ? 'border-red-500/20 opacity-40 cursor-not-allowed bg-red-500/5' :
                            isSelected
                              ? 'border-[#2563eb] bg-[#2563eb]/10 shadow-lg shadow-blue-500/10'
                              : 'border-[#1e1e3a] hover:border-[#2563eb]/40 bg-[#080818]'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-white font-medium">{component.name}</div>
                            <div className="text-[#a1a1aa] text-sm mt-0.5">{component.specs}</div>
                            {compatError && (
                              <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />{compatError}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-white font-bold text-lg">£{component.price}</div>
                            {isSelected && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                          </div>
                        </button>
                      )
                    })}

                    {hasBrands(currentStep) && !brandChoice[currentStep] && getBrands(currentStep).length > 0 && (
                      <p className="text-[#a1a1aa] text-sm text-center py-4">Select a brand above to see options.</p>
                    )}

                    {getFilteredComponents(currentStep, hasBrands(currentStep) ? brandChoice[currentStep] : 'Any').length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-[#a1a1aa] text-sm">No components available for this category yet.</p>
                        <p className="text-[#3f3f46] text-xs mt-1">Check back soon or contact us for a custom quote.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 'Review' && (
                <div>
                  <h2 className="text-white font-bold text-2xl mb-6">Your Build</h2>
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center justify-between p-3 bg-[#080818] rounded-lg border border-[#1e1e3a]">
                      <span className="text-[#a1a1aa] text-sm">Budget Tier</span>
                      <span className="text-white text-sm font-medium">{budgetTiers.find(t => t.id === budget)?.label}</span>
                    </div>
                    {componentSteps.map((cat) => (
                      selected[cat] && (
                        <div key={cat} className="flex items-center justify-between p-3 bg-[#080818] rounded-lg border border-[#1e1e3a]">
                          <div className="flex items-center gap-2">
                            {(() => { const StepIcon = stepIcons[cat]; return <StepIcon className="w-4 h-4 text-[#a1a1aa]" /> })()}
                            <span className="text-[#a1a1aa] text-sm">{cat}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm font-medium">{selected[cat].name}</div>
                            <div className="text-[#2563eb] text-xs">£{selected[cat].price}</div>
                          </div>
                        </div>
                      )
                    ))}
                    <div className="flex items-center justify-between p-4 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-xl mt-2">
                      <span className="text-white font-bold">Total (components only)</span>
                      <span className="text-white font-bold text-2xl">£{total}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mb-6">
                    <h3 className="text-white font-semibold">Your Details</h3>
                    <input type="text" placeholder="Full Name *" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full bg-[#080818] border border-[#1e1e3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors" />
                    <input type="email" placeholder="Email *" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full bg-[#080818] border border-[#1e1e3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors" />
                    <input type="tel" placeholder="Phone / WhatsApp" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full bg-[#080818] border border-[#1e1e3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors" />
                  </div>

                  <p className="text-[#a1a1aa] text-sm mb-6">* Final price includes labour, cable management, OS installation, and stress testing. We'll confirm the exact price via WhatsApp.</p>

                  {submitStatus === 'success' ? (
                    <div className="text-center py-6">
                      <CheckCircle className="w-16 h-16 text-green-400 mb-4 mx-auto" />
                      <h3 className="text-white font-bold text-xl mb-2">Build Submitted!</h3>
                      <p className="text-[#a1a1aa] mb-6">We'll contact you within 24 hours to confirm your build.</p>
                      {sharedBuildId && (
                        <div className="flex flex-col gap-3">
                          <p className="text-[#a1a1aa] text-sm">Share your build:</p>
                          <div className="flex gap-3">
                            <button onClick={handleCopyLink} className="flex-1 border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm">
                              {linkCopied ? '✓ Copied!' : '🔗 Copy Link'}
                            </button>
                            <button onClick={handleWhatsAppShare} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm">
                              Share on WhatsApp
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitBuild}
                      disabled={submitStatus === 'loading' || !customerInfo.name || !customerInfo.email}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg shadow-lg shadow-blue-500/20"
                    >
                      {submitStatus === 'loading' ? 'Submitting...' : 'Submit My Build →'}
                    </button>
                  )}

                  {submitStatus === 'error' && <p className="text-red-400 text-sm mt-3 text-center">Something went wrong. Please try again.</p>}
                </div>
              )}
            </div>

            {/* Navigation */}
            {currentStep !== 'Review' && (
              <div className="flex items-center justify-between">
                <button onClick={handleBack} disabled={step === 0} className="border border-[#1e1e3a] text-[#a1a1aa] hover:text-white disabled:opacity-30 px-6 py-3 rounded-xl transition-colors text-sm font-medium">
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 'Budget' && !budget) ||
                    (componentSteps.includes(currentStep) && !selected[currentStep]) ||
                    isOverBudget
                  }
                  className={`font-semibold px-6 py-3 rounded-xl transition-colors text-sm ${
                    isOverBudget
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400 cursor-not-allowed'
                      : 'bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-30 text-white shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {isOverBudget ? 'Over Budget — Go Back' : 'Next →'}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Build Summary */}
          <div className="hidden xl:flex flex-col w-64 sticky top-24">
            <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#a1a1aa]" /> Your Build
              </h3>
              <div className="flex flex-col gap-2 mb-4">
                {steps.filter(s => s !== 'Budget' && s !== 'Review').map((s) => {
                  const StepIcon = stepIcons[s]
                  return (
                    <div key={s} className="flex items-center gap-2 py-1.5 border-b border-[#1e1e3a] last:border-0">
                      <StepIcon className="w-4 h-4 text-[#a1a1aa] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[#a1a1aa] text-[10px] uppercase tracking-wide">{s}</div>
                        {selected[s]
                          ? <div className="text-white text-xs truncate font-medium">{selected[s].name}</div>
                          : <div className="text-[#3f3f46] text-xs">Not selected</div>}
                      </div>
                      {selected[s] && <div className="text-[#2563eb] text-xs font-medium flex-shrink-0">£{selected[s].price}</div>}
                    </div>
                  )
                })}
              </div>
              <div className="bg-[#080818] rounded-xl p-3 border border-[#1e1e3a]">
                <div className="text-[#a1a1aa] text-xs mb-1">Total so far</div>
                <div className="text-white font-bold text-xl">£{total}</div>
                {budgetLimit !== Infinity && (
                  <div className={`text-xs mt-1 ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                    {isOverBudget ? `£${Math.abs(remaining).toFixed(0)} over budget` : `£${remaining.toFixed(0)} remaining`}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}