'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const statusSteps = [
  { key: 'pending', label: 'Order Received' },
  { key: 'parts_ordered', label: 'Parts Ordered' },
  { key: 'in_assembly', label: 'In Assembly' },
  { key: 'quality_check', label: 'Quality Check' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_status_updates(*)')
      .eq('customer_email', email.toLowerCase())
      .order('created_at', { ascending: false })

    setOrders(data || [])
    setSearched(true)
    setLoading(false)
  }

  const getStepIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.key === status)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Order Tracking</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
        <p className="text-[#a1a1aa] text-lg max-w-md mx-auto">
          Enter your email address to see the status of your orders.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-12">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 bg-[#111111] border border-[#27272a] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-12 bg-[#111111] border border-[#27272a] rounded-xl">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-white font-semibold mb-2">No orders found</h3>
          <p className="text-[#a1a1aa] text-sm">No orders found for this email address.</p>
        </div>
      )}

      {orders.map((order) => {
        const currentStepIndex = getStepIndex(order.status)
        const updates = order.order_status_updates?.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        return (
          <div key={order.id} className="bg-[#111111] border border-[#27272a] rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-lg capitalize">
                  {order.type?.replace('_', ' ')} Order
                </h3>
                <p className="text-[#a1a1aa] text-sm mt-1">
                  Placed {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {order.total && (
                <span className="text-white font-bold text-xl">£{order.total}</span>
              )}
            </div>

            {/* Progress bar */}
            {order.status !== 'cancelled' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.map((step, i) => (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                        i < currentStepIndex ? 'bg-green-500 text-white' :
                        i === currentStepIndex ? 'bg-[#2563eb] text-white' :
                        'bg-[#1a1a1a] border border-[#27272a] text-[#a1a1aa]'
                      }`}>
                        {i < currentStepIndex ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs text-center hidden sm:block ${
                        i === currentStepIndex ? 'text-white' : 'text-[#a1a1aa]'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm font-medium">This order has been cancelled.</p>
              </div>
            )}

            {/* Status updates */}
            {updates && updates.length > 0 && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Updates</h4>
                <div className="flex flex-col gap-3">
                  {updates.map((update: any) => (
                    <div key={update.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-white text-sm font-medium">
                          {statusSteps.find(s => s.key === update.status)?.label || update.status}
                        </div>
                        {update.message && (
                          <div className="text-[#a1a1aa] text-sm mt-0.5">{update.message}</div>
                        )}
                        <div className="text-[#3f3f46] text-xs mt-1">
                          {new Date(update.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}