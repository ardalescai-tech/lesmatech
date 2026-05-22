'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

const categories = ['All', 'Gaming', 'Office', 'Workstation']
const componentCategories = ['All', 'CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'PSU', 'Cooler', 'Case', 'Fans']

const budgetTiers = [
  { id: 'budget', label: 'Budget', range: 'Under £700', max: 700, icon: '💰', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', glow: 'hover:border-green-500/60', textColor: 'text-green-400' },
  { id: 'mid', label: 'Mid-Range', range: '£700 – £1,500', max: 1500, icon: '⚡', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', glow: 'hover:border-blue-500/60', textColor: 'text-blue-400' },
  { id: 'high', label: 'High-End', range: '£1,500 – £2,500', max: 2500, icon: '🔥', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', glow: 'hover:border-orange-500/60', textColor: 'text-orange-400' },
  { id: 'no_limit', label: 'No Limit', range: '£2,500+', max: Infinity, icon: '👑', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', glow: 'hover:border-purple-500/60', textColor: 'text-purple-400' },
]

const specIcons: Record<string, string> = {
  cpu: '🔲', gpu: '🎮', ram: '📦', storage: '💾', psu: '⚡', cooler: '❄️', motherboard: '🖥️',
}

function PCCard({ pc, addItem }: { pc: any, addItem: any }) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const variants = pc.prebuilt_variants || []
  const currentPrice = selectedVariant ? selectedVariant.price : pc.base_price

  const specsObj: Record<string, string> = (() => {
    if (!pc.specs) return {}
    if (typeof pc.specs === 'string') {
      const parts = pc.specs.split(',').map((s: string) => s.trim())
      const keys = ['CPU', 'GPU', 'RAM', 'Storage', 'PSU', 'Case']
      const result: Record<string, string> = {}
      parts.forEach((val: string, i: number) => { if (keys[i]) result[keys[i]] = val })
      return result
    }
    return pc.specs
  })()

  return (
    <div
      className="group relative bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl overflow-hidden hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col"
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.10)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <Link href={`/shop/${pc.id}`}>
        <div className="aspect-[4/3] bg-[#080818] flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d1a]/80 z-10" />
          {pc.image_url ? (
            <img src={pc.image_url} alt={pc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <span className="text-6xl">🖥️</span>
          )}
          <div className="absolute top-3 left-3 z-20">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
              pc.category === 'Gaming' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30' :
              pc.category === 'Office' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30' :
              'bg-orange-500/30 text-orange-300 border border-orange-500/30'
            }`}>{pc.category}</span>
          </div>
          <div className="absolute top-3 right-3 z-20">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
              pc.in_stock ? 'bg-green-500/30 text-green-300 border border-green-500/30' : 'bg-red-500/30 text-red-300 border border-red-500/30'
            }`}>{pc.in_stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/shop/${pc.id}`}>
          <h3 className="text-white font-bold text-lg mb-1 hover:text-[#3b82f6] transition-colors">{pc.name}</h3>
        </Link>
        <p className="text-[#a1a1aa] text-xs mb-4 line-clamp-2">{pc.description}</p>

        {Object.keys(specsObj).length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {Object.entries(specsObj).slice(0, 6).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5">
                <span className="text-xs">{specIcons[key.toLowerCase()] || '⚙️'}</span>
                <div className="min-w-0">
                  <div className="text-[#3f3f46] text-[9px] uppercase tracking-wide leading-none mb-0.5">{key}</div>
                  <div className="text-white text-[11px] font-medium truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {variants.length > 0 && (
          <div className="mb-4">
            <div className="text-[#a1a1aa] text-xs mb-2">Configuration:</div>
            <div className="flex flex-col gap-1.5">
              {variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                  disabled={!v.available}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all duration-200 ${
                    selectedVariant?.id === v.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10 text-white'
                      : 'border-[#1e1e3a] text-[#a1a1aa] hover:border-[#2563eb]/40 hover:text-white'
                  } ${!v.available ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <span className="font-medium">{v.label}</span>
                  <span className="font-bold text-white">£{v.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-white font-bold text-2xl">£{currentPrice}</span>
            {variants.length > 0 && !selectedVariant && <span className="text-[#a1a1aa] text-xs">from</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addItem({
                id: selectedVariant ? `${pc.id}-${selectedVariant.id}` : pc.id,
                name: selectedVariant ? `${pc.name} — ${selectedVariant.label}` : pc.name,
                price: currentPrice,
                quantity: 1,
                image_url: pc.image_url,
                category: pc.category,
              })}
              disabled={!pc.in_stock}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/10"
            >
              Add to Cart
            </button>
            <Link href={`/shop/${pc.id}`} className="border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white text-sm px-4 py-2.5 rounded-lg transition-colors duration-200">
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentCard({ comp, addItem }: { comp: any, addItem: any }) {
  return (
    <div
      className="group bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl overflow-hidden hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col"
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.10)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="aspect-square bg-[#080818] flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d1a]/60 z-10" />
        {comp.image_url ? (
          <img src={comp.image_url} alt={comp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <span className="text-5xl">{specIcons[comp.category.toLowerCase()] || '⚙️'}</span>
        )}
        <div className="absolute top-3 left-3 z-20">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm bg-blue-500/30 text-blue-300 border border-blue-500/30">
            {comp.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
            comp.in_stock ? 'bg-green-500/30 text-green-300 border border-green-500/30' : 'bg-red-500/30 text-red-300 border border-red-500/30'
          }`}>{comp.in_stock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-[#3b82f6] text-xs font-medium mb-1">{comp.brand}</div>
        <h3 className="text-white font-bold text-base mb-1">{comp.name}</h3>
        {comp.specs && <p className="text-[#a1a1aa] text-xs mb-3 line-clamp-2">{comp.specs}</p>}
        {comp.description && <p className="text-[#a1a1aa] text-xs mb-3 line-clamp-2 flex-1">{comp.description}</p>}

        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-white font-bold text-2xl">£{comp.price}</span>
          </div>
          <button
            onClick={() => addItem({
              id: comp.id,
              name: comp.name,
              price: comp.price,
              quantity: 1,
              image_url: comp.image_url,
              category: comp.category,
            })}
            disabled={!comp.in_stock}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/10"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [tab, setTab] = useState<'pcs' | 'components'>('pcs')
  const [pcs, setPcs] = useState<any[]>([])
  const [components, setComponents] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const [componentCategory, setComponentCategory] = useState('All')
  const [activeTier, setActiveTier] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchPCs = async () => {
      let query = supabase.from('prebuilt_pcs').select('*, prebuilt_variants(*)').order('base_price', { ascending: true })
      if (category !== 'All') query = query.eq('category', category)
      const { data } = await query
      if (data) setPcs(data)
    }
    fetchPCs()
  }, [category])

  useEffect(() => {
    const fetchComponents = async () => {
      let query = supabase.from('shop_components').select('*').order('price', { ascending: true })
      if (componentCategory !== 'All') query = query.eq('category', componentCategory)
      const { data } = await query
      if (data) setComponents(data)
    }
    fetchComponents()
  }, [componentCategory])

  const getFilteredPCs = () => {
    if (!activeTier) return pcs
    const tier = budgetTiers.find(t => t.id === activeTier)
    if (!tier) return pcs
    const prevTier = budgetTiers[budgetTiers.indexOf(tier) - 1]
    const min = prevTier ? prevTier.max : 0
    return pcs.filter(pc => pc.base_price > min && pc.base_price <= tier.max)
  }

  const filteredPCs = getFilteredPCs()

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(37,99,235,0.2),transparent)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#3b82f6] text-sm font-medium">LesmaTech Store</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            Shop <span className="text-[#2563eb]">PC Hardware</span>
          </h1>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto mb-10">
            Pre-built gaming PCs and individual components. Everything you need in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            {[
              { icon: '✅', title: 'Tested & Verified', sub: 'Every PC stress tested' },
              { icon: '🛡️', title: '2 Year Warranty', sub: 'Parts & labor coverage' },
              { icon: '🚚', title: 'Fast Delivery', sub: 'Secure & insured shipping' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <div className="text-white font-semibold">{item.title}</div>
                  <div className="text-[#a1a1aa] text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Switch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex gap-2 p-1 bg-[#080818] border border-[#1e1e3a] rounded-xl w-fit">
          <button
            onClick={() => setTab('pcs')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'pcs' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            🖥️ Pre-Built PCs
          </button>
          <button
            onClick={() => setTab('components')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'components' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            ⚙️ Components
          </button>
        </div>
      </section>

      {/* PCs Tab */}
      {tab === 'pcs' && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <h2 className="text-white font-bold text-xl mb-4">Filter by Budget</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {budgetTiers.map((tier) => {
                const prevTier = budgetTiers[budgetTiers.indexOf(tier) - 1]
                const min = prevTier ? prevTier.max : 0
                const count = pcs.filter(pc => pc.base_price > min && pc.base_price <= tier.max).length
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
                    className={`relative p-5 rounded-xl border bg-gradient-to-b ${tier.color} ${tier.border} ${tier.glow} transition-all duration-300 text-left ${activeTier === tier.id ? 'ring-2 ring-white/20 scale-[1.02]' : ''}`}
                  >
                    <div className="text-2xl mb-2">{tier.icon}</div>
                    <div className="text-white font-bold text-base">{tier.label}</div>
                    <div className={`text-xs font-medium mt-1 ${tier.textColor}`}>{tier.range}</div>
                    <div className="text-[#a1a1aa] text-xs mt-2">{count} PC{count !== 1 ? 's' : ''} available</div>
                    {activeTier === tier.id && <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full" />}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    category === cat ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'bg-[#0d0d1a] border border-[#1e1e3a] text-[#a1a1aa] hover:text-white hover:border-[#2563eb]/40'
                  }`}
                >{cat}</button>
              ))}
              {activeTier && (
                <button onClick={() => setActiveTier(null)} className="px-5 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white transition-all duration-200">
                  ✕ Clear Budget Filter
                </button>
              )}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {filteredPCs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🖥️</div>
                <h3 className="text-white font-bold text-xl mb-2">No PCs found</h3>
                <p className="text-[#a1a1aa]">Try a different budget or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPCs.map((pc: any) => <PCCard key={pc.id} pc={pc} addItem={addItem} />)}
              </div>
            )}

            <div className="mt-16 relative bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-10 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.10)_0%,transparent_60%)]" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-3">Can't find what you're looking for?</h2>
                <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">Use our PC Builder to configure a custom machine to your exact budget and needs.</p>
                <Link href="/builder" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-block shadow-lg shadow-blue-500/20">
                  Build Your Own PC →
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Components Tab */}
      {tab === 'components' && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex flex-wrap gap-2">
              {componentCategories.map((cat) => (
                <button key={cat} onClick={() => setComponentCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    componentCategory === cat ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'bg-[#0d0d1a] border border-[#1e1e3a] text-[#a1a1aa] hover:text-white hover:border-[#2563eb]/40'
                  }`}
                >{cat}</button>
              ))}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {components.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-white font-bold text-xl mb-2">No components yet</h3>
                <p className="text-[#a1a1aa]">Check back soon — we're stocking up!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {components.map((comp: any) => <ComponentCard key={comp.id} comp={comp} addItem={addItem} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}