import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/CartContext'
import CookieBanner from '@/components/ui/CookieBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LesmaTech — Custom PC Builds & IT Services in the UK',
    template: '%s | LesmaTech',
  },
  description: 'Custom PC builds, professional web development, computer repairs, and hosting solutions. Your trusted local IT experts in the UK.',
  keywords: ['custom PC builds UK', 'computer repair UK', 'web development UK', 'IT services UK', 'PC builder', 'gaming PC UK'],
  authors: [{ name: 'LesmaTech' }],
  creator: 'LesmaTech',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://lesmatech.co.uk',
    siteName: 'LesmaTech',
    title: 'LesmaTech — Custom PC Builds & IT Services in the UK',
    description: 'Custom PC builds, professional web development, computer repairs, and hosting solutions.',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'LesmaTech — Custom PC Builds & IT Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LesmaTech — Custom PC Builds & IT Services in the UK',
    description: 'Custom PC builds, professional web development, computer repairs, and hosting solutions.',
    images: ['/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  )
}