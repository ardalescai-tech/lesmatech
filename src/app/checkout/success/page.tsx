import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-12">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
        <p className="text-[#a1a1aa] mb-4">
          Thank you for your order. We've received your payment and will start processing your build immediately.
        </p>
        <p className="text-[#a1a1aa] mb-8">
          You'll receive a confirmation email shortly. We'll contact you via WhatsApp with updates on your order.
        </p>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-5 mb-8 text-left">
          <h3 className="text-white font-semibold mb-3">What happens next?</h3>
          <div className="flex flex-col gap-3">
            {[
              { step: '1', text: 'We review your order and source all components' },
              { step: '2', text: 'We contact you via WhatsApp to confirm details' },
              { step: '3', text: 'We assemble and stress test your PC' },
              { step: '4', text: 'We ship your order with a tracking number' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{item.step}</span>
                </div>
                <span className="text-[#a1a1aa] text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}