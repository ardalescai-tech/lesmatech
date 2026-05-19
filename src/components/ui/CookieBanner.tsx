'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('lesmatech_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('lesmatech_cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('lesmatech_cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-2xl max-w-2xl w-full">
        <div className="text-3xl flex-shrink-0">🍪</div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-[#a1a1aa] text-xs leading-relaxed">
            We use essential and analytics cookies to improve your experience. See our{' '}
            <Link href="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link>{' '}
            for more details.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}