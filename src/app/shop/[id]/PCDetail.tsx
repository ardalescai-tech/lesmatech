'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PCDetail({ pc }: { pc: any }) {
  const [selectedVariant, setSelectedVariant] = useState(
    pc.prebuilt_variants?.[0] || null
  )

  const price = selectedVariant ? selectedVariant.price : pc.base_price
  const specs = selectedVariant?.specs || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <Link href="/shop" className="text-[#a1a1aa] hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div className="aspect-square bg-[#111111] border border-[#27272a] rounded-2xl flex items-center justify-center overflow-hidden">
          {pc.image_url ? (
            <img src={pc.image_url} alt={pc.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">PC</span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
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

          <h1 className="text-3xl font-bold text-white mb-2">{pc.name}</h1>
          <p className="text-[#a1a1aa] mb-6">{pc.description}</p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-white">£{price}</span>
          </div>

          {pc.prebuilt_variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-[#a1a1aa] text-sm mb-3">Choose configuration:</p>
              <div className="flex flex-col gap-2">
                {pc.prebuilt_variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.available}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                      selectedVariant?.id === variant.id
                        ? 'border-[#2563eb] bg-[#2563eb]/10 text-white'
                        : 'border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                    } ${!variant.available ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span>{variant.label}</span>
                    <span className="font-bold text-white">£{variant.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-5 mb-6">
              <h3 className="text-white font-semibold mb-3 text-sm">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-[#a1a1aa] text-xs capitalize">{key}</div>
                    <div className="text-white text-sm font-medium">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href={`/contact?subject=Pre-Built PC`}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-xl text-center transition-colors duration-200"
            >
              Order Now
            </Link>
            
            <a
              href="https://wa.me/44XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#27272a] hover:border-green-500/50 text-[#a1a1aa] hover:text-green-400 px-4 py-3 rounded-xl transition-colors duration-200 text-sm font-medium"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}