export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
      <p className="text-[#a1a1aa] text-sm mb-12">Last updated: May 2026</p>

      <div className="flex flex-col gap-10 text-[#a1a1aa] leading-relaxed">

        <section>
          <h2 className="text-white font-bold text-xl mb-3">1. Introduction</h2>
          <p>These Terms and Conditions govern your use of the LesmaTech website and services. By using our services, you agree to these terms in full. If you disagree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">2. Services</h2>
          <p>LesmaTech provides IT services including custom PC builds, web development, computer repair, and hosting. All services are subject to availability and may be modified at any time without notice.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">3. Orders & Payments</h2>
          <p className="mb-3">All prices are in GBP (£) and include VAT where applicable. Payment is required before work begins unless otherwise agreed in writing. We accept card payments via Stripe.</p>
          <p>For custom PC builds, a deposit may be required before components are ordered. The remaining balance is due upon completion.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">4. Returns & Refunds</h2>
          <p className="mb-3">Pre-built PCs may be returned within 14 days of delivery if unopened and in original condition. Custom PC builds are non-refundable once components have been ordered unless there is a manufacturing defect.</p>
          <p>Web development services are non-refundable once work has commenced. Computer repair services are charged only if the issue is resolved (no fix, no fee).</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">5. Warranty</h2>
          <p className="mb-3">All custom PC builds come with a 12-month warranty covering hardware defects. This does not cover damage caused by misuse, accidents, or unauthorised modifications.</p>
          <p>Component warranties are subject to the manufacturer's terms. We will assist in processing warranty claims where possible.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">6. Limitation of Liability</h2>
          <p>LesmaTech shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">7. Privacy</h2>
          <p>Your personal data is handled in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your data as described therein.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">8. Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">9. Contact</h2>
          <p>If you have any questions about these terms, please contact us at hello@lesmatech.co.uk.</p>
        </section>

      </div>
    </div>
  )
}