'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/CartContext'
import { ShoppingCart } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/web-packages', label: 'Web Packages' },
  { href: '/shop', label: 'Shop' },
  { href: '/builder', label: 'PC Builder' },
  { href: '/affiliates', label: 'Affiliates' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setIsLoggedIn(true)

      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', session.user.id)
        .single()
      if (data) setIsAdmin(true)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e3a] bg-[#05050f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Lesma<span className="text-[#2563eb]">Tech</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-[#2563eb] hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className="relative border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white p-2 rounded-lg transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2563eb] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link
                href="/account"
                className="border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                My Account
              </Link>
            ) : (
              <Link
                href="/account/login"
                className="border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                My Account
              </Link>
            )}

            <Link
              href="/contact"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="md:hidden text-[#a1a1aa] hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1e1e3a] py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-[#2563eb] text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            <Link
              href="/cart"
              className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              Cart {count > 0 && <span className="bg-[#2563eb] text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>}
            </Link>
            {isLoggedIn ? (
              <Link href="/account" className="text-[#a1a1aa] hover:text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>
                My Account
              </Link>
            ) : (
              <Link href="/account/login" className="text-[#a1a1aa] hover:text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>
                My Account
              </Link>
            )}
            <Link
              href="/contact"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-fit"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}