'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, Monitor, Smartphone, Zap, HardDrive, Settings, Wrench } from 'lucide-react'

const steps = ['Device', 'Problem', 'Details', 'Submit']

const devices: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'desktop', label: 'Desktop PC', icon: <Monitor className="w-8 h-8" /> },
  { id: 'laptop', label: 'Laptop', icon: <span className="text-3xl">💻</span> },
  { id: 'mac', label: 'Mac / MacBook', icon: <span className="text-3xl">🍎</span> },
  { id: 'tablet', label: 'Tablet / iPad', icon: <Smartphone className="w-8 h-8" /> },
  { id: 'other', label: 'Other', icon: <span className="text-3xl">🔌</span> },
]

const problems: { id: string; label: string; icon: ReactNode; description: string }[] = [
  { id: 'slow', label: 'Running Slow', icon: <span className="text-2xl">🐢</span>, description: 'PC takes long to boot or run programs' },
  { id: 'virus', label: 'Virus / Malware', icon: <span className="text-2xl">🦠</span>, description: 'Pop-ups, strange behaviour, ransomware' },
  { id: 'screen', label: 'Screen Issue', icon: <Monitor className="w-6 h-6" />, description: 'Cracked, flickering, or no display' },
  { id: 'nopower', label: "Won't Turn On", icon: <Zap className="w-6 h-6" />, description: 'No power, not booting, black screen' },
  { id: 'storage', label: 'Storage / Data', icon: <HardDrive className="w-6 h-6" />, description: 'Hard drive failure, data recovery' },
  { id: 'os', label: 'OS / Software', icon: <Settings className="w-6 h-6" />, description: 'Windows issues, crashes, reinstall' },
  { id: 'network', label: 'Network / WiFi', icon: <span className="text-2xl">📶</span>, description: 'No internet, slow connection, WiFi issues' },
  { id: 'hardware', label: 'Hardware Upgrade', icon: <Wrench className="w-6 h-6" />, description: 'RAM, SSD, GPU upgrade' },
  { id: 'other', label: 'Other', icon: <span className="text-2xl">❓</span>, description: 'Something else — describe it below' },
]

export default function RepairQuotePage() {
  const [step, setStep] = useState(0)
  const [device, setDevice] = useState<string | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [details, setDetails] = useState({ name: '', email: '', phone: '', description: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const currentStep = steps[step]

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          subject: 'Computer Repair Request',
          message: `
Device: ${devices.find(d => d.id === device)?.label}
Problem: ${problems.find(p => p.id === problem)?.label}

Description:
${details.description}
          `.trim(),
        }),
      })
      if (res.ok) setSubmitStatus('success')
      else setSubmitStatus('error')
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[#3b82f6] text-sm font-medium">Computer Repair</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Book a Repair</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
          Tell us what's wrong and we'll get back to you within a few hours. No fix, no fee.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-[#2563eb] text-white' :
              'bg-[#1a1a1a] border border-[#27272a] text-[#a1a1aa]'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : 'text-[#a1a1aa]'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-[#27272a]" />}
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 sm:p-8 mb-8">

        {currentStep === 'Device' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">What device needs repairing?</h2>
            <p className="text-[#a1a1aa] mb-8">Select the device you need help with.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 ${
                    device === d.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="mb-2 flex justify-center text-[#a1a1aa]">{d.icon}</div>
                  <div className="text-white text-sm font-medium text-center">{d.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'Problem' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">What's the problem?</h2>
            <p className="text-[#a1a1aa] mb-8">Select the issue that best describes your problem.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProblem(p.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                    problem === p.id
                      ? 'border-[#2563eb] bg-[#2563eb]/10'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="mb-2 text-[#a1a1aa]">{p.icon}</div>
                  <div className="text-white font-semibold text-sm mb-1">{p.label}</div>
                  <div className="text-[#a1a1aa] text-xs">{p.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'Details' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-2">Your details</h2>
            <p className="text-[#a1a1aa] mb-8">We'll get back to you within a few hours.</p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] text-sm mb-1.5 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
                  placeholder="+44 XXXX XXXXXX"
                />
              </div>
              <div>
                <label className="text-[#a1a1aa] text-sm mb-1.5 block">Describe the problem *</label>
                <textarea
                  rows={5}
                  required
                  value={details.description}
                  onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors resize-none"
                  placeholder="Describe what's happening, when it started, any error messages you've seen, etc."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'Submit' && (
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">Repair Request Summary</h2>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <span className="text-[#a1a1aa] text-sm">Device</span>
                <span className="text-white text-sm font-medium">{devices.find(d => d.id === device)?.label}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <span className="text-[#a1a1aa] text-sm">Problem</span>
                <span className="text-white text-sm font-medium">{problems.find(p => p.id === problem)?.label}</span>
              </div>
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <div className="text-[#a1a1aa] text-sm mb-1">Description</div>
                <div className="text-white text-sm">{details.description}</div>
              </div>
              <div className="p-3 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg">
                <p className="text-[#3b82f6] text-sm font-medium">No fix, no fee guarantee</p>
                <p className="text-[#a1a1aa] text-xs mt-1">We'll diagnose your device and only charge if we fix the problem.</p>
              </div>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4 mx-auto" />
                <h3 className="text-white font-bold text-xl mb-2">Repair Request Sent!</h3>
                <p className="text-[#a1a1aa]">We'll get back to you within a few hours to arrange the repair.</p>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitStatus === 'loading'}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Submit Repair Request →'}
              </button>
            )}

            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm mt-3 text-center">Something went wrong. Please try again.</p>
            )}
          </div>
        )}
      </div>

      {currentStep !== 'Submit' && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="border border-[#27272a] text-[#a1a1aa] hover:text-white disabled:opacity-30 px-6 py-3 rounded-xl transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={
              (currentStep === 'Device' && !device) ||
              (currentStep === 'Problem' && !problem) ||
              (currentStep === 'Details' && (!details.name || !details.email || !details.description))
            }
            className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-30 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}