import Link from 'next/link'
import { CheckCircle, Search, Smartphone, Wrench, Truck } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen">
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-10 text-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Order Confirmed!</h1>
          <p className="text-[#a1a1aa] mb-2">
            Thank you for your order. We've received your payment and will start processing your build immediately.
          </p>
          <p className="text-[#a1a1aa] text-sm">
            You'll receive a confirmation email shortly. We'll contact you via WhatsApp with updates.
          </p>
        </div>

        <div className="bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">What happens next?</h3>
          <div className="flex flex-col gap-4">
            {[
              { step: '1', Icon: Search, text: 'We review your order and source all components' },
              { step: '2', Icon: Smartphone, text: 'We contact you via WhatsApp to confirm details' },
              { step: '3', Icon: Wrench, text: 'We assemble and stress test your PC' },
              { step: '4', Icon: Truck, text: 'We ship your order with a tracking number' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.Icon className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <span className="text-[#a1a1aa] text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/" className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center shadow-lg shadow-blue-500/20">
            Back to Home
          </Link>
          <Link href="/track-order" className="flex-1 border border-[#1e1e3a] hover:border-[#2563eb]/50 text-[#a1a1aa] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}