'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'parts_ordered', label: 'Parts Ordered', color: 'blue' },
  { value: 'in_assembly', label: 'In Assembly', color: 'purple' },
  { value: 'quality_check', label: 'Quality Check', color: 'orange' },
  { value: 'shipped', label: 'Shipped', color: 'teal' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  parts_ordered: 'bg-blue-400/10 text-blue-400',
  in_assembly: 'bg-purple-400/10 text-purple-400',
  quality_check: 'bg-orange-400/10 text-orange-400',
  shipped: 'bg-teal-400/10 text-teal-400',
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  const handleUpdateStatus = async () => {
    if (!selected || !newStatus) return
    setLoading(true)

    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', selected.id)

    await supabase
      .from('order_status_updates')
      .insert({
        order_id: selected.id,
        status: newStatus,
        message: statusMessage || null,
      })

    await fetch('/api/orders/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: selected.id,
        customerEmail: selected.customer_email,
        customerName: selected.customer_name,
        status: newStatus,
        message: statusMessage,
      }),
    })

    setLoading(false)
    setStatusMessage('')
    setSelected(null)
    fetchOrders()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-[#a1a1aa] mt-1">Manage and update order statuses</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="border border-[#27272a] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          ← Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Orders list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-10 text-center">
              <p className="text-white font-semibold">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => { setSelected(order); setNewStatus(order.status) }}
                className={`bg-[#111111] border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  selected?.id === order.id ? 'border-[#2563eb]' : 'border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold">{order.customer_name}</div>
                    <div className="text-[#a1a1aa] text-sm">{order.customer_email}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-400/10 text-gray-400'}`}>
                    {statusOptions.find(s => s.value === order.status)?.label || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#a1a1aa] capitalize">{order.type?.replace('_', ' ')}</span>
                  <span className="text-white font-bold">£{order.total || '—'}</span>
                </div>
                <div className="text-[#a1a1aa] text-xs mt-2">
                  {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order detail */}
        <div>
          {selected ? (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 sticky top-24">
              <h3 className="text-white font-bold text-lg mb-4">Update Order</h3>

              <div className="flex flex-col gap-2 mb-6">
                <div className="text-[#a1a1aa] text-xs">Customer</div>
                <div className="text-white text-sm font-medium">{selected.customer_name}</div>
                <div className="text-[#a1a1aa] text-sm">{selected.customer_email}</div>
                {selected.customer_phone && (
                  <div className="text-[#a1a1aa] text-sm">{selected.customer_phone}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Message to customer (optional)</label>
                <textarea
                  rows={3}
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors resize-none"
                  placeholder="e.g. Your parts have been ordered and will arrive in 2-3 days."
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Updating...' : 'Update Status & Notify'}
              </button>
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-8 text-center">
              <p className="text-[#a1a1aa] text-sm">Select an order to manage it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}