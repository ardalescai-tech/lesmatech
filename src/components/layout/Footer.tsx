import Link from 'next/link'
import { getSettings } from '@/lib/settings'

export default async function Footer() {
  const settings = await getSettings()

  return (
    <footer className="border-t border-[#27272a] bg-[#0a0a0a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LT</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Lesma<span className="text-[#2563eb]">Tech</span>
              </span>
            </div>
            <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-sm">
              Your local IT experts in the UK. Custom PC builds, web development, computer repairs, and hosting solutions.
            </p>
            {settings.email && (
              <p className="text-[#a1a1aa] text-sm mt-4">
                📧 {settings.email}
              </p>
            )}
            {settings.phone && (
              <p className="text-[#a1a1aa] text-sm mt-1">
                📞 {settings.phone}
              </p>
            )}
            {settings.hours && (
              <p className="text-[#a1a1aa] text-sm mt-1">
                🕐 {settings.hours}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Instagram</a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Twitter</a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Facebook</a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="flex flex-col gap-2">
              {['PC Building', 'Web Development', 'Computer Repair', 'Hosting & Maintenance'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Shop', href: '/shop' },
                { label: 'PC Builder', href: '/builder' },
                { label: 'Contact', href: '/contact' },
                { label: 'Track Order', href: '/track-order' },
                { label: 'Terms & Conditions', href: '/terms' },
{ label: 'Privacy Policy', href: '/privacy' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[#a1a1aa] hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#27272a] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#a1a1aa] text-xs">
            © 2026 LesmaTech. All rights reserved.
          </p>
          <p className="text-[#a1a1aa] text-xs">
            Built with ❤️ in the UK
          </p>
        </div>
      </div>
    </footer>
  )
}