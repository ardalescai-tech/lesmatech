'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingBag, User, LogOut, ChevronDown, ChevronUp, Cpu, ExternalLink } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  parts_ordered: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  in_assembly: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
  quality_check: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
  shipped: 'bg-teal-400/10 text-teal-400 border-teal-400/30',
  delivered: 'bg-green-400/10 text-green-400 border-green-400/30',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/30',
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

const statusSteps = ['pending', 'parts_ordered', 'in_assembly', 'quality_check', 'shipped', 'delivered']

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
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
    <div className="min-h-screen">
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Account</h1>
                <p className="text-[#a1a1aa] text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-[#1e1e3a] hover:border-red-500/50 text-[#a1a1aa] hover:text-red-400 text-sm px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: orders.length },
            { icon: Package, label: 'Active Orders', value: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length },
            { icon: Cpu, label: 'Custom Builds', value: orders.filter(o => o.type === 'custom_pc').length },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-5">
              <stat.icon className="w-5 h-5 text-[#3b82f6] mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[#a1a1aa] text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#3b82f6]" /> My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-[#a1a1aa] mb-4 mx-auto" />
            <h3 className="text-white font-semibold mb-2">No orders yet</h3>
            <p className="text-[#a1a1aa] text-sm mb-6">When you place an order, it will appear here.</p>
            <Link href="/shop" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block shadow-lg shadow-blue-500/20">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id
              const currentStepIndex = statusSteps.indexOf(order.status)
              const components = order.notes ? (() => { try { return JSON.parse(order.notes) } catch { return null } })() : null

              return (
                <div key={order.id} className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl overflow-hidden hover:border-[#2563eb]/30 transition-all duration-200">

                  {/* Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#080818] border border-[#1e1e3a] rounded-xl flex items-center justify-center">
                          {order.type === 'custom_pc' ? <Cpu className="w-5 h-5 text-[#3b82f6]" /> : <ShoppingBag className="w-5 h-5 text-[#3b82f6]" />}
                        </div>
                        <div>
                          <div className="text-white font-semibold capitalize text-sm">
                            {order.type?.replace(/_/g, ' ') || 'Order'}
                          </div>
                          <div className="text-[#a1a1aa] text-xs mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.total && <span className="text-white font-bold">£{order.total}</span>}
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[order.status] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#a1a1aa]" /> : <ChevronDown className="w-4 h-4 text-[#a1a1aa]" />}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                      <div className="mt-4">
                        <div className="flex items-center gap-1">
                          {statusSteps.map((s, i) => (
                            <div key={s} className="flex-1 flex items-center gap-1">
                              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                i <= currentStepIndex ? 'bg-[#2563eb]' : 'bg-[#1e1e3a]'
                              }`} />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[#3f3f46] text-[9px]">Received</span>
                          <span className="text-[#3f3f46] text-[9px]">Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-[#1e1e3a] p-5">

                      {/* Components list for custom PC */}
                      {components?.components && (
                        <div className="mb-5">
                          <h4 className="text-white font-semibold text-sm mb-3">Build Components</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(components.components).map(([cat, comp]: [string, any]) => (
                              <div key={cat} className="flex items-center justify-between bg-[#080818] border border-[#1e1e3a] rounded-lg px-3 py-2">
                                <div>
                                  <div className="text-[#a1a1aa] text-[10px] uppercase tracking-wide">{cat}</div>
                                  <div className="text-white text-xs font-medium">{comp.name}</div>
                                </div>
                                <div className="text-[#2563eb] text-xs">£{comp.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status history */}
                      {order.order_status_updates?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white font-semibold text-sm mb-3">Order History</h4>
                          <div className="flex flex-col gap-2">
                            {order.order_status_updates
                              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .map((update: any) => (
                                <div key={update.id} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-1.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="text-white text-xs font-medium">{statusLabels[update.status] || update.status}</div>
                                      <div className="text-[#3f3f46] text-[10px]">
                                        {new Date(update.created_at).toLocaleDateString('en-GB')}
                                      </div>
                                    </div>
                                    {update.message && <div className="text-[#a1a1aa] text-xs mt-0.5">{update.message}</div>}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Link
                          href="/track-order"
                          className="flex items-center gap-1.5 text-[#2563eb] hover:text-[#3b82f6] text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Track Order
                        </Link>
                        <Link
                          href="/contact"
                          className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white text-xs font-medium transition-colors"
                        >
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}