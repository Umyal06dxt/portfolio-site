'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { GalaxyScene } from '@/components/galaxy/scene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PLANETS } from '@/lib/planets'

export default function HomePage() {
  const router = useRouter()
  const { scrollY } = useScroll()
  const [isMobile, setIsMobile] = useState(false)
  const [overlay, setOverlay] = useState<{ color: string; visible: boolean }>({
    color: '#050505',
    visible: false,
  })

  // Hero fades out in first 300px of scroll
  const heroOpacity = useTransform(scrollY, [0, 280], [1, 0])
  const heroY = useTransform(scrollY, [0, 280], [0, -30])

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
    <>
      {/* ── Scroll height ───────────────────────────────────── */}
      {/* 400vh gives the camera a long, cinematic flight path  */}
      <div style={{ height: '400vh' }} aria-hidden="true" />

      {/* ── Fixed viewport ──────────────────────────────────── */}
      <div className="fixed inset-0 bg-[#050505]">

        {/* ── Mobile map view ─────────────────────────────── */}
        {isMobile && (
          <div className="absolute inset-0 bg-[#050505] text-white overflow-y-auto z-40">
            <div className="px-6 pt-16 pb-24">
              <div className="mb-12">
                <h1 className="font-[Syne] font-light text-white/90 mb-1" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
                  Umyal Dixit
                </h1>
                <p className="text-white/40 font-[Manrope] text-[11px] tracking-[0.2em] uppercase">
                  Creative Engineer · Delhi, IN
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {PLANETS.map(planet => (
                  <button
                    key={planet.id}
                    onClick={() => handlePlanetClick(planet.slug, planet.bgColor)}
                    className="text-left p-5 transition-all duration-200 active:opacity-60"
                    style={{
                      borderLeft: `2px solid ${planet.color}`,
                      background: `${planet.color}10`,
                    }}
                  >
                    <span className="font-[Syne] text-white/85 text-lg block mb-1">
                      {planet.name}
                    </span>
                    <p className="font-[Manrope] text-white/40 text-sm leading-relaxed">
                      {planet.tagline}
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex gap-6 mt-12">
                <a href="https://linkedin.com/in/umyaldixit" target="_blank" rel="noopener noreferrer"
                  className="text-white/40 font-[Manrope] text-[11px] tracking-widest uppercase">LinkedIn</a>
                <a href="https://x.com/umyaldixit" target="_blank" rel="noopener noreferrer"
                  className="text-white/40 font-[Manrope] text-[11px] tracking-widest uppercase">X</a>
                <a href="mailto:hello@umyal.dev"
                  className="text-white/40 font-[Manrope] text-[11px] tracking-widest uppercase">Email</a>
              </div>
            </div>
          </div>
        )}

        {/* ── 3D Canvas ─────────────────────────────────────── */}
        <Canvas
          camera={{ position: [0, 0.8, 75], fov: 60, near: 0.1, far: 300 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          style={{ position: 'absolute', inset: 0 }}
          className="motion-canvas"
        >
          <GalaxyScene onPlanetClick={handlePlanetClick} />
          <EffectComposer>
            <Bloom
              intensity={1.0}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.8}
              radius={0.7}
            />
          </EffectComposer>
        </Canvas>

        {/* ── Hero overlay ──────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Name + tagline — top left */}
          <div className="px-10 pt-12 md:px-14 md:pt-14">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="font-[Syne] font-light text-white leading-none mb-3"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.04em' }}
            >
              Umyal Dixit
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="font-[Manrope] text-white/45"
              style={{ fontSize: '0.78rem', letterSpacing: '0.22em' }}
            >
              CREATIVE ENGINEER &nbsp;·&nbsp; FLUID INTERFACES &amp; AI AGENTS &nbsp;·&nbsp; DELHI, IN
            </motion.p>
          </div>

          {/* Scroll prompt — bottom center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.0 }}
            className="pb-10 flex flex-col items-center gap-3"
          >
            <div
              className="w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"
              style={{ height: '48px', animation: 'scrollPulse 2.2s ease-in-out infinite' }}
            />
            <p className="font-[Manrope] text-white/25 text-[10px] tracking-[0.3em] uppercase">
              Scroll
            </p>
          </motion.div>
        </motion.div>

        {/* ── HUD ───────────────────────────────────────────── */}
        <div className="absolute bottom-7 left-10 z-20 pointer-events-none">
          <p className="font-[Manrope] text-white/35" style={{ fontSize: '11px', letterSpacing: '0.07em' }}>
            Delhi, IN &nbsp;·&nbsp; Open to Work
          </p>
        </div>
        <div className="absolute bottom-7 right-10 z-20 flex items-center gap-6">
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com/in/umyaldixit', ext: true },
            { label: 'X', href: 'https://x.com/umyaldixit', ext: true },
            { label: 'Email', href: 'mailto:hello@umyal.dev', ext: false },
          ].map(({ label, href, ext }) => (
            <a key={label} href={href}
              {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="font-[Manrope] text-white/40 hover:text-white/85 transition-colors duration-300"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ── Reduced-motion fallback ───────────────────────── */}
        <div className="motion-fallback hidden absolute inset-0 bg-[#050505] text-white overflow-y-auto z-30">
          <div className="max-w-2xl mx-auto px-8 py-24 space-y-12">
            <div>
              <h1 className="font-[Syne] font-light text-white/90 mb-2"
                style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}>
                Umyal Dixit
              </h1>
              <p className="text-white/40 font-[Manrope] text-xs tracking-widest uppercase">
                Creative Engineer · Delhi, IN · Open to Work
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {PLANETS.map(p => (
                <a key={p.id} href={`/projects/${p.slug}`}
                  className="border border-white/10 hover:border-white/25 p-6 transition-colors duration-200 group">
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
          </div>
        </div>

        {/* ── Transition overlay ────────────────────────────── */}
        <div
          className={`absolute inset-0 z-50 transition-opacity duration-700 ${overlay.visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ backgroundColor: overlay.color, opacity: overlay.visible ? 1 : 0 }}
        />

        {/* ── No-JS fallback ────────────────────────────────── */}
        <noscript>
          <div className="absolute inset-0 bg-[#050505] text-white p-8 overflow-y-auto">
            <h1 className="text-2xl font-display mb-2">Umyal Dixit</h1>
            <p className="text-white/60 mb-8">Creative Engineer · Delhi, IN</p>
            <ul className="space-y-4">
              {PLANETS.map(p => (
                <li key={p.id}><a href={`/projects/${p.slug}`} className="underline">{p.name}</a></li>
              ))}
            </ul>
          </div>
        </noscript>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.15; transform: scaleY(0.4); }
          50% { opacity: 0.6; transform: scaleY(1.0); }
        }
        .motion-canvas { display: block; }
        @media (prefers-reduced-motion: reduce) {
          .motion-canvas { display: none; }
          .motion-fallback { display: block !important; }
        }
      `}</style>
    </>
  )
}
