'use client'

import Link from 'next/link'
import { Monitor, Globe, Wrench, Cloud } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const services: { Icon: LucideIcon; title: string; description: string; href: string; cta: string }[] = [
  {
    Icon: Monitor,
    title: 'Custom PC Builds',
    description: 'We build your dream PC to your exact budget and requirements. Every component hand-picked for maximum performance.',
    href: '/builder',
    cta: 'Start Building',
  },
  {
    Icon: Globe,
    title: 'Web Development',
    description: 'Professional websites and web apps for your business. From simple landing pages to complex e-commerce platforms.',
    href: '/services',
    cta: 'Learn More',
  },
  {
    Icon: Wrench,
    title: 'Computer Repair',
    description: 'Hardware or software issues? We diagnose and fix any problem fast, so you can get back to work.',
    href: '/services',
    cta: 'Book Repair',
  },
  {
    Icon: Cloud,
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

const reviews = [
  {
    name: 'Callum Fraser',
    location: 'Edinburgh',
    rating: 5,
    text: 'Absolutely brilliant service. Got my custom PC built within a week and it runs flawlessly. The lads really know their stuff — would highly recommend to anyone in Edinburgh.',
    service: 'Custom PC Build',
  },
  {
    name: 'Morag Henderson',
    location: 'Glasgow',
    rating: 5,
    text: 'My laptop was completely dead and they had it sorted in no time. Honest pricing, no nonsense. Refreshing to find a repair shop you can actually trust.',
    service: 'Computer Repair',
  },
  {
    name: 'Ewan MacPherson',
    location: 'Dundee',
    rating: 5,
    text: 'LesmaTech built a cracking website for my plumbing business. Dead easy to work with and the end result was far better than I expected for the price.',
    service: 'Web Development',
  },
  {
    name: 'Fiona Gillespie',
    location: 'Aberdeen',
    rating: 5,
    text: 'Fast, reliable hosting and they actually respond when something goes wrong. Been with them for six months now and had zero downtime. Cannie ask for more than that.',
    service: 'Hosting & Maintenance',
  },
  {
    name: 'Jamie Sutherland',
    location: 'Inverness',
    rating: 5,
    text: 'Used the PC builder tool on the site and the whole process was dead straightforward. Delivered on time and everything was perfectly cable managed. Pure class.',
    service: 'Custom PC Build',
  },
  {
    name: 'Isla Mackenzie',
    location: 'Stirling',
    rating: 5,
    text: 'Had a virus absolutely wrecking my work laptop. They cleaned it up same day and even gave me tips to stay safe going forward. Great bunch of people.',
    service: 'Computer Repair',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-[#05050f]/80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2563eb]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-6">
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
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20"
              >
                Build Your PC →
              </Link>
              <Link
                href="/services"
                className="border border-[#1e1e3a] hover:border-[#2563eb]/50 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1e1e3a] bg-[#0d0d1a]">
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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#3b82f6] text-sm font-medium">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
              From hardware to software, we cover everything your business or home setup needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6 hover:border-[#2563eb]/50 transition-all duration-300 group"
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(37,99,235,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="w-12 h-12 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-xl flex items-center justify-center mb-4">
                  <service.Icon className="w-6 h-6 text-[#3b82f6]" />
                </div>
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
        </div>
      </section>

      {/* Reviews */}
      <section className="relative border-t border-[#1e1e3a] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0d1a]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#3b82f6] text-sm font-medium">Customer Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trusted Across Scotland</h2>
            <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
              Don't just take our word for it — here's what our customers have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-[#080818] border border-[#1e1e3a] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#2563eb]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[#a1a1aa] text-sm leading-relaxed flex-1">"{review.text}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#1e1e3a]">
                  <div>
                    <div className="text-white font-semibold text-sm">{review.name}</div>
                    <div className="text-[#3f3f46] text-xs">{review.location}</div>
                  </div>
                  <span className="text-[#2563eb] text-xs font-medium bg-[#2563eb]/10 px-2 py-1 rounded-full">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-10 overflow-hidden text-center">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.12)_0%,transparent_60%)]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-[#a1a1aa] mb-8 max-w-md mx-auto">
              Tell us what you need and we'll get back to you within 24 hours.
            </p>
            <Link
              href="/contact"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 inline-block shadow-lg shadow-blue-500/20"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}