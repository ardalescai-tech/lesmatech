'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Invalid email or password.')
        setLoading(false)
        return
      }
      router.push('/account')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setSuccess('Account created! Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,99,235,0.15),transparent)] rounded-2xl" />
        <div className="relative bg-[#0d0d1a] border border-[#1e1e3a] rounded-2xl p-8">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <h1 className="text-white font-bold text-2xl mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#a1a1aa] text-sm">
              {mode === 'login' ? 'Sign in to view your orders and account' : 'Track your orders and builds'}
            </p>
          </div>

          <div className="flex gap-1 p-1 bg-[#080818] border border-[#1e1e3a] rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'register' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-[#a1a1aa] text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080818] border border-[#1e1e3a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder-[#3f3f46]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#a1a1aa] text-xs mt-6">
            By continuing you agree to our{' '}
            <Link href="/terms" className="text-[#2563eb] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}