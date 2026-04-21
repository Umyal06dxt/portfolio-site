import Link from 'next/link'

export const metadata = { title: 'Blog — Umyal Dixit' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-8">
      <p className="text-xs font-[Manrope] tracking-widest uppercase text-white/30 mb-6">Blog</p>
      <h1 className="text-4xl font-[Syne] font-light text-white/70 mb-4 text-center">Coming in Phase 2</h1>
      <p className="text-white/30 font-[Manrope] text-base mb-12">Writing is in progress.</p>
      <Link href="/" className="text-white/40 hover:text-white/80 text-sm font-[Manrope] tracking-widest uppercase transition-colors">
        ← Back to universe
      </Link>
    </div>
  )
}
