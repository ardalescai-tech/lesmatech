'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const settingFields = [
  { key: 'email', label: 'Email Address', placeholder: 'hello@lesmatech.co.uk', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+44XXXXXXXXXX', type: 'text' },
  { key: 'phone', label: 'Phone Number', placeholder: '+44XXXXXXXXXX', type: 'text' },
  { key: 'location', label: 'Location', placeholder: 'United Kingdom', type: 'text' },
  { key: 'hours', label: 'Business Hours', placeholder: 'Mon – Sat, 9am – 7pm', type: 'text' },
  { key: 'twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/lesmatech', type: 'url' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/lesmatech', type: 'url' },
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/lesmatech', type: 'url' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchSettings()
  }, [router])

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('key, value')
    if (data) {
      const map = data.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value
        return acc
      }, {})
      setSettings(map)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Site Settings</h1>
          <p className="text-[#a1a1aa] mt-1">Update your contact info and social links</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="border border-[#27272a] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          ← Dashboard
        </button>
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 flex flex-col gap-5">
        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="text-[#a1a1aa] text-sm mb-1.5 block">{field.label}</label>
            <input
              type={field.type}
              value={settings[field.key] || ''}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-2"
        >
          {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}