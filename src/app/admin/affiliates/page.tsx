'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Users, Mail, Phone, Globe, Eye } from 'lucide-react'

export default function AdminAffiliatesPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('affiliate_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setApplications(data)
  }

  const handleUpdateStatus = async (id: string, status: string, code?: string) => {
    setLoading(true)
    await supabase
      .from('affiliate_applications')
      .update({ status, ...(code ? { affiliate_code: code } : {}) })
      .eq('id', id)
    await fetchApplications()
    if (selected?.id === id) setSelected({ ...selected, status, ...(code ? { affiliate_code: code } : {}) })
    setLoading(false)
  }

  const generateCode = (name: string) => {
    const base = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '')
    const num = Math.floor(Math.random() * 900) + 100
    return `${base}${num}`
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  const statusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-500/10 text-green-400 border-green-500/30'
    if (status === 'rejected') return 'bg-red-500/10 text-red-400 border-red-500/30'
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
  }

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="w-3.5 h-3.5" />
    if (status === 'rejected') return <XCircle className="w-3.5 h-3.5" />
    return <Clock className="w-3.5 h-3.5" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Applications</h1>
          <p className="text-[#a1a1aa] mt-1">Review and manage affiliate programme applications</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="border border-[#27272a] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          ← Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: applications.length, icon: Users, color: 'text-white' },
          { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
          { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, icon: XCircle, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111111] border border-[#27272a] rounded-xl p-4">
            <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-[#a1a1aa] text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === f ? 'bg-[#2563eb] text-white' : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111111] border border-[#27272a] rounded-xl">
              <Users className="w-8 h-8 text-[#a1a1aa] mx-auto mb-3" />
              <p className="text-white font-semibold">No applications</p>
            </div>
          ) : filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              className={`bg-[#111111] border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selected?.id === app.id ? 'border-[#2563eb]' : 'border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-semibold text-sm">{app.full_name}</div>
                  <div className="text-[#a1a1aa] text-xs">{app.email}</div>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${statusBadge(app.status)}`}>
                  {statusIcon(app.status)}
                  {app.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
                <span>{app.platform}</span>
                {app.audience_size && <span>· {app.audience_size}</span>}
                {app.niche && <span>· {app.niche}</span>}
              </div>
              {app.affiliate_code && (
                <div className="mt-2 text-xs text-[#2563eb] font-mono bg-[#2563eb]/10 px-2 py-1 rounded w-fit">
                  Code: {app.affiliate_code}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 sticky top-24 h-fit">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">{selected.full_name}</h2>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border w-fit mt-1 ${statusBadge(selected.status)}`}>
                  {statusIcon(selected.status)}
                  {selected.status}
                </span>
              </div>
              <div className="text-[#a1a1aa] text-xs">{new Date(selected.created_at).toLocaleDateString('en-GB')}</div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#a1a1aa]" />
                <a href={`mailto:${selected.email}`} className="text-[#3b82f6] hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[#a1a1aa]" />
                  <span className="text-white">{selected.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-[#a1a1aa]" />
                <span className="text-white">{selected.platform}</span>
                {selected.audience_size && <span className="text-[#a1a1aa]">· {selected.audience_size} followers</span>}
              </div>
              {selected.niche && (
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-[#a1a1aa]" />
                  <span className="text-white">{selected.niche}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="text-[#a1a1aa] text-xs font-medium mb-1">Why they want to join:</div>
              <p className="text-white text-sm leading-relaxed bg-[#1a1a1a] rounded-lg p-3">{selected.why_join}</p>
            </div>

            {selected.experience && (
              <div className="mb-6">
                <div className="text-[#a1a1aa] text-xs font-medium mb-1">Previous experience:</div>
                <p className="text-white text-sm leading-relaxed bg-[#1a1a1a] rounded-lg p-3">{selected.experience}</p>
              </div>
            )}

            {selected.affiliate_code && (
              <div className="mb-6 p-3 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-xl">
                <div className="text-[#a1a1aa] text-xs mb-1">Affiliate Code</div>
                <div className="text-white font-mono font-bold text-lg">{selected.affiliate_code}</div>
              </div>
            )}

            {selected.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(selected.id, 'approved', generateCode(selected.full_name))}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selected.id, 'rejected')}
                  disabled={loading}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 disabled:opacity-50 text-red-400 font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}

            {selected.status === 'approved' && (
              <button
                onClick={() => handleUpdateStatus(selected.id, 'rejected')}
                disabled={loading}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Revoke Approval
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#27272a] rounded-xl p-12 text-center">
            <Eye className="w-8 h-8 text-[#a1a1aa] mx-auto mb-3" />
            <p className="text-[#a1a1aa] text-sm">Select an application to view details</p>
          </div>
        )}

      </div>
    </div>
  )
}