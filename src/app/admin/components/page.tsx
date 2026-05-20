'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const categories = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'PSU', 'Case', 'Cooler', 'Fans', 'Other']
const brands = ['AMD', 'Intel', 'Nvidia', 'Samsung', 'WD', 'Seagate', 'Corsair', 'G.Skill', 'NZXT', 'Lian Li', 'Fractal', 'be quiet!', 'Seasonic', 'Any']
const budgetTierOptions = ['budget', 'mid', 'high', 'no_limit']

const emptyForm = {
  name: '',
  brand: 'AMD',
  category: 'CPU',
  price: '',
  specs: '',
  image_url: '',
  budget_tiers: ['budget'],
  in_stock: true,
}

export default function AdminComponentsPage() {
  const [components, setComponents] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    fetchComponents()
  }, [router])

  const fetchComponents = async () => {
    const { data } = await supabase
      .from('builder_components')
      .select('*')
      .order('category', { ascending: true })
    if (data) setComponents(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: parseFloat(form.price),
      specs: form.specs,
      image_url: form.image_url,
      budget_tiers: form.budget_tiers,
      in_stock: form.in_stock,
    }

    if (editing) {
      await supabase.from('builder_components').update(payload).eq('id', editing)
    } else {
      await supabase.from('builder_components').insert(payload)
    }

    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
    setLoading(false)
    fetchComponents()
  }

  const handleEdit = (component: any) => {
    setForm({
      name: component.name,
      brand: component.brand,
      category: component.category,
      price: component.price.toString(),
      specs: component.specs || '',
      image_url: component.image_url || '',
      budget_tiers: component.budget_tiers,
      in_stock: component.in_stock,
    })
    setEditing(component.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this component?')) return
    await supabase.from('builder_components').delete().eq('id', id)
    fetchComponents()
  }

  const toggleBudgetTier = (tier: string) => {
    setForm((prev) => ({
      ...prev,
      budget_tiers: prev.budget_tiers.includes(tier)
        ? prev.budget_tiers.filter((t) => t !== tier)
        : [...prev.budget_tiers, tier],
    }))
  }

  const filtered = filterCategory === 'All'
    ? components
    : components.filter((c) => c.category === filterCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Builder Components</h1>
          <p className="text-[#a1a1aa] mt-1">Manage components available in the PC Builder</p>
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
            {showForm ? 'Cancel' : '+ Add Component'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#111111] border border-[#27272a] rounded-xl p-6 mb-10">
          <h2 className="text-white font-bold text-lg mb-6">{editing ? 'Edit Component' : 'Add New Component'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="AMD Ryzen 5 7600X"
              />
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Brand *</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              >
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Price (£) *</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="199.99"
              />
            </div>

            <div>
              <label className="text-[#a1a1aa] text-sm mb-1.5 block">Specs</label>
              <input
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                placeholder="6-core, 12-thread, 4.7GHz base"
              />
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

            <div className="sm:col-span-2">
              <label className="text-[#a1a1aa] text-sm mb-2 block">Budget Tiers *</label>
              <div className="flex gap-3 flex-wrap">
                {budgetTierOptions.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => toggleBudgetTier(tier)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.budget_tiers.includes(tier)
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#1a1a1a] border border-[#27272a] text-[#a1a1aa]'
                    }`}
                  >
                    {tier === 'no_limit' ? 'No Limit' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
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
                {loading ? 'Saving...' : editing ? 'Update Component' : 'Add Component'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white font-semibold">No components</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#27272a]">
              <tr>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Category</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Brand</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Price</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Stock</th>
                <th className="text-left text-[#a1a1aa] text-xs uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filtered.map((component) => (
                <tr key={component.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium text-sm">{component.name}</div>
                    <div className="text-[#a1a1aa] text-xs mt-0.5">{component.specs}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#2563eb]/10 text-[#3b82f6] text-xs px-2 py-1 rounded-full">{component.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[#a1a1aa] text-sm">{component.brand}</td>
                  <td className="px-6 py-4 text-white font-semibold text-sm">£{component.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${component.in_stock ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {component.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(component)}
                        className="text-[#a1a1aa] hover:text-white text-xs border border-[#27272a] hover:border-[#3f3f46] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(component.id)}
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