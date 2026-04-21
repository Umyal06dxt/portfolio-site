'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { GalaxyScene } from '@/components/galaxy/scene'

export default function HomePage() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<{ color: string; visible: boolean }>({
    color: '#050505',
    visible: false,
  })

  const handlePlanetClick = useCallback((slug: string, bgColor: string) => {
    setOverlay({ color: bgColor, visible: true })
    setTimeout(() => router.push(`/projects/${slug}`), 800)
  }, [router])

  return (
    <main className="w-full h-screen bg-[#050505] overflow-hidden motion-canvas">
      <Canvas
        camera={{ position: [0, 0, 55], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#050505' }}
      >
        <ScrollControls pages={4} damping={0.25}>
          <GalaxyScene onPlanetClick={handlePlanetClick} />
        </ScrollControls>
      </Canvas>

      {/* Transition overlay — fades in on planet click, bridges to interior page */}
      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700"
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
