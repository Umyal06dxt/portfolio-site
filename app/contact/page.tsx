'use client'

import { useState } from 'react'
import Link from 'next/link'

const SUBJECTS = [
  'Freelance Project',
  'Full-time Role',
  'Collaboration',
  'Just saying hi',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-xl mx-auto px-8 py-24">

        <div className="mb-12">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 text-sm font-[Manrope] tracking-widest uppercase transition-colors mb-8 inline-block"
          >
            ← orbit
          </Link>
          <h1 className="text-5xl font-[Syne] font-light text-white/90 mb-3" style={{ letterSpacing: '-0.02em' }}>
            Get in touch
          </h1>
          <p className="text-white/40 font-[Manrope] text-base">
            Creative Engineer · Delhi, IN · Open to Work
          </p>
        </div>

        {status === 'sent' ? (
          <div className="space-y-4">
            <p className="text-[#FF6B2B] font-[Manrope] text-lg">Transmission received.</p>
            <p className="text-white/50 font-[Manrope]">I&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-[Manrope] tracking-widest uppercase text-white/40">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-transparent border-b border-white/15 focus:border-[#FF6B2B] text-white/80 font-[Manrope] py-3 outline-none transition-colors duration-200 placeholder:text-white/20"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-[Manrope] tracking-widest uppercase text-white/40">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent border-b border-white/15 focus:border-[#FF6B2B] text-white/80 font-[Manrope] py-3 outline-none transition-colors duration-200 placeholder:text-white/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-[Manrope] tracking-widest uppercase text-white/40">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full bg-[#050505] border-b border-white/15 focus:border-[#FF6B2B] text-white/80 font-[Manrope] py-3 outline-none transition-colors duration-200"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-[Manrope] tracking-widest uppercase text-white/40">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-transparent border-b border-white/15 focus:border-[#FF6B2B] text-white/80 font-[Manrope] py-3 outline-none transition-colors duration-200 resize-none placeholder:text-white/20"
                placeholder="What's on your mind?"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 font-[Manrope] text-sm">Something went wrong. Try emailing hello@umyal.dev directly.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="border border-[#FF6B2B]/50 hover:border-[#FF6B2B] text-[#FF6B2B] hover:text-white px-8 py-3 font-[Manrope] text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-40"
            >
              {status === 'sending' ? 'Sending...' : 'Send →'}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
