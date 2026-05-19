import Link from 'next/link'

const services = [
  {
    icon: '🖥️',
    title: 'Custom PC Builds',
    description: 'We build your dream PC to your exact budget and requirements. Every component hand-picked for maximum performance.',
    href: '/builder',
    cta: 'Start Building',
  },
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Professional websites and web apps for your business. From simple landing pages to complex e-commerce platforms.',
    href: '/services',
    cta: 'Learn More',
  },
  {
    icon: '🔧',
    title: 'Computer Repair',
    description: 'Hardware or software issues? We diagnose and fix any problem fast, so you can get back to work.',
    href: '/services',
    cta: 'Book Repair',
  },
  {
    icon: '☁️',
    title: 'Hosting & Maintenance',
    description: 'Reliable hosting and ongoing maintenance for your website. We keep your site fast, secure, and always online.',
    href: '/services',
    cta: 'Get Hosting',
  },
]

const stats = [
  { value: '100+', label: 'PCs Built' },
  { value: '50+', label: 'Websites Delivered' },
  { value: '200+', label: 'Repairs Completed' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a0a0a]/70" />
        {/* Blue glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2563eb]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-pulse" />
              <span className="text-[#3b82f6] text-sm font-medium">UK-Based IT Experts</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
              Technology
              <br />
              <span className="text-[#2563eb]">Built For You</span>
            </h1>

            <p className="text-[#a1a1aa] text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              Custom PC builds, professional web development, computer repairs, and hosting. Everything you need from one trusted team.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/builder"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Build Your PC →
              </Link>
              <Link
                href="/services"
                className="border border-[#27272a] hover:border-[#3f3f46] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#27272a] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-[#2563eb] mb-1">{stat.value}</div>
                <div className="text-[#a1a1aa] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Do</h2>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
            From hardware to software, we cover everything your business or home setup needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6">{service.description}</p>
              <Link
                href={service.href}
                className="text-[#2563eb] hover:text-[#3b82f6] text-sm font-medium transition-colors group-hover:underline"
              >
                {service.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative bg-[#111111] border border-[#27272a] rounded-2xl p-10 overflow-hidden text-center">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-[#a1a1aa] mb-8 max-w-md mx-auto">
              Tell us what you need and we'll get back to you within 24 hours.
            </p>
            <Link
              href="/contact"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-block"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}