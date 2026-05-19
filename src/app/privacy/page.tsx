export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-[#a1a1aa] text-sm mb-12">Last updated: May 2026</p>

      <div className="flex flex-col gap-10 text-[#a1a1aa] leading-relaxed">

        <section>
          <h2 className="text-white font-bold text-xl mb-3">1. Who We Are</h2>
          <p>LesmaTech is an IT services company based in the United Kingdom. We are committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR).</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">2. Data We Collect</h2>
          <p className="mb-3">We collect the following personal data when you use our services:</p>
          <ul className="list-none flex flex-col gap-2 ml-4">
            <li>— Name and email address (when you contact us or place an order)</li>
            <li>— Phone number (optional, for WhatsApp communication)</li>
            <li>— Delivery address (for physical product orders)</li>
            <li>— Payment information (processed securely via Stripe — we do not store card details)</li>
            <li>— IP address and browser data (via cookies and analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">3. How We Use Your Data</h2>
          <p className="mb-3">We use your data to:</p>
          <ul className="list-none flex flex-col gap-2 ml-4">
            <li>— Process and fulfil your orders</li>
            <li>— Communicate with you about your order or enquiry</li>
            <li>— Send order status updates via email</li>
            <li>— Improve our website and services</li>
            <li>— Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">4. Data Sharing</h2>
          <p className="mb-3">We do not sell your personal data. We may share data with:</p>
          <ul className="list-none flex flex-col gap-2 ml-4">
            <li>— Stripe (payment processing)</li>
            <li>— Supabase (secure database hosting)</li>
            <li>— Resend (transactional email delivery)</li>
            <li>— Vercel (website hosting)</li>
          </ul>
          <p className="mt-3">All third-party providers are GDPR compliant.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">5. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Order data is retained for 7 years for accounting purposes.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">6. Your Rights</h2>
          <p className="mb-3">Under UK GDPR, you have the right to:</p>
          <ul className="list-none flex flex-col gap-2 ml-4">
            <li>— Access the personal data we hold about you</li>
            <li>— Request correction of inaccurate data</li>
            <li>— Request deletion of your data</li>
            <li>— Object to or restrict processing of your data</li>
            <li>— Data portability</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at hello@lesmatech.co.uk.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">7. Cookies</h2>
          <p>We use essential cookies to make our website function, and analytics cookies to understand how visitors use our site. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">8. Contact</h2>
          <p>For any privacy-related questions or to exercise your rights, contact us at hello@lesmatech.co.uk.</p>
        </section>

      </div>
    </div>
  )
}