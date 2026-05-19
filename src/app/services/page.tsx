import Link from 'next/link'

const services = [
  {
    icon: '🖥️',
    title: 'Custom PC Builds',
    description: 'Tell us your budget and what you need the PC for — gaming, work, video editing, or anything else. We source the best components and build it for you, tested and ready to go.',
    features: [
      'Budget-matched component selection',
      'Full assembly & cable management',
      'Windows installation & setup',
      'Stress tested before delivery',
      'Post-build support included',
    ],
    cta: 'Start Your Build',
    href: '/builder',
  },
  {
    icon: '🛒',
    title: 'Pre-Built PCs',
    description: 'Browse our selection of ready-to-ship PCs. Each build is carefully put together for common use cases — gaming, office work, content creation, and more.',
    features: [
      'Ready to ship immediately',
      'Multiple budget tiers',
      'Fully tested & verified',
      'Warranty included',
      'Upgrade options available',
    ],
    cta: 'Browse Shop',
    href: '/shop',
  },
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'We design and build professional websites tailored to your business. From simple landing pages to full e-commerce platforms — transparent pricing, no hidden fees.',
    features: [
      'Custom design for your brand',
      'Mobile responsive',
      'SEO optimised from day one',
      'Fast loading & secure',
      'Admin panel included',
    ],
    cta: 'Get a Web Quote',
    href: '/web-quote',
  },
  {
    icon: '🔧',
    title: 'Computer Repair',
    description: 'Something not working? We diagnose and fix hardware and software issues quickly. No fix, no fee — we only charge when the problem is solved.',
    features: [
      'Hardware diagnostics & repair',
      'Virus & malware removal',
      'OS reinstall & recovery',
      'Data recovery',
      'No fix, no fee guarantee',
    ],
    cta: 'Book a Repair',
    href: '/repair-quote',
  },
  {
    icon: '☁️',
    title: 'Hosting & Maintenance',
    description: 'We host and maintain your website so you never have to worry about downtime, security, or updates. Monthly plans with no long-term contracts.',
    features: [
      'Fast UK-based hosting',
      'SSL certificate included',
      'Daily backups',
      'Monthly updates & maintenance',
      'Priority support',
    ],
    cta: 'Get Hosting',
    href: '/contact',
  },
  {
    icon: '📞',
    title: 'IT Consultation',
    description: 'Not sure what you need? We offer free consultations to help you figure out the best solution for your home or business setup.',
    features: [
      'Free initial consultation',
      'Home & business setups',
      'Network & security advice',
      'Hardware recommendations',
      'Remote & in-person available',
    ],
    cta: 'Book Consultation',
    href: '/contact',
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">What We Offer</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Services</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Everything IT — under one roof. Built for individuals and businesses across the UK.
        </p>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-[#111111] border border-[#27272a] rounded-xl p-6 hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col"
          >
            <div className="text-3xl mb-4">{service.icon}</div>
            <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed mb-5">{service.description}</p>

            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={service.href}
              className="block text-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              {service.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white mb-3">Not sure what you need?</h2>
          <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
            Drop us a message and we'll point you in the right direction — no pressure, no sales pitch.
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