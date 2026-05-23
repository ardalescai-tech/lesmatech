'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, Mail, Settings, Monitor, Wrench, Globe } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, shopComponents: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin')
        return
      }

      const [products, orders, messages, shopComponents] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }),
        supabase.from('shop_components').select('id', { count: 'exact' }),
      ])

      setStats({
        products: products.count || 0,
        orders: orders.count || 0,
        messages: messages.count || 0,
        shopComponents: shopComponents.count || 0,
      })
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#a1a1aa]">Loading...</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-[#a1a1aa] mt-1">Manage your LesmaTech store</p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-[#27272a] hover:border-red-500/50 text-[#a1a1aa] hover:text-red-400 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Products', value: stats.products, Icon: Package },
          { label: 'Total Orders', value: stats.orders, Icon: ShoppingCart },
          { label: 'Messages', value: stats.messages, Icon: Mail },
          { label: 'Shop Components', value: stats.shopComponents, Icon: Settings },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111111] border border-[#27272a] rounded-xl p-6">
            <stat.Icon className="w-7 h-7 text-[#a1a1aa] mb-2" />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[#a1a1aa] text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/admin/products" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Package className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Manage Products</h3>
          <p className="text-[#a1a1aa] text-sm">Add, edit, or remove components from the shop.</p>
        </Link>

        <Link href="/admin/prebuilt" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Monitor className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Pre-Built PCs</h3>
          <p className="text-[#a1a1aa] text-sm">Add and manage pre-built PC listings in the shop.</p>
        </Link>

        <Link href="/admin/components" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Wrench className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Builder Components</h3>
          <p className="text-[#a1a1aa] text-sm">Manage components available in the PC Builder.</p>
        </Link>

        <Link href="/admin/shop-components" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Settings className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Shop Components</h3>
          <p className="text-[#a1a1aa] text-sm">Manage individual components available for retail in the shop.</p>
        </Link>

        <Link href="/admin/orders" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <ShoppingCart className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">View Orders</h3>
          <p className="text-[#a1a1aa] text-sm">See all orders and update their status.</p>
        </Link>

        <Link href="/admin/messages" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Mail className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">View Messages</h3>
          <p className="text-[#a1a1aa] text-sm">Read contact form submissions.</p>
        </Link>

        <Link href="/" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Globe className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">View Site</h3>
          <p className="text-[#a1a1aa] text-sm">Go to the public-facing website.</p>
        </Link>

        <Link href="/admin/settings" className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
          <Settings className="w-8 h-8 text-[#a1a1aa] mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Site Settings</h3>
          <p className="text-[#a1a1aa] text-sm">Update contact info, social links, and business hours.</p>
        </Link>
      </div>
    </div>
  )
}