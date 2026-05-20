'use client'

import { useState } from 'react'

export default function ShareButtons({ buildId }: { buildId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/builder/share/${buildId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const url = `${window.location.origin}/builder/share/${buildId}`
    window.open(`https://wa.me/?text=Check out my custom PC build on LesmaTech! ${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopy}
        className="flex-1 border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
      >
        Share on WhatsApp
      </button>
    </div>
  )
}