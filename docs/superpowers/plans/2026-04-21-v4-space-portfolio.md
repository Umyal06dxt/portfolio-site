# Portfolio v4 — Space Universe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing terminal/cyberpunk portfolio with a scroll-driven 3D space universe where each project is a planet, navigation is a cinematic zoom, and the visitor feels like a pilot — not a browser.

**Architecture:** Full-screen R3F canvas on `/` uses `<ScrollControls>` for camera flight through a galaxy of planets. Clicking a planet triggers a camera zoom + full-screen color overlay + `router.push('/projects/[slug]')`. Planet interiors are clean Next.js pages that fade in from the planet's background color. Exit reverses the sequence.

**Tech Stack:** Next.js 16 App Router · React Three Fiber v9 · `@react-three/drei` · `@react-three/postprocessing` · Three.js v0.182 · Framer Motion v12 · Tailwind v4 · TypeScript

**Testing approach:** Pure utility functions tested with Vitest. Visual R3F components verified by running `pnpm dev` and checking in browser — automated tests on WebGL rendering are not practical.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `lib/planets.ts` | Planet config data — single source of truth for all planet properties |
| `lib/easing.ts` | Easing utility functions used in transition animations |
| `components/galaxy/scene.tsx` | R3F scene root: camera rig, scroll flight, planet click handler |
| `components/galaxy/planet.tsx` | Individual planet mesh + glow sphere + hover label |
| `components/galaxy/ufo.tsx` | UFO procedural mesh + mouse parallax |
| `components/galaxy/star-field.tsx` | Drei Stars wrapper with config |
| `components/galaxy/zoom-transition.tsx` | Camera zoom state logic used inside scene |
| `components/planet-interior/layout.tsx` | Shared interior page wrapper: fade-in, exit button |
| `components/ui/coming-soon.tsx` | Shared "coming soon" stub for Phase 2 pages |
| `app/projects/sukku/page.tsx` | Sukku planet interior — full content |
| `app/projects/emotion-ai/page.tsx` | Emotion AI planet interior — full content |
| `app/projects/genco/page.tsx` | Genco stub |
| `app/projects/ai-learning/page.tsx` | AI Learning stub |
| `app/projects/design-system/page.tsx` | Design System stub |

### Modified files
| File | What changes |
|---|---|
| `app/page.tsx` | REPLACED: becomes R3F canvas host + transition overlay |
| `app/globals.css` | REPLACED: space palette, remove all cyberpunk utilities |
| `app/layout.tsx` | Updated metadata only |
| `app/about/page.tsx` | REPLACED: coming soon stub |
| `app/blog/page.tsx` | REPLACED: coming soon stub |
| `app/gallery/page.tsx` | REPLACED: coming soon stub |
| `app/contact/page.tsx` | Restyled — Resend API untouched |

### Untouched files
- `app/api/contact/route.ts` — do not touch
- `app/layout.tsx` font setup — keep Syne + Manrope

---

## Task 1: Install dependencies and replace CSS palette

**Files:**
- Modify: `package.json` (via pnpm)
- Modify: `app/globals.css`

- [ ] **Step 1: Install new dependencies**

```bash
cd /home/umyaldixit/Desktop/projects/portfolio-site
pnpm add @react-three/drei @react-three/postprocessing
```

If peer dependency errors appear, run:
```bash
pnpm add @react-three/drei @react-three/postprocessing --legacy-peer-deps
```

Expected output: `Done` with packages added to `node_modules/`.

- [ ] **Step 2: Verify R3F imports compile**

```bash
node -e "require('./node_modules/@react-three/drei/index.cjs')" 2>&1 | head -5
```

Expected: no error, or a warning about browser environment (normal for Node).

- [ ] **Step 3: Replace globals.css**

Replace the entire contents of `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Manrope", sans-serif;
  --font-display: "Syne", sans-serif;
  --color-space: #050505;
  --color-orange: #FF6B2B;
  --color-orange-glow: #FF8C42;
}

:root {
  --background: #050505;
  --foreground: #ffffff;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}

/* Canvas fills the viewport without scroll bars */
canvas {
  display: block;
}

/* Reduced motion: hide canvas, show static fallback */
@media (prefers-reduced-motion: reduce) {
  .motion-canvas {
    display: none;
  }
  .motion-fallback {
    display: block !important;
  }
}
```

- [ ] **Step 4: Update layout.tsx metadata**

Replace only the `metadata` export in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Umyal Dixit | Creative Engineer",
  description: "Portfolio of Umyal Dixit — Fluid Interfaces & AI Agents. Delhi, IN.",
  openGraph: {
    title: "Umyal Dixit | Creative Engineer",
    description: "Fluid Interfaces & AI Agents",
  },
};
```

Also update the `selection` color in the body className from `selection:bg-[#E85002]` to `selection:bg-[#FF6B2B]`.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx package.json pnpm-lock.yaml
git commit -m "feat: install drei + postprocessing, replace CSS with space palette"
```

---

## Task 2: Planet data layer

**Files:**
- Create: `lib/planets.ts`
- Create: `lib/easing.ts`

- [ ] **Step 1: Create `lib/planets.ts`**

```ts
export type Planet = {
  id: string
  name: string
  slug: string
  color: string
  glowColor: string
  bgColor: string
  tagline: string
  size: number
  // World-space position: [x, y, z]
  // Z-axis is the flight path. Sukku is at z=0 (closest to camera at max scroll).
  // Higher Z = further from camera at start, encountered first during scroll.
  position: [number, number, number]
}

export const PLANETS: Planet[] = [
  {
    id: 'sukku',
    name: 'Sukku',
    slug: 'sukku',
    color: '#FF6B2B',
    glowColor: '#FF8C42',
    bgColor: '#1A0A00',
    tagline: "An AI that doesn't just respond — it understands, remembers, and lives alongside you.",
    size: 1.8,
    position: [0, 0, 0],
  },
  {
    id: 'emotion-ai',
    name: 'Emotion AI',
    slug: 'emotion-ai',
    color: '#4A90E2',
    glowColor: '#6A3DE8',
    bgColor: '#060D1A',
    tagline: 'Multimodal emotion recognition — video, audio, text — at 98% accuracy.',
    size: 1.3,
    position: [-4, 0.5, 10],
  },
  {
    id: 'genco',
    name: 'Genco',
    slug: 'genco',
    color: '#4ECDC4',
    glowColor: '#45B7D1',
    bgColor: '#051A18',
    tagline: 'Anonymous chat for real conversations.',
    size: 1.0,
    position: [5, -0.5, 18],
  },
  {
    id: 'ai-learning',
    name: 'AI Learning',
    slug: 'ai-learning',
    color: '#FFD166',
    glowColor: '#FFAA33',
    bgColor: '#1A1400',
    tagline: 'Real-time AI tutors that adapt to every learner.',
    size: 0.9,
    position: [-3, 1.0, 26],
  },
  {
    id: 'design-system',
    name: 'Design System',
    slug: 'design-system',
    color: '#E8E8E8',
    glowColor: '#AAAAAA',
    bgColor: '#0A0A0A',
    tagline: 'A precise, minimal component system.',
    size: 0.8,
    position: [4, -1.0, 34],
  },
]

// Camera Z range: starts at 55, ends at 4 (just in front of Sukku at z=0)
export const CAMERA_START_Z = 55
export const CAMERA_END_Z = 4
```

- [ ] **Step 2: Create `lib/easing.ts`**

```ts
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}
```

- [ ] **Step 3: Verify the data makes sense**

Run in the terminal:
```bash
node -e "
const { PLANETS, CAMERA_START_Z, CAMERA_END_Z } = require('./lib/planets.ts')
" 2>&1 | head -3
```

This will error (TS file) — that's expected. Instead, check the data visually: open `lib/planets.ts` and confirm Sukku is at `position: [0,0,0]` (deepest) and Design System is at the highest Z (34, encountered first in flight). The camera travels from Z=55 to Z=4, so all planets are between those values. ✓

- [ ] **Step 4: Commit**

```bash
git add lib/planets.ts lib/easing.ts
git commit -m "feat: add planet data layer and easing utilities"
```

---

## Task 3: Basic R3F canvas with Sukku planet only

This is the foundation. One planet, one scene, no scroll, no UFO. Verify it renders before adding anything else.

**Files:**
- Create: `components/galaxy/planet.tsx`
- Create: `components/galaxy/scene.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/galaxy/planet.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@/lib/planets'

type Props = {
  planet: PlanetType
  onClick: () => void
}

export function Planet({ planet, onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.0008) * 0.04
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={planet.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={hovered ? 0.25 : 0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.5 : 0.25}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html
          center
          position={[0, -(planet.size + 0.4), 0]}
          style={{ pointerEvents: 'none' }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '11px',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            {planet.name}
          </p>
        </Html>
      )}
    </group>
  )
}
```

- [ ] **Step 2: Create `components/galaxy/scene.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { Planet } from './planet'
import { PLANETS, CAMERA_START_Z, CAMERA_END_Z } from '@/lib/planets'
import type { Planet as PlanetType } from '@/lib/planets'
import { easeInOutCubic } from '@/lib/easing'

type ZoomState = {
  active: boolean
  target: PlanetType | null
  progress: number
  startZ: number
}

type Props = {
  onPlanetClick: (slug: string, bgColor: string) => void
}

export function GalaxyScene({ onPlanetClick }: Props) {
  const { camera } = useThree()
  const scroll = useScroll()
  const zoom = useRef<ZoomState>({
    active: false,
    target: null,
    progress: 0,
    startZ: CAMERA_START_Z,
  })
  const notified = useRef(false)

  useFrame((_, delta) => {
    if (zoom.current.active && zoom.current.target) {
      zoom.current.progress = Math.min(1, zoom.current.progress + delta * 1.1)
      const t = easeInOutCubic(zoom.current.progress)
      const targetZ = zoom.current.target.position[2] + 3
      camera.position.z = zoom.current.startZ + (targetZ - zoom.current.startZ) * t
      camera.position.x += (zoom.current.target.position[0] - camera.position.x) * t * 0.3
      camera.position.y += (zoom.current.target.position[1] - camera.position.y) * t * 0.3
    } else {
      // Scroll-driven flight
      const range = CAMERA_START_Z - CAMERA_END_Z
      camera.position.z = CAMERA_START_Z - scroll.offset * range
    }
  })

  const handlePlanetClick = (planet: PlanetType) => {
    zoom.current = {
      active: true,
      target: planet,
      progress: 0,
      startZ: camera.position.z,
    }
    notified.current = false
    onPlanetClick(planet.slug, planet.bgColor)
  }

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[10, 10, 20]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-10, -5, 10]} intensity={0.4} color="#FF6B2B" />

      {PLANETS.map(planet => (
        <Planet
          key={planet.id}
          planet={planet}
          onClick={() => handlePlanetClick(planet)}
        />
      ))}
    </>
  )
}
```

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify it runs**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: dark page, Sukku (orange sphere) visible, other planets appear as you approach. No console errors about missing modules.

If you see `Module not found: @react-three/drei` — stop server, re-run `pnpm add @react-three/drei`.

- [ ] **Step 5: Commit**

```bash
git add components/galaxy/planet.tsx components/galaxy/scene.tsx app/page.tsx
git commit -m "feat: basic R3F galaxy scene with 5 planets and scroll flight"
```

---

## Task 4: Sukku planet interior page

This is the first half of the signature interaction. Build the destination before the zoom.

**Files:**
- Create: `components/planet-interior/layout.tsx`
- Create: `app/projects/sukku/page.tsx`

- [ ] **Step 1: Create `components/planet-interior/layout.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
  bgColor: string
  planetName: string
}

export function PlanetInteriorLayout({ children, bgColor, planetName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      style={{ backgroundColor: bgColor, minHeight: '100vh' }}
      className="text-white"
    >
      {/* Navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-white/50 hover:text-white/90 text-sm font-[Manrope] tracking-widest uppercase transition-colors duration-200"
        >
          ← orbit
        </Link>
        <span className="text-white/30 text-xs font-[Manrope] tracking-widest uppercase">
          {planetName}
        </span>
      </div>

      {/* Content */}
      <div className="pt-24 pb-24">
        {children}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `app/projects/sukku/page.tsx`**

```tsx
import { PlanetInteriorLayout } from '@/components/planet-interior/layout'

export const metadata = {
  title: 'Sukku — Umyal Dixit',
  description: "An AI that doesn't just respond — it understands, remembers, and lives alongside you.",
}

export default function SukkuPage() {
  return (
    <PlanetInteriorLayout bgColor="#1A0A00" planetName="Sukku">
      <div className="max-w-2xl mx-auto px-8 space-y-20">

        {/* Hero statement */}
        <section>
          <h1
            className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
            style={{ letterSpacing: '-0.02em' }}
          >
            An AI that doesn&apos;t just respond — it understands, remembers, and lives alongside you.
          </h1>
        </section>

        {/* What it is */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            What it is
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Sukku is a hybrid AI companion system — not an assistant, not a chatbot.
            It combines emotional intelligence, real-world awareness, persistent memory, and
            proactive assistance into something closer to a presence than a product.
          </p>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Where most AI reacts to commands, Sukku observes, understands context, and initiates.
            It knows how you feel. It remembers your life. It acts before you ask.
          </p>
        </section>

        {/* Why I built it */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            Why I built it
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Every AI tool I used felt like using a calculator — powerful but cold, reactive but blind.
            I wanted to build the thing I actually wanted to exist: a system that extends human
            cognition without requiring you to operate it like software.
          </p>
        </section>

        {/* Technical depth */}
        <section className="space-y-6">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            What&apos;s technically interesting
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Multimodal input</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Sukku reads facial expressions, voice tone, and environmental context simultaneously.
                Built on the same emotion recognition pipeline as Emotion AI.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Memory architecture</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Long-term episodic memory with user-controlled recall. &ldquo;Sukku, remember this moment&rdquo;
                stores it semantically — retrievable by emotion, context, or time.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Hybrid privacy model</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Sensitive data stays local. Heavy inference routes to cloud only when necessary.
                Privacy is not a setting — it&apos;s the default architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            Status
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Software is complete and running. Hardware — the embodied form that lets Sukku
            follow, interact, and exist physically — is in development.
            The mind is built. The body is catching up.
          </p>
        </section>

        {/* CTA */}
        <section className="pt-4">
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[#FF6B2B]/40 hover:border-[#FF6B2B] text-[#FF6B2B] hover:text-white px-6 py-3 font-[Manrope] text-sm tracking-widest uppercase transition-all duration-300"
          >
            View on GitHub →
          </a>
        </section>

      </div>
    </PlanetInteriorLayout>
  )
}
```

- [ ] **Step 3: Verify the interior page loads**

With `pnpm dev` running, navigate directly to `http://localhost:3000/projects/sukku`.

Expected: dark amber background (`#1A0A00`), large Syne heading, "← orbit" top-left, content sections with orange accent lines. No layout errors.

- [ ] **Step 4: Commit**

```bash
git add components/planet-interior/layout.tsx app/projects/sukku/page.tsx
git commit -m "feat: Sukku planet interior with full content"
```

---

## Task 5: Wire the signature transition end-to-end

The zoom animation is already partially in `scene.tsx` (camera moves toward planet on click). This task adds the overlay and tests the full click → zoom → interior → back flow.

**Files:**
- Modify: `app/page.tsx` (add reduced-motion guard + verify overlay timing)

- [ ] **Step 1: Test the full transition**

With `pnpm dev` running:
1. Open `http://localhost:3000`
2. Scroll until Sukku (orange planet) is large on screen
3. Click Sukku
4. Expected sequence:
   - Camera accelerates toward Sukku (zoom starts)
   - After ~800ms, page transitions to `/projects/sukku`
   - Interior fades in from dark amber
5. On the interior page, click "← orbit"
6. Expected: navigates back to `/` (galaxy)

If the overlay doesn't cover the transition cleanly (you see a flash of white/Next.js default), adjust the timing in `app/page.tsx`:

Change `setTimeout(() => router.push(...), 800)` — if the overlay reaches full opacity before page loads, try `700`. If you see the canvas during transition, try `900`.

- [ ] **Step 2: Add entrance animation stagger to interior**

In `components/planet-interior/layout.tsx`, wrap `children` in a second motion div for content stagger:

```tsx
{/* Content — staggered entrance after background fades in */}
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
>
  <div className="pt-24 pb-24">
    {children}
  </div>
</motion.div>
```

Remove the plain `<div className="pt-24 pb-24">` and replace with the motion div above. Keep the fixed nav bar outside this wrapper.

Full updated `components/planet-interior/layout.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
  bgColor: string
  planetName: string
}

export function PlanetInteriorLayout({ children, bgColor, planetName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      style={{ backgroundColor: bgColor, minHeight: '100vh' }}
      className="text-white"
    >
      {/* Fixed navigation */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-white/50 hover:text-white/90 text-sm font-[Manrope] tracking-widest uppercase transition-colors duration-200"
        >
          ← orbit
        </Link>
        <span className="text-white/30 text-xs font-[Manrope] tracking-widest uppercase">
          {planetName}
        </span>
      </div>

      {/* Content with staggered entrance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <div className="pt-24 pb-24">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Verify transition quality**

Check these specific things in the browser:
1. The zoom feels cinematic — camera accelerates smoothly, not linearly
2. The overlay color matches the planet's bgColor (dark amber for Sukku, not black)
3. The interior content doesn't flash in instantly — it fades after the overlay
4. "← orbit" returns to the galaxy

- [ ] **Step 4: Commit**

```bash
git add components/planet-interior/layout.tsx
git commit -m "feat: complete signature zoom transition — galaxy to planet interior"
```

---

## Task 6: UFO mesh + mouse parallax

**Files:**
- Create: `components/galaxy/ufo.tsx`
- Modify: `components/galaxy/scene.tsx`

- [ ] **Step 1: Create `components/galaxy/ufo.tsx`**

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Ufo() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  // Track mouse position — use useEffect so the listener is added once and cleaned up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Lerp rotation toward mouse (max ±8 degrees)
    const maxRot = 0.14 // ~8 degrees in radians
    targetRotation.current.x += (mouse.current.y * maxRot - targetRotation.current.x) * 4 * delta
    targetRotation.current.y += (mouse.current.x * maxRot - targetRotation.current.y) * 4 * delta

    groupRef.current.rotation.x = targetRotation.current.x
    groupRef.current.rotation.y = targetRotation.current.y

    // Idle vertical bob
    groupRef.current.position.y = -1.8 + Math.sin(Date.now() * 0.0008) * 0.08
  })

  return (
    // Fixed in screen-space: positioned below center, forward of camera
    <group ref={groupRef} position={[0, -1.8, 48]}>
      {/* Disc body */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.1} metalness={0.9} transparent opacity={0.9} />
      </mesh>

      {/* Rim light ring — orange glow */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.48, 0.025, 8, 32]} />
        <meshBasicMaterial color="#FF6B2B" />
      </mesh>

      {/* Left fin */}
      <mesh position={[-0.6, -0.03, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.2, 0.04, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Right fin */}
      <mesh position={[0.6, -0.03, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.2, 0.04, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Add Ufo to scene**

In `components/galaxy/scene.tsx`, add the import and render the UFO inside the return:

```tsx
import { Ufo } from './ufo'
```

Add `<Ufo />` after the planets in the JSX return, before the closing `</>`:

```tsx
      {PLANETS.map(planet => (
        <Planet
          key={planet.id}
          planet={planet}
          onClick={() => handlePlanetClick(planet)}
        />
      ))}
      <Ufo />
    </>
```

- [ ] **Step 3: Verify UFO in browser**

Open `http://localhost:3000`. Expected:
- Small dark disc with orange rim visible at the bottom-center of viewport
- Moving the mouse causes the UFO to tilt gently in that direction
- UFO bobs slowly up and down
- UFO does not move across the screen — it stays in place

- [ ] **Step 4: Commit**

```bash
git add components/galaxy/ufo.tsx components/galaxy/scene.tsx
git commit -m "feat: UFO mesh with mouse parallax and idle bob"
```

---

## Task 7: Star field + ambient glow

**Files:**
- Create: `components/galaxy/star-field.tsx`
- Modify: `components/galaxy/scene.tsx`

- [ ] **Step 1: Create `components/galaxy/star-field.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

export function StarField() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.005
      groupRef.current.rotation.x += delta * 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {/* Far star layer — slow, dense */}
      <Stars
        radius={150}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0}
      />
      {/* Near star layer — slightly brighter */}
      <Stars
        radius={80}
        depth={30}
        count={800}
        factor={2}
        saturation={0.1}
        fade
        speed={0}
      />
    </group>
  )
}
```

- [ ] **Step 2: Add StarField to scene**

In `components/galaxy/scene.tsx`:

```tsx
import { StarField } from './star-field'
```

Add `<StarField />` as the first child in the return JSX (renders behind planets):

```tsx
  return (
    <>
      <StarField />
      <ambientLight intensity={0.05} />
      ...
```

- [ ] **Step 3: Verify star field in browser**

Open `http://localhost:3000`. Expected:
- Stars visible across the viewport — not clustered, spread naturally
- Stars have a very slow rotation that creates the sensation of drifting in space
- Stars don't flicker or jump

- [ ] **Step 4: Commit**

```bash
git add components/galaxy/star-field.tsx components/galaxy/scene.tsx
git commit -m "feat: dual-layer star field with slow ambient rotation"
```

---

## Task 8: Bloom postprocessing for planet glow

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add Bloom to the Canvas**

In `app/page.tsx`, add the postprocessing import and wrap the canvas content:

```tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
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
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>

      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700"
        style={{
          backgroundColor: overlay.color,
          opacity: overlay.visible ? 1 : 0,
        }}
      />

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
```

- [ ] **Step 2: Verify bloom in browser**

Open `http://localhost:3000`. Expected:
- Planets have a soft halo of light around them — not a sharp outline, a diffuse glow
- The orange planet (Sukku) glows warmest
- Stars are not bloomed (they're below the luminance threshold)
- No performance drop — canvas stays smooth

If bloom causes a significant FPS drop on the dev machine, reduce `intensity` to `0.5`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add bloom postprocessing for planet glow"
```

---

## Task 9: HUD elements — identity text + social links

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add HUD overlay to page.tsx**

The HUD sits on top of the canvas as fixed HTML — not inside R3F. Add it between the Canvas and the overlay div:

```tsx
      {/* HUD — identity + social links */}
      <div className="fixed bottom-6 left-8 z-20 pointer-events-none">
        <p
          className="text-white/35 text-[11px] font-[Manrope] tracking-wider"
          style={{ letterSpacing: '0.06em' }}
        >
          Umyal Dixit · Creative Engineer · Delhi, IN · Open to Work
        </p>
      </div>

      <div className="fixed bottom-6 right-8 z-20 flex items-center gap-4">
        <a
          href="https://linkedin.com/in/umyaldixit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-white/80 text-[11px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          Li
        </a>
        <a
          href="https://x.com/umyaldixit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-white/80 text-[11px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          X
        </a>
        <a
          href="mailto:hello@umyal.dev"
          className="text-white/30 hover:text-white/80 text-[11px] font-[Manrope] tracking-widest uppercase transition-colors duration-300"
        >
          Mail
        </a>
      </div>
```

Place this JSX directly inside `<main>`, after the `<Canvas>` closing tag and before the overlay div.

- [ ] **Step 2: Verify HUD in browser**

Open `http://localhost:3000`. Expected:
- Bottom-left: faint identity text, barely visible against the dark background
- Bottom-right: three small text links (Li, X, Mail), faint until hovered
- Nothing overlaps the planets
- HUD doesn't appear over the transition overlay (overlay is `z-50`, HUD is `z-20`)

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add identity HUD and social links to galaxy"
```

---

## Task 10: Emotion AI planet interior

**Files:**
- Create: `app/projects/emotion-ai/page.tsx`

- [ ] **Step 1: Create `app/projects/emotion-ai/page.tsx`**

```tsx
import { PlanetInteriorLayout } from '@/components/planet-interior/layout'

export const metadata = {
  title: 'Emotion AI — Umyal Dixit',
  description: 'Multimodal emotion recognition — video, audio, text — at 98% accuracy.',
}

export default function EmotionAIPage() {
  return (
    <PlanetInteriorLayout bgColor="#060D1A" planetName="Emotion AI">
      <div className="max-w-2xl mx-auto px-8 space-y-20">

        {/* Hero */}
        <section>
          <h1
            className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
            style={{ letterSpacing: '-0.02em' }}
          >
            Multimodal emotion recognition — video, audio, text — at 98% accuracy.
          </h1>
        </section>

        {/* What it is */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            What it is
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            A real-time emotion recognition system that reads facial expressions, vocal tone,
            and text sentiment simultaneously — then fuses them into a unified emotional state.
            Not just &ldquo;happy or sad&rdquo; — nuanced, continuous, multi-axis output.
          </p>
        </section>

        {/* Why I built it */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            Why I built it
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Sukku needed to understand emotions. I couldn&apos;t find an existing system
            that was accurate, real-time, and multi-modal — so I built the foundation myself.
            This project became the emotional awareness layer that every AI companion needs.
          </p>
        </section>

        {/* Technical depth */}
        <section className="space-y-6">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            What&apos;s technically interesting
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">PyTorch multimodal pipeline</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Three parallel encoders — visual (CNN on facial landmarks), audio (LSTM on mel-spectrograms),
                text (transformer embeddings) — fused by an attention mechanism that weights each modality
                based on confidence. Low-confidence audio doesn&apos;t drag down high-confidence visual.
              </p>
            </div>

            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">98% accuracy on AffectNet</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Trained on AffectNet (450k images) + RAVDESS (audio) + custom dataset.
                The fusion model outperforms any single modality by 6–12% on ambiguous emotional states.
              </p>
            </div>

            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">AWS deployment</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Inference runs on EC2 g4dn instances. SageMaker endpoint with auto-scaling.
                Average latency: 180ms per frame at 720p input. Handles concurrent streams.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-4 flex gap-4 flex-wrap">
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[#4A90E2]/40 hover:border-[#4A90E2] text-[#4A90E2] hover:text-white px-6 py-3 font-[Manrope] text-sm tracking-widest uppercase transition-all duration-300"
          >
            GitHub →
          </a>
        </section>

      </div>
    </PlanetInteriorLayout>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/projects/emotion-ai`. Expected: dark navy background (`#060D1A`), blue accent lines, large heading, three technical sections.

- [ ] **Step 3: Test transition from galaxy**

From `http://localhost:3000`, scroll forward until Emotion AI (blue planet, left side) is visible, then click it. Expected: blue-tinted overlay → Emotion AI interior.

- [ ] **Step 4: Commit**

```bash
git add app/projects/emotion-ai/page.tsx
git commit -m "feat: Emotion AI planet interior with full technical content"
```

---

## Task 11: Stub interiors for Genco, AI Learning, Design System

**Files:**
- Create: `components/ui/coming-soon.tsx`
- Create: `app/projects/genco/page.tsx`
- Create: `app/projects/ai-learning/page.tsx`
- Create: `app/projects/design-system/page.tsx`

- [ ] **Step 1: Create `components/ui/coming-soon.tsx`**

```tsx
type Props = {
  title: string
  tagline: string
  accentColor: string
}

export function ComingSoon({ title, tagline, accentColor }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-8 space-y-8">
      <h1
        className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
        style={{ letterSpacing: '-0.02em' }}
      >
        {tagline}
      </h1>
      <p
        className="text-sm font-[Manrope] tracking-widest uppercase"
        style={{ color: accentColor, opacity: 0.7 }}
      >
        Full case study coming in Phase 2
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/projects/genco/page.tsx`**

```tsx
import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'Genco — Umyal Dixit',
  description: 'Anonymous chat for real conversations.',
}

export default function GencoPage() {
  return (
    <PlanetInteriorLayout bgColor="#051A18" planetName="Genco">
      <ComingSoon
        title="Genco"
        tagline="Anonymous chat for real conversations."
        accentColor="#4ECDC4"
      />
    </PlanetInteriorLayout>
  )
}
```

- [ ] **Step 3: Create `app/projects/ai-learning/page.tsx`**

```tsx
import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'AI Learning — Umyal Dixit',
  description: 'Real-time AI tutors that adapt to every learner.',
}

export default function AILearningPage() {
  return (
    <PlanetInteriorLayout bgColor="#1A1400" planetName="AI Learning">
      <ComingSoon
        title="AI Learning"
        tagline="Real-time AI tutors that adapt to every learner."
        accentColor="#FFD166"
      />
    </PlanetInteriorLayout>
  )
}
```

- [ ] **Step 4: Create `app/projects/design-system/page.tsx`**

```tsx
import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'Design System — Umyal Dixit',
  description: 'A precise, minimal component system.',
}

export default function DesignSystemPage() {
  return (
    <PlanetInteriorLayout bgColor="#0A0A0A" planetName="Design System">
      <ComingSoon
        title="Design System"
        tagline="A precise, minimal component system."
        accentColor="#E8E8E8"
      />
    </PlanetInteriorLayout>
  )
}
```

- [ ] **Step 5: Verify all stubs load**

Check each in browser: `/projects/genco`, `/projects/ai-learning`, `/projects/design-system`. Each should have the correct background color and accent.

- [ ] **Step 6: Commit**

```bash
git add components/ui/coming-soon.tsx app/projects/genco/page.tsx app/projects/ai-learning/page.tsx app/projects/design-system/page.tsx
git commit -m "feat: stub planet interiors for Genco, AI Learning, Design System"
```

---

## Task 12: Phase 2 coming soon stubs (about, blog, gallery)

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/gallery/page.tsx`

- [ ] **Step 1: Replace `app/about/page.tsx`**

```tsx
import Link from 'next/link'

export const metadata = { title: 'About — Umyal Dixit' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-8">
      <p className="text-xs font-[Manrope] tracking-widest uppercase text-white/30 mb-6">About</p>
      <h1 className="text-4xl font-[Syne] font-light text-white/70 mb-4 text-center">Coming in Phase 2</h1>
      <p className="text-white/30 font-[Manrope] text-base mb-12">This page is under construction.</p>
      <Link href="/" className="text-white/40 hover:text-white/80 text-sm font-[Manrope] tracking-widest uppercase transition-colors">
        ← Back to universe
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/blog/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Replace `app/gallery/page.tsx`**

```tsx
import Link from 'next/link'

export const metadata = { title: 'Gallery — Umyal Dixit' }

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-8">
      <p className="text-xs font-[Manrope] tracking-widest uppercase text-white/30 mb-6">Gallery</p>
      <h1 className="text-4xl font-[Syne] font-light text-white/70 mb-4 text-center">Coming in Phase 2</h1>
      <p className="text-white/30 font-[Manrope] text-base mb-12">Visual work is being curated.</p>
      <Link href="/" className="text-white/40 hover:text-white/80 text-sm font-[Manrope] tracking-widest uppercase transition-colors">
        ← Back to universe
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Verify stubs load without errors**

Check `/about`, `/blog`, `/gallery` in browser. Each should show centered text on dark background with "← Back to universe" link.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx app/blog/page.tsx app/gallery/page.tsx
git commit -m "feat: Phase 2 coming soon stubs for about, blog, gallery"
```

---

## Task 13: Restyle contact page

The contact page keeps its Resend API logic untouched. Only the visual layer changes.

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Read current contact page**

Read `app/contact/page.tsx` to locate the form submit handler and the `subjects` array. Note the exact field names: `name`, `email`, `subject`, `message`. Do not change these.

- [ ] **Step 2: Replace the visual layer of `app/contact/page.tsx`**

Replace the entire file with:

```tsx
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
```

- [ ] **Step 3: Verify contact form**

Navigate to `/contact`. Expected: minimal dark form with border-bottom inputs, orange focus states, "← orbit" link. The `app/api/contact/route.ts` is unchanged — form submission still sends via Resend.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: restyle contact page with space aesthetic, Resend API untouched"
```

---

## Task 14: Reduced-motion fallback

**Files:**
- Modify: `app/page.tsx`

The `globals.css` already has `@media (prefers-reduced-motion)` that hides `.motion-canvas` and shows `.motion-fallback`. This task adds the static fallback markup.

- [ ] **Step 1: Add motion-fallback div to `app/page.tsx`**

Inside `<main>`, after the canvas `</Canvas>` closing tag, before the HUD divs, add:

```tsx
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
            <p className="text-white/50 font-[Manrope] mt-2">Fluid Interfaces & AI Agents</p>
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
```

- [ ] **Step 2: Test the fallback**

In browser DevTools → Rendering → enable "Emulate CSS media feature: prefers-reduced-motion: reduce".

Expected: canvas hidden, static grid of project cards visible. All links work. No animations.

Disable the emulation and confirm the canvas returns.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: reduced-motion static fallback with project grid"
```

---

## Task 15: Mobile map view fallback

On mobile (viewport < 768px), the scroll-driven 3D canvas is replaced with a 2D tap-to-explore grid. The metaphor survives; the performance is protected.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add mobile detection and map view to `app/page.tsx`**

Add the import and mobile map at the top of the file:

```tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { GalaxyScene } from '@/components/galaxy/scene'
import { PLANETS } from '@/lib/planets'
```

Add mobile detection inside the component, before the return:

```tsx
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
```

Add the mobile map view JSX inside `<main>`, before the canvas:

```tsx
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
```

The transition overlay already handles the zoom-to-interior on mobile (same `handlePlanetClick`). No changes needed there.

- [ ] **Step 2: Verify mobile view**

In browser DevTools, set viewport to 375px width. Expected: canvas invisible (still mounted but behind the mobile grid), colored planet list visible, tapping a planet triggers the overlay + navigation to interior page.

Set viewport back to desktop. Expected: canvas fully visible, mobile grid hidden.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mobile map view with planet list and tap-to-enter navigation"
```

---

## Task 16: Final verification + Vercel deploy readiness

- [ ] **Step 1: Run production build locally**

```bash
pnpm build
```

Expected: build succeeds with no errors. Warnings about `@react-three/fiber` server-side rendering are acceptable. Any `Module not found` errors must be fixed before proceeding.

Common issues and fixes:
- If `'use client'` is missing on a component that uses hooks — add it
- If build fails on `useScroll` or `useFrame` outside canvas — ensure all R3F components are client components

- [ ] **Step 2: Check for TypeScript errors**

```bash
pnpm build 2>&1 | grep -E "error TS|Type error"
```

Expected: no output (no TS errors).

- [ ] **Step 3: Verify all routes in production build**

```bash
pnpm start
```

Open and check each route:
- `http://localhost:3000/` — galaxy scene, scroll, planets, UFO, HUD
- `http://localhost:3000/projects/sukku` — full content interior
- `http://localhost:3000/projects/emotion-ai` — full content interior
- `http://localhost:3000/projects/genco` — stub
- `http://localhost:3000/projects/ai-learning` — stub
- `http://localhost:3000/projects/design-system` — stub
- `http://localhost:3000/about` — coming soon
- `http://localhost:3000/blog` — coming soon
- `http://localhost:3000/gallery` — coming soon
- `http://localhost:3000/contact` — form functional

- [ ] **Step 4: Test the signature transition one final time**

From the galaxy, click Sukku. Verify:
1. Camera zooms toward it
2. Amber overlay fades in
3. Interior page loads with content
4. "← orbit" returns to galaxy

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Phase 1 — space universe portfolio v4"
```

- [ ] **Step 6: Push to remote and trigger Vercel deploy**

```bash
git push origin main
```

Vercel auto-deploys on push if connected. If not yet connected, run:
```bash
npx vercel --prod
```

---

## Phase 1 Completion Checklist

- [ ] Deep-space landing with scroll-driven camera flight
- [ ] UFO navigator with mouse parallax and idle bob
- [ ] 5 planets: Sukku (hero), Emotion AI, Genco, AI Learning, Design System
- [ ] Smooth cinematic zoom transition galaxy → interior
- [ ] Sukku and Emotion AI with full content
- [ ] Genco, AI Learning, Design System as stubs
- [ ] "← orbit" exits back to galaxy
- [ ] `/about`, `/blog`, `/gallery` as coming soon stubs
- [ ] `/contact` restyled, Resend API intact
- [ ] Desktop: full 3D experience
- [ ] Mobile: map view with same navigation
- [ ] Reduced-motion: static project grid
- [ ] No-JS: plain HTML list in `<noscript>`
- [ ] `pnpm build` succeeds without errors
- [ ] Deployed to Vercel
