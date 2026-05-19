import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/CartContext'
import CookieBanner from '@/components/ui/CookieBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LesmaTech — IT Services & Custom PC Builds in the UK',
  description: 'Custom PC builds, web development, computer repairs, and hosting solutions. Your local IT experts in the UK.',
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