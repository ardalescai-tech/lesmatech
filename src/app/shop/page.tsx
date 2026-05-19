'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

const categories = ['All', 'Gaming', 'Office', 'Workstation']

export default function ShopPage() {
  const [pcs, setPcs] = useState<any[]>([])
  const [category, setCategory] = useState('All')
  const { addItem } = useCart()

  useEffect(() => {
    const fetchPCs = async () => {
      let query = supabase
        .from('prebuilt_pcs')
        .select('*, prebuilt_variants(*)')
        .order('created_at', { ascending: false })

      if (category !== 'All') {
        query = query.eq('category', category)
      }

      const { data } = await query
      if (data) setPcs(data)
    }
    fetchPCs()
  }, [category])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Pre-Built PCs</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Shop</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Hand-built PCs ready to ship. Every machine tested and verified before delivery.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              category === cat
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#3f3f46]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {pcs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🖥️</div>
          <h3 className="text-white font-bold text-xl mb-2">No PCs yet</h3>
          <p className="text-[#a1a1aa]">Check back soon — we're building!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pcs.map((pc: any) => (
            <div
              key={pc.id}
              className="bg-[#111111] border border-[#27272a] rounded-2xl overflow-hidden hover:border-[#2563eb]/50 transition-all duration-300 group flex flex-col"
            >
              <Link href={`/shop/${pc.id}`}>
                <div className="aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                  {pc.image_url ? (
                    <img
                      src={pc.image_url}
                      alt={pc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl">🖥️</span>
                  )}
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    pc.category === 'Gaming' ? 'bg-purple-500/10 text-purple-400' :
                    pc.category === 'Office' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-orange-500/10 text-orange-400'
                  }`}>
                    {pc.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${pc.in_stock ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                    {pc.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <Link href={`/shop/${pc.id}`}>
                  <h3 className="text-white font-bold text-lg mb-1 hover:text-[#2563eb] transition-colors">{pc.name}</h3>
                </Link>
                <p className="text-[#a1a1aa] text-sm mb-4 line-clamp-2 flex-1">{pc.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold text-2xl">£{pc.base_price}</span>
                  {pc.prebuilt_variants?.length > 0 && (
                    <span className="text-[#a1a1aa] text-xs">
                      {pc.prebuilt_variants.length} config{pc.prebuilt_variants.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addItem({
                      id: pc.id,
                      name: pc.name,
                      price: pc.base_price,
                      quantity: 1,
                      image_url: pc.image_url,
                      category: pc.category,
                    })}
                    disabled={!pc.in_stock}
                    className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/shop/${pc.id}`}
                    className="border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white text-sm px-3 py-2.5 rounded-lg transition-colors duration-200"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-20 bg-[#111111] border border-[#27272a] rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white mb-3">Can't find what you're looking for?</h2>
          <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
            Use our PC Builder to configure a custom machine to your exact budget and needs.
          </p>
          <Link
            href="/builder"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-block"
          >
            Build Your Own PC →
          </Link>
        </div>
      </div>
    </div>
  )
}