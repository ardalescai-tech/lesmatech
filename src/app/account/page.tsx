'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  parts_ordered: 'bg-blue-400/10 text-blue-400',
  in_assembly: 'bg-purple-400/10 text-purple-400',
  quality_check: 'bg-orange-400/10 text-orange-400',
  shipped: 'bg-teal-400/10 text-teal-400',
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

const statusLabels: Record<string, string> = {
  pending: 'Order Received',
  parts_ordered: 'Parts Ordered',
  in_assembly: 'In Assembly',
  quality_check: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/account/login')
        return
      }
      setUser(session.user)

      const { data } = await supabase
        .from('orders')
        .select('*, order_status_updates(*)')
        .eq('customer_email', session.user.email)
        .order('created_at', { ascending: false })

      if (data) setOrders(data)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#a1a1aa]">Loading...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">My Account</h1>
          <p className="text-[#a1a1aa] mt-1">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-[#27272a] hover:border-red-500/50 text-[#a1a1aa] hover:text-red-400 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-white font-bold text-xl mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-[#111111] border border-[#27272a] rounded-xl p-12 text-center">
          <Package className="w-10 h-10 text-[#a1a1aa] mb-4 mx-auto" />
          <h3 className="text-white font-semibold mb-2">No orders yet</h3>
          <p className="text-[#a1a1aa] text-sm mb-6">When you place an order, it will appear here.</p>
          <Link
            href="/shop"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#111111] border border-[#27272a] rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-white font-semibold capitalize">
                    {order.type?.replace('_', ' ')} Order
                  </div>
                  <div className="text-[#a1a1aa] text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {order.total && (
                    <span className="text-white font-bold">£{order.total}</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-400/10 text-gray-400'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              {order.order_status_updates?.length > 0 && (
                <div className="border-t border-[#27272a] pt-3 mt-3">
                  <div className="text-[#a1a1aa] text-xs mb-2">Latest update:</div>
                  {order.order_status_updates
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 1)
                    .map((update: any) => (
                      <div key={update.id} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="text-white text-xs font-medium">{statusLabels[update.status] || update.status}</div>
                          {update.message && <div className="text-[#a1a1aa] text-xs mt-0.5">{update.message}</div>}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="mt-3">
                <Link
                  href="/track-order"
                  className="text-[#2563eb] hover:underline text-xs"
                >
                  Track order →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}