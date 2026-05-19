import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const addons = [
  { name: 'Hosting & Domain Setup', price: 49, per: 'one-time' },
  { name: 'Monthly Maintenance', price: 29, per: 'month' },
  { name: 'Extra Page', price: 49, per: 'each' },
  { name: 'Logo Design', price: 149, per: 'one-time' },
  { name: 'Copywriting (per page)', price: 39, per: 'each' },
  { name: 'Multilingual Support', price: 199, per: 'one-time' },
]

export default async function WebPackagesPage() {
  const { data: packages } = await supabase
    .from('web_packages')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Web Development</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Website Packages</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Transparent pricing for every type of business. Pick a package, or contact us for a fully custom quote.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {packages?.map((pkg: any) => (
          <div
            key={pkg.id}
            className="relative bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col"
          >
            {pkg.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-white font-bold text-xl mb-1">{pkg.name}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{pkg.description}</p>
            </div>

            <div className="mb-6">
              {pkg.price ? (
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">£{pkg.price}</span>
                  <span className="text-[#a1a1aa] text-sm mb-1">one-time</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-white">Let's Talk</span>
              )}
            </div>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {(pkg.features as string[]).map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
              {(pkg.not_included as string[]).map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#3f3f46]">
                  <span className="mt-0.5">✕</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={`/contact?package=${pkg.name}`}
              className="block text-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              {pkg.price ? 'Get Started' : 'Contact Us'}
            </Link>
          </div>
        ))}
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-2">Add-ons</h2>
        <p className="text-[#a1a1aa] text-sm mb-8">Enhance any package with these optional extras.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <div key={addon.name} className="bg-[#111111] border border-[#27272a] rounded-xl px-5 py-4 flex items-center justify-between">
              <span className="text-white text-sm font-medium">{addon.name}</span>
              <div className="text-right">
                <span className="text-[#2563eb] font-bold">£{addon.price}</span>
                <span className="text-[#a1a1aa] text-xs ml-1">/ {addon.per}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Not sure which package is right for you?</h2>
        <p className="text-[#a1a1aa] mb-6 max-w-lg mx-auto">
          Tell us about your business and what you need — we'll recommend the best option and give you a tailored quote.
        </p>
        <Link
          href="/contact"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-block"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  )
}