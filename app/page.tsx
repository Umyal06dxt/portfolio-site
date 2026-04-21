'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { GalaxyScene } from '@/components/galaxy/scene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { PLANETS } from '@/lib/planets'

export default function HomePage() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<{ color: string; visible: boolean }>({
    color: '#050505',
    visible: false,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fade out hero text when user starts scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handlePlanetClick = useCallback((slug: string, bgColor: string) => {
    setOverlay({ color: bgColor, visible: true })
    setTimeout(() => router.push(`/projects/${slug}`), 800)
  }, [router])

  return (
    <main className="w-full h-screen bg-[#050505] overflow-hidden motion-canvas" style={{ position: 'relative' }}>

      {/* ── Mobile map view ─────────────────────────────────── */}
      {isMobile && (
        <div className="fixed inset-0 bg-[#050505] text-white overflow-y-auto z-40">
          <div className="px-6 pt-16 pb-24">
            <div className="mb-12">
              <h1 className="text-3xl font-[Syne] font-light text-white/90 mb-1">Umyal Dixit</h1>
              <p className="text-white/40 font-[Manrope] text-xs tracking-[0.2em] uppercase">Creative Engineer · Delhi, IN</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {PLANETS.map(planet => (
                <button
                  key={planet.id}
                  onClick={() => handlePlanetClick(planet.slug, planet.bgColor)}
                  className="text-left p-5 transition-all duration-200 active:opacity-70"
                  style={{ borderLeft: `2px solid ${planet.color}`, background: `${planet.color}08` }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-[Syne] text-white/85 text-lg">{planet.name}</span>
                  </div>
                  <p className="font-[Manrope] text-white/40 text-sm leading-relaxed">{planet.tagline}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-6 mt-12">
              <a href="https://linkedin.com/in/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/40 font-[Manrope] text-xs tracking-widest uppercase">LinkedIn</a>
              <a href="https://x.com/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/40 font-[Manrope] text-xs tracking-widest uppercase">X</a>
              <a href="mailto:hello@umyal.dev" className="text-white/40 font-[Manrope] text-xs tracking-widest uppercase">Email</a>
            </div>
          </div>
        </div>
      )}

      {/* ── 3D Canvas ───────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ScrollControls pages={2} damping={0.3}>
          <GalaxyScene onPlanetClick={handlePlanetClick} />
        </ScrollControls>
        <EffectComposer>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.7}
            radius={0.9}
          />
        </EffectComposer>
      </Canvas>

      {/* ── Hero text ───────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-10 flex flex-col justify-between pointer-events-none"
        style={{
          opacity: scrolled ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Name — top left */}
        <div className="px-8 pt-10 md:px-12 md:pt-12">
          <h1
            className="font-[Syne] text-white leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
            }}
          >
            Umyal Dixit
          </h1>
          <p
            className="font-[Manrope] text-white/50 mt-2"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', letterSpacing: '0.22em' }}
          >
            CREATIVE ENGINEER &nbsp;·&nbsp; FLUID INTERFACES &amp; AI AGENTS
          </p>
        </div>

        {/* Scroll hint — bottom center */}
        <div className="pb-10 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-px bg-white/20"
              style={{
                height: '40px',
                animation: 'scrollline 2s ease-in-out infinite',
              }}
            />
            <p className="font-[Manrope] text-white/25 text-[10px] tracking-[0.25em] uppercase">Scroll</p>
          </div>
        </div>
      </div>

      {/* ── Bottom HUD ──────────────────────────────────────── */}
      <div className="fixed bottom-7 left-8 z-20 pointer-events-none">
        <p className="text-white/40 font-[Manrope]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
          Delhi, IN · Open to Work
        </p>
      </div>
      <div className="fixed bottom-7 right-8 z-20 flex items-center gap-5">
        {[
          { label: 'LinkedIn', href: 'https://linkedin.com/in/umyaldixit', external: true },
          { label: 'X', href: 'https://x.com/umyaldixit', external: true },
          { label: 'Email', href: 'mailto:hello@umyal.dev', external: false },
        ].map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="text-white/40 hover:text-white/90 font-[Manrope] transition-colors duration-300"
            style={{ fontSize: '11px', letterSpacing: '0.15em' }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* ── Reduced-motion fallback ─────────────────────────── */}
      <div className="motion-fallback hidden fixed inset-0 bg-[#050505] text-white overflow-y-auto z-30">
        <div className="max-w-2xl mx-auto px-8 py-24 space-y-12">
          <div>
            <h1 className="text-4xl font-[Syne] font-light text-white/90 mb-2" style={{ letterSpacing: '-0.02em' }}>
              Umyal Dixit
            </h1>
            <p className="text-white/40 font-[Manrope] text-sm tracking-widest uppercase">
              Creative Engineer · Delhi, IN · Open to Work
            </p>
            <p className="text-white/50 font-[Manrope] mt-2">Fluid Interfaces &amp; AI Agents</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {PLANETS.map(p => (
              <a
                key={p.href}
                href={`/projects/${p.slug}`}
                className="border border-white/10 hover:border-white/25 p-6 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-[Syne] text-white/80 text-xl mb-1">{p.name}</h2>
                    <p className="font-[Manrope] text-white/40 text-sm">{p.tagline}</p>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
          <div className="flex gap-6 pt-4">
            <a href="https://linkedin.com/in/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 font-[Manrope] text-xs tracking-widest uppercase transition-colors">LinkedIn</a>
            <a href="https://x.com/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 font-[Manrope] text-xs tracking-widest uppercase transition-colors">X</a>
            <a href="mailto:hello@umyal.dev" className="text-white/30 hover:text-white/70 font-[Manrope] text-xs tracking-widest uppercase transition-colors">Email</a>
          </div>
        </div>
      </div>

      {/* ── Transition overlay ──────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-700 ${overlay.visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ backgroundColor: overlay.color, opacity: overlay.visible ? 1 : 0 }}
      />

      {/* ── No-JS fallback ──────────────────────────────────── */}
      <noscript>
        <div className="fixed inset-0 bg-[#050505] text-white p-8 overflow-y-auto">
          <h1 className="text-2xl font-display mb-2">Umyal Dixit</h1>
          <p className="text-white/60 mb-8">Creative Engineer · Delhi, IN</p>
          <ul className="space-y-4">
            <li><a href="/projects/sukku" className="underline">Sukku — AI Companion System</a></li>
            <li><a href="/projects/emotion-ai" className="underline">Emotion AI — Multimodal Emotion Recognition</a></li>
            <li><a href="/projects/genco" className="underline">Genco — Anonymous Chat</a></li>
            <li><a href="/projects/ai-learning" className="underline">AI Learning — Real-time Tutors</a></li>
            <li><a href="/projects/design-system" className="underline">Design System</a></li>
          </ul>
        </div>
      </noscript>

      <style>{`
        @keyframes scrollline {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
        }
      `}</style>
    </main>
  )
}
