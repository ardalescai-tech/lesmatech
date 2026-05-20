import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShareButtons from './ShareButtons'

const budgetLabels: Record<string, string> = {
  budget: 'Budget Build (Up to £500)',
  mid: 'Mid-Range Build (£500 – £1000)',
  high: 'High-End Build (£1000 – £2000)',
  no_limit: 'No Limit (£2000+)',
}

export default async function SharedBuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: build } = await supabase
    .from('shared_builds')
    .select('*')
    .eq('id', id)
    .single()

  if (!build) notFound()

  const components = build.components as Record<string, any>

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Shared PC Build</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Custom PC Build</h1>
        <p className="text-[#a1a1aa]">Configured with LesmaTech PC Builder</p>
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
            <span className="text-[#a1a1aa] text-sm">Budget</span>
            <span className="text-white text-sm font-medium">{budgetLabels[build.budget] || build.budget}</span>
          </div>
          {Object.entries(components).map(([category, component]: [string, any]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <span className="text-[#a1a1aa] text-sm">{category}</span>
              <div className="text-right">
                <div className="text-white text-sm font-medium">{component.name}</div>
                <div className="text-[#2563eb] text-xs">£{component.price}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg">
            <span className="text-white font-bold">Total (components only)</span>
            <span className="text-white font-bold text-xl">£{build.total}</span>
          </div>
        </div>
      </div>

      <ShareButtons buildId={build.id} />

      <div className="mt-6 text-center">
        <p className="text-[#a1a1aa] text-sm mb-4">Want to build your own custom PC?</p>
        <Link
          href="/builder"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Start Your Build →
        </Link>
      </div>
    </div>
  )
}