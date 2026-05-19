'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-[#a1a1aa] mb-8">Add some components from the shop to get started.</p>
        <Link
          href="/shop"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
        >
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl font-bold text-white mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-[#111111] border border-[#27272a] rounded-xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-2xl">🖥️</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[#2563eb] text-xs mb-1">{item.category}</div>
                <div className="text-white font-semibold text-sm truncate">{item.name}</div>
                <div className="text-[#a1a1aa] text-sm mt-0.5">£{item.price}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 border border-[#27272a] rounded-lg text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 border border-[#27272a] rounded-lg text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-white font-bold text-sm w-16 text-right">
                £{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-[#a1a1aa] hover:text-red-400 transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-[#a1a1aa] hover:text-red-400 text-sm transition-colors self-start"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 h-fit">
          <h2 className="text-white font-bold text-lg mb-6">Order Summary</h2>

          <div className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[#a1a1aa] truncate mr-4">{item.name} x{item.quantity}</span>
                <span className="text-white flex-shrink-0">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#27272a] pt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold text-xl">£{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Proceed to Checkout'}
          </button>

          <Link
            href="/shop"
            className="block text-center text-[#a1a1aa] hover:text-white text-sm mt-4 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}