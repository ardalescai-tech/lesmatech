'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const categories = ['Gaming', 'Office', 'Workstation']

const emptyForm = {
  name: '',
  description: '',
  base_price: '',
  category: 'Gaming',
  image_url: '',
  in_stock: true,
}

export default function AdminPrebuiltPage() {
  const [pcs, setPcs] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchPCs()
  }, [router])

  const fetchPCs = async () => {
    const { data } = await supabase
      .from('prebuilt_pcs')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPcs(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: form.name,
      description: form.description,
      base_price: parseFloat(form.base_price),
      category: form.category,
      image_url: form.image_url,
      in_stock: form.in_stock,
    }

    if (editing) {
      await supabase.from('prebuilt_pcs').update(payload).eq('id', editing)
    } else {
      await supabase.from('prebuilt_pcs').insert(payload)
    }

    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
    setLoading(false)
    fetchPCs()
  }

  const handleEdit = (pc: any) => {
    setForm({
      name: pc.name,
      description: pc.description || '',
      base_price: pc.base_price.toString(),
      category: pc.category,
      image_url: pc.image_url || '',
      in_stock: pc.in_stock,
    })
    setEditing(pc.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this PC?')) return
    await supabase.from('prebuilt_pcs').delete().eq('id', id)
    fetchPCs()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Pre-Built PCs</h1>
          <p className="text-[#a1a1aa] mt-1">Manage shop listings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="border border-[#27272a] text-[#a1a1aa] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            ← Dashboard
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm) }}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add PC'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 mb-10">
          <h2 className="text-white font-bold text-lg mb-6">{editing ? 'Edit PC' : 'Add New PC'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="LesmaTech Warrior X"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors resize-none"
                placeholder="Perfect for 1080p gaming..."
              />
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Base Price (£) *</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="799.99"
              />
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Image URL</label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="in_stock"
                checked={form.in_stock}
                onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                className="w-4 h-4 accent-[#2563eb]"
              />
              <label htmlFor="in_stock" className="text-[#a1a1aa] text-sm">In Stock</label>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : editing ? 'Update PC' : 'Add PC'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111111] border border-[#27272a] rounded-xl overflow-hidden">
        {pcs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white font-semibold">No PCs yet</p>
            <p className="text-[#a1a1aa] text-sm mt-1">Click "Add PC" to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#27272a]">
              <tr>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Category</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Price</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Stock</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {pcs.map((pc) => (
                <tr key={pc.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium text-sm">{pc.name}</div>
                    <div className="text-[#a1a1aa] text-xs mt-0.5 line-clamp-1">{pc.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      pc.category === 'Gaming' ? 'bg-purple-500/10 text-purple-400' :
                      pc.category === 'Office' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>{pc.category}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold text-sm">£{pc.base_price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${pc.in_stock ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {pc.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pc)}
                        className="text-[#a1a1aa] hover:text-white text-xs border border-[#27272a] hover:border-[#3f3f46] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pc.id)}
                        className="text-[#a1a1aa] hover:text-red-400 text-xs border border-[#27272a] hover:border-red-500/50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}