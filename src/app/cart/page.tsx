'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useState } from 'react'

const DELIVERY_THRESHOLD = 500
const DELIVERY_COST = 10

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    notes: '',
  })

  const deliveryFree = total >= DELIVERY_THRESHOLD
  const deliveryAmount = deliveryFree ? 0 : DELIVERY_COST
  const grandTotal = total + deliveryAmount

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const formValid = form.fullName && form.email && form.phone && form.address && form.city && form.postcode

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
          delivery: deliveryAmount,
          customerEmail: form.email,
          shippingDetails: form,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
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
        <p className="text-[#a1a1aa] mb-8">Add some PCs from the shop to get started.</p>
        <Link href="/shop" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block">
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Your Cart</h1>
          <p className="text-[#a1a1aa] mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Items */}
            {items.map((item) => (
              <div key={item.id} className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-5 flex items-center gap-4 hover:border-[#2563eb]/30 transition-all duration-200">
                <div className="w-20 h-20 bg-[#080818] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1e1e3a] overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-3xl">🖥️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#3b82f6] text-xs font-medium mb-1">{item.category}</div>
                  <div className="text-white font-bold text-base truncate">{item.name}</div>
                  <div className="text-[#a1a1aa] text-sm mt-0.5">£{item.price} per unit</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border border-[#1e1e3a] rounded-lg text-[#a1a1aa] hover:text-white hover:border-[#2563eb]/50 flex items-center justify-center transition-colors text-lg">−</button>
                  <span className="text-white font-semibold text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-[#1e1e3a] rounded-lg text-[#a1a1aa] hover:text-white hover:border-[#2563eb]/50 flex items-center justify-center transition-colors text-lg">+</button>
                </div>
                <div className="text-white font-bold text-lg w-20 text-right">£{(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeItem(item.id)} className="text-[#a1a1aa] hover:text-red-400 transition-colors ml-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-400/10">✕</button>
              </div>
            ))}

            <button onClick={clearCart} className="text-[#a1a1aa] hover:text-red-400 text-sm transition-colors self-start px-2 py-1">
              Clear cart
            </button>

            {/* Delivery Form */}
            {showForm && (
              <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6 mt-2">
                <h2 className="text-white font-bold text-lg mb-1">Delivery Details</h2>
                <p className="text-[#a1a1aa] text-sm mb-6">Fill in your shipping information below.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Full Name *</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleField}
                      placeholder="John Smith"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div>
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleField}
                      placeholder="john@email.com"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div>
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Phone / WhatsApp *</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleField}
                      placeholder="+44 7700 900000"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Address *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleField}
                      placeholder="123 Main Street, Flat 2"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div>
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">City *</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleField}
                      placeholder="Edinburgh"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div>
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Postcode *</label>
                    <input
                      name="postcode"
                      value={form.postcode}
                      onChange={handleField}
                      placeholder="EH1 1AB"
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Special Instructions <span className="text-[#3f3f46]">(optional)</span></label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleField}
                      placeholder="Floor number, access code, delivery instructions..."
                      rows={3}
                      className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '🛡️', title: '2 Year Warranty', sub: 'Parts & labour covered' },
                { icon: '🚚', title: 'Fast Delivery', sub: 'Free on orders over £500' },
                { icon: '✅', title: 'Stress Tested', sub: 'Every PC verified before shipping' },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-3 bg-[#0d0d1a] border border-[#1e1e3a] rounded-xl p-4">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{item.title}</div>
                    <div className="text-[#a1a1aa] text-xs">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#080818] rounded-lg flex-shrink-0 overflow-hidden border border-[#1e1e3a]">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        : <span className="flex items-center justify-center h-full text-lg">🖥️</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{item.name}</div>
                      <div className="text-[#a1a1aa] text-xs">x{item.quantity}</div>
                    </div>
                    <span className="text-white text-sm font-semibold flex-shrink-0">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1e1e3a] pt-4 mb-2">
                <div className="flex items-center justify-between text-sm text-[#a1a1aa] mb-2">
                  <span>Subtotal</span>
                  <span className="text-white">£{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#a1a1aa] mb-3">
                  <span>Delivery</span>
                  {deliveryFree
                    ? <span className="text-green-400 font-semibold">FREE</span>
                    : <span className="text-white">£{DELIVERY_COST.toFixed(2)}</span>
                  }
                </div>
                {!deliveryFree && (
                  <div className="text-xs text-[#a1a1aa] bg-[#080818] border border-[#1e1e3a] rounded-lg px-3 py-2 mb-4">
                    Add <span className="text-white font-semibold">£{(DELIVERY_THRESHOLD - total).toFixed(2)}</span> more for free delivery
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[#1e1e3a]">
                  <span className="text-white font-bold text-base">Total</span>
                  <span className="text-white font-bold text-2xl">£{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 mb-5 p-3 bg-[#080818] border border-[#1e1e3a] rounded-xl flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="bg-[#1a1a2e] border border-[#1e1e3a] rounded px-2 py-1 text-xs text-white font-bold">VISA</div>
                  <div className="bg-[#1a1a2e] border border-[#1e1e3a] rounded px-2 py-1 text-xs text-white font-bold">MC</div>
                  <div className="bg-[#1a1a2e] border border-[#1e1e3a] rounded px-2 py-1 text-xs text-white font-bold">AMEX</div>
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">Card Payment via Stripe</div>
                  <div className="text-[#a1a1aa] text-[10px]">100% secure & encrypted</div>
                </div>
              </div>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base shadow-lg shadow-blue-500/20"
                >
                  Continue to Delivery →
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loading || !formValid}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Redirecting...' : '🔒 Proceed to Checkout'}
                </button>
              )}

              {showForm && !formValid && (
                <p className="text-[#a1a1aa] text-xs text-center mt-2">Please fill in all required fields above.</p>
              )}

              <Link href="/shop" className="block text-center text-[#a1a1aa] hover:text-white text-sm mt-4 transition-colors">
                ← Continue Shopping
              </Link>
            </div>

            {/* Reviews */}
            <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4">What our customers say</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Callum F.', location: 'Edinburgh', text: "Arrived in 2 days, runs perfectly. Best PC I've ever had." },
                  { name: 'Jamie S.', location: 'Inverness', text: 'Dead easy process, delivered on time. Pure class.' },
                  { name: 'Morag H.', location: 'Glasgow', text: 'Brilliant service, honest pricing. Highly recommend.' },
                ].map((r) => (
                  <div key={r.name} className="border-b border-[#1e1e3a] last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#a1a1aa] text-xs leading-relaxed">"{r.text}"</p>
                    <p className="text-[#3f3f46] text-[10px] mt-1">— {r.name}, {r.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-5">
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: '🛡️', text: '2 year warranty included' },
                  { icon: '🚚', text: 'Free delivery on orders over £500' },
                  { icon: '🔁', text: '14 day return policy' },
                  { icon: '📞', text: 'Dedicated support via WhatsApp' },
                  { icon: '🔒', text: '100% secure payment' },
                  { icon: '✅', text: 'Tested & verified by LesmaTech' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm">
                    <span>{item.icon}</span>
                    <span className="text-[#a1a1aa]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}