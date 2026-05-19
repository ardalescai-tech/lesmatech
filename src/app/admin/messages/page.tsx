'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchMessages()
  }, [router])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMessages(data)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-[#a1a1aa] mt-1">Contact form submissions</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="border border-[#27272a] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          ← Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Messages list */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-8 text-center">
              <p className="text-white font-semibold">No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`bg-[#111111] border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selected?.id === msg.id ? 'border-[#2563eb]' : 'border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="text-white font-medium text-sm mb-1">{msg.name}</div>
                <div className="text-[#a1a1aa] text-xs mb-2">{msg.email}</div>
                <div className="text-[#2563eb] text-xs font-medium mb-1">{msg.subject}</div>
                <div className="text-[#a1a1aa] text-xs line-clamp-2">{msg.message}</div>
                <div className="text-[#3f3f46] text-xs mt-2">
                  {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">{selected.subject}</h3>
                  <div className="text-[#a1a1aa] text-sm">{new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <div className="text-[#a1a1aa] text-xs mb-1">Name</div>
                  <div className="text-white text-sm font-medium">{selected.name}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <div className="text-[#a1a1aa] text-xs mb-1">Email</div>
                  <div className="text-white text-sm font-medium">{selected.email}</div>
                </div>
                {selected.phone && (
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <div className="text-[#a1a1aa] text-xs mb-1">Phone</div>
                    <div className="text-white text-sm font-medium">{selected.phone}</div>
                  </div>
                )}
              </div>

              <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
                <div className="text-[#a1a1aa] text-xs mb-2">Message</div>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  Reply via Email
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#27272a] hover:border-green-500/50 text-[#a1a1aa] hover:text-green-400 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#27272a] rounded-xl p-12 text-center">
              <p className="text-[#a1a1aa]">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}