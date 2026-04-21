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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handlePlanetClick = useCallback((slug: string, bgColor: string) => {
    setOverlay({ color: bgColor, visible: true })
    setTimeout(() => router.push(`/projects/${slug}`), 800)
  }, [router])

  return (
    <main className="w-full h-screen bg-[#050505] overflow-hidden motion-canvas">
      {/* Mobile map view — shown on viewports < 768px */}
      {isMobile && (
        <div className="fixed inset-0 bg-[#050505] text-white overflow-y-auto z-40">
          <div className="px-6 pt-16 pb-24">
            <div className="mb-12">
              <h1 className="text-3xl font-[Syne] font-light text-white/90 mb-1">Umyal Dixit</h1>
              <p className="text-white/40 font-[Manrope] text-xs tracking-widest uppercase">Creative Engineer · Delhi, IN</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {PLANETS.map(planet => (
                <button
                  key={planet.id}
                  onClick={() => handlePlanetClick(planet.slug, planet.bgColor)}
                  className="text-left border border-white/8 active:border-white/20 p-5 transition-colors duration-150"
                  style={{ borderLeftColor: planet.color, borderLeftWidth: '2px' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: planet.color, boxShadow: `0 0 8px ${planet.glowColor}` }}
                    />
                    <span className="font-[Syne] text-white/80 text-lg">{planet.name}</span>
                  </div>
                  <p className="font-[Manrope] text-white/40 text-sm leading-relaxed pl-6">{planet.tagline}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-6 mt-12">
              <a href="https://linkedin.com/in/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/30 font-[Manrope] text-xs tracking-widest uppercase">LinkedIn</a>
              <a href="https://x.com/umyaldixit" target="_blank" rel="noopener noreferrer" className="text-white/30 font-[Manrope] text-xs tracking-widest uppercase">X</a>
              <a href="mailto:hello@umyal.dev" className="text-white/30 font-[Manrope] text-xs tracking-widest uppercase">Email</a>
            </div>
          </div>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#050505' }}
      >
        <ScrollControls pages={2} damping={0.3}>
          <GalaxyScene onPlanetClick={handlePlanetClick} />
        </ScrollControls>
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>

      {/* Hero intro text — visible on arrival, fades as user scrolls */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center" style={{ marginTop: '-120px' }}>
        <h1 className="text-6xl md:text-7xl font-[Syne] font-light text-white/90 mb-3" style={{ letterSpacing: '-0.03em' }}>
          Umyal Dixit
        </h1>
        <p className="text-sm font-[Manrope] tracking-[0.25em] uppercase text-white/50">
          Creative Engineer · Fluid Interfaces & AI Agents
        </p>
        <p className="text-xs font-[Manrope] tracking-widest uppercase text-white/25 mt-2">
          Scroll to explore
        </p>
      </div>

      {/* HUD — identity text */}
      <div className="fixed bottom-6 left-8 z-20 pointer-events-none">
        <p className="text-white/60 text-[12px] font-[Manrope] tracking-wider">
          Delhi, IN · Open to Work
        </p>
      </div>

      {/* HUD — social links */}
      <div className="fixed bottom-6 right-8 z-20 flex items-center gap-4">
        <a
          href="https://linkedin.com/in/umyaldixit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white/90 text-[12px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/umyaldixit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white/90 text-[12px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          X
        </a>
        <a
          href="mailto:hello@umyal.dev"
          className="text-white/50 hover:text-white/90 text-[12px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          Email
        </a>
      </div>

      {/* Reduced-motion static fallback — hidden by default, shown via CSS media query */}
      <div className="motion-fallback hidden fixed inset-0 bg-[#050505] text-white overflow-y-auto">
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
            {[
              { href: '/projects/sukku', name: 'Sukku', tagline: 'AI Companion System', color: '#FF6B2B' },
              { href: '/projects/emotion-ai', name: 'Emotion AI', tagline: 'Multimodal Emotion Recognition', color: '#4A90E2' },
              { href: '/projects/genco', name: 'Genco', tagline: 'Anonymous Chat', color: '#4ECDC4' },
              { href: '/projects/ai-learning', name: 'AI Learning', tagline: 'Real-time Tutors', color: '#FFD166' },
              { href: '/projects/design-system', name: 'Design System', tagline: 'Component System', color: '#E8E8E8' },
            ].map(p => (
              <a
                key={p.href}
                href={p.href}
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

      {/* Transition overlay — fades in on planet click, bridges to interior page */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-700 ${overlay.visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          backgroundColor: overlay.color,
          opacity: overlay.visible ? 1 : 0,
        }}
      />

      {/* No-JS fallback */}
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
    </main>
  )
}
