import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings'
import { Zap, Lock } from 'lucide-react'
import type { ReactNode } from 'react'

const values: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <span className="text-3xl">🎯</span>,
    title: 'Honest Pricing',
    description: 'No hidden fees, no surprises. You always know exactly what you\'re paying for before we start.',
  },
  {
    icon: <Zap className="w-8 h-8 text-[#3b82f6]" />,
    title: 'Fast Turnaround',
    description: 'We respect your time. Most repairs done same day, websites delivered on schedule.',
  },
  {
    icon: <span className="text-3xl">🤝</span>,
    title: 'Personal Service',
    description: 'You deal with us directly — not a call centre. We build real relationships with our clients.',
  },
  {
    icon: <Lock className="w-8 h-8 text-[#3b82f6]" />,
    title: 'Quality Guaranteed',
    description: 'Every PC we build is stress tested. Every website we deliver is fully tested across devices.',
  },
]

export default async function AboutPage() {
  const { data: team } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Who We Are</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About LesmaTech</h1>
        <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
          We're two friends who turned a passion for technology into a business. Based in the UK, we help individuals and businesses get the most out of their technology.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-8 sm:p-12 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-[#a1a1aa] leading-relaxed mb-4">
            LesmaTech started from a simple observation — most people either overpay for tech services or struggle to find someone they can actually trust. We wanted to change that.
          </p>
          <p className="text-[#a1a1aa] leading-relaxed mb-4">
            We started by helping friends and family with their computers and websites. Word spread, and before long we were building custom PCs, designing websites for local businesses, and providing ongoing IT support across the UK.
          </p>
          <p className="text-[#a1a1aa] leading-relaxed">
            Today, LesmaTech is a growing IT services company — but we've kept the same values we started with: honest pricing, quality work, and treating every client like a person, not a ticket number.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.title} className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-white font-semibold mb-2">{value.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {team && team.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.map((member: any) => (
              <div key={member.id} className="bg-[#111111] border border-[#27272a] rounded-xl p-6 text-center hover:border-[#2563eb]/50 transition-all duration-300">
                <div className="w-16 h-16 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#2563eb] font-bold text-xl">{member.name[0]}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-[#2563eb] text-sm font-medium mb-3">{member.role}</p>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to work with us?</h2>
          <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
            Whether you need a new PC, a website, or just some IT help — we're here.
          </p>
          <Link
            href="/contact"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}