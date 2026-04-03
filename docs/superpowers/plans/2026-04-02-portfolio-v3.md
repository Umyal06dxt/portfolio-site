# Portfolio v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete portfolio v3 — shared Navbar, 3D low-poly avatar with cursor tracking, full-viewport hero scene, and three new pages (About, Blog, Contact).

**Architecture:** Phased delivery — Navbar first (unblocks all pages), then the AvatarScene component (used in both hero and bento), then the new hero experience wired into landing-page.tsx, then the three new pages, then a final polish pass.

**Tech Stack:** Next.js 16 (App Router), React 19, Three.js 0.182 + @react-three/fiber 9, Framer Motion 12, Tailwind CSS v4, TypeScript.

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `components/navbar.tsx` | Shared fixed nav: logo, links, Contact CTA, scroll-based bg |
| `components/avatar-scene.tsx` | `<AvatarScene mode hero\|card interactive>` — Three.js canvas with low-poly head, cursor tracking |
| `components/hero-scene.tsx` | Full-viewport hero wrapper: blueprint grid, reticle rings, particles, corner labels, scroll indicator |
| `app/about/page.tsx` | Two-column About page |
| `app/blog/page.tsx` | Blog listing page |
| `app/contact/page.tsx` | Contact page with form |
| `app/api/contact/route.ts` | POST handler → Resend email |

### Modified files
| File | Change |
|------|--------|
| `components/landing-page.tsx` | Replace hero text overlay with `<HeroScene>`, replace center bento `DistortImageCanvas` with `<AvatarScene mode="card">`, add `<Navbar>` |
| `app/projects/page.tsx` | Replace inline nav with `<Navbar>` |
| `app/gallery/page.tsx` | Remove `<PinterestHeader>`, add `<Navbar>` |

---

## Task 1: Navbar Component

**Files:**
- Create: `components/navbar.tsx`
- Modify: `app/layout.tsx` — NOT modified (Navbar is per-page to keep page-specific layouts clean)

- [ ] **Step 1: Create `components/navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,5,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-display font-black text-sm tracking-[0.2em] uppercase text-white hover:text-[#E85002] transition-colors"
      >
        U.DIXIT
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/contact"
        className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-[#E85002] text-[#E85002] hover:bg-[#E85002] hover:text-black transition-all"
      >
        [Contact]
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Add Navbar to home page**

In `components/landing-page.tsx`, add import and render at the top of the returned JSX:

```tsx
// Add import at top:
import Navbar from "@/components/navbar";

// Inside the return, as first child of the outer <div ref={containerRef}>:
<Navbar />
```

- [ ] **Step 3: Add Navbar to projects page**

In `app/projects/page.tsx`, replace the inline nav block (lines 29–38) with:

```tsx
import Navbar from "@/components/navbar";

// Replace the fixed top div with:
<Navbar />
```

- [ ] **Step 4: Add Navbar to gallery page**

In `app/gallery/page.tsx`, add import and render before `<PinterestHeader />`:

```tsx
import Navbar from "@/components/navbar";

// In return JSX, add as first child:
<Navbar />
```

Then remove `<PinterestHeader />` if it duplicates nav (check `components/pinterest/layout.tsx` first — if it has its own header, keep just the Navbar).

- [ ] **Step 5: Verify in browser**

Run `pnpm dev` and visit `/`, `/projects`, `/gallery`. Confirm nav appears with transparent bg, transitions to dark on scroll, and Contact button is orange.

- [ ] **Step 6: Commit**

```bash
git add components/navbar.tsx components/landing-page.tsx app/projects/page.tsx app/gallery/page.tsx
git commit -m "feat: add shared Navbar component across all pages"
```

---

## Task 2: 3D Avatar Component

**Files:**
- Create: `components/avatar-scene.tsx`

- [ ] **Step 1: Create `components/avatar-scene.tsx`**

```tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

// ─── Inner mesh component ──────────────────────────────────────────────────
function AvatarMesh({ mode }: { mode: "hero" | "card" }) {
  const headRef = useRef<THREE.Mesh>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();

  // Target rotation (updated by mouse tracker below)
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const maxY = mode === "hero" ? 0.4 : 0.15;
  const maxX = mode === "hero" ? 0.2 : 0.08;

  // Mouse tracking via pointer events on the canvas parent
  useFrame(({ pointer }) => {
    targetRotation.current.y = pointer.x * maxY;
    targetRotation.current.x = -pointer.y * maxX;

    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      0.05
    );
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      0.05
    );

    if (headRef.current) {
      headRef.current.rotation.y = currentRotation.current.y;
      headRef.current.rotation.x = currentRotation.current.x;
    }

    // Eye lateral shift
    const eyeShift = currentRotation.current.y * 0.08;
    if (leftEyeRef.current) leftEyeRef.current.position.x = -0.18 + eyeShift;
    if (rightEyeRef.current) rightEyeRef.current.position.x = 0.18 + eyeShift;

    // Idle bob in card mode
    if (mode === "card" && headRef.current) {
      headRef.current.rotation.y +=
        Math.sin(Date.now() * 0.001) * 0.002;
    }
  });

  // Build a low-poly head using OctahedronGeometry, slightly scaled
  const headGeom = new THREE.OctahedronGeometry(0.55, 1);
  // Flatten to be human-proportion: wider than tall
  headGeom.applyMatrix4(new THREE.Matrix4().makeScale(1.15, 1.0, 0.9));

  return (
    <group position={[0, 0, 0]}>
      {/* Head */}
      <mesh ref={headRef} geometry={headGeom}>
        <meshPhongMaterial
          color="#E85002"
          flatShading
          shininess={10}
        />
      </mesh>

      {/* Left eye */}
      <mesh ref={leftEyeRef} position={[-0.18, 0.08, 0.44]}>
        <planeGeometry args={[0.1, 0.06]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* Right eye */}
      <mesh ref={rightEyeRef} position={[0.18, 0.08, 0.44]}>
        <planeGeometry args={[0.1, 0.06]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.22, 0.3, 0.2]} />
        <meshPhongMaterial color="#1a0800" flatShading />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[1.1, 0.15, 0.35]} />
        <meshPhongMaterial color="#0f0f1a" flatShading />
      </mesh>
    </group>
  );
}

// ─── Public component ──────────────────────────────────────────────────────
interface AvatarSceneProps {
  mode?: "hero" | "card";
  interactive?: boolean;
}

export default function AvatarScene({
  mode = "hero",
  interactive = true,
}: AvatarSceneProps) {
  const canvasSize = mode === "hero"
    ? { width: "100%", height: "100%" }
    : { width: "100%", height: "100%" };

  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ background: "transparent", ...canvasSize }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} color="#fff5e0" />
      <pointLight position={[2, 3, 2]} intensity={1.2} color="#fff5e0" />
      <pointLight position={[-1, -2, 1]} intensity={0.6} color="#E85002" />
      <AvatarMesh mode={mode} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Test avatar in isolation — add temporary route**

In `app/page.tsx`, temporarily replace `<LandingPage />` with:

```tsx
import AvatarScene from "@/components/avatar-scene";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050505" }}>
      <AvatarScene mode="hero" interactive={true} />
    </div>
  );
}
```

Run `pnpm dev` and navigate to `/`. You should see a low-poly orange geometric head in the center. Moving your cursor should rotate the head.

- [ ] **Step 3: Revert the test — restore landing page**

```tsx
import LandingPage from "@/components/landing-page";

export default function Home() {
  return <LandingPage />;
}
```

- [ ] **Step 4: Replace bento center card with AvatarScene**

In `components/landing-page.tsx`, add import:

```tsx
import AvatarScene from "@/components/avatar-scene";
```

Find the center bento card content (item `id: 2`, the `DistortImageCanvas` block) and replace the inner div content:

```tsx
// Replace this block in item id: 2's header:
header: (
  <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
    <AvatarScene mode="card" interactive={true} />
  </div>
),
```

- [ ] **Step 5: Verify bento avatar**

Run `pnpm dev`. The center bento card should show the 3D avatar. Moving the cursor should cause subtle head movement.

- [ ] **Step 6: Commit**

```bash
git add components/avatar-scene.tsx components/landing-page.tsx app/page.tsx
git commit -m "feat: add 3D low-poly AvatarScene with cursor tracking"
```

---

## Task 3: Full-Viewport Hero Scene

**Files:**
- Create: `components/hero-scene.tsx`
- Modify: `components/landing-page.tsx`

- [ ] **Step 1: Create `components/hero-scene.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AvatarScene from "@/components/avatar-scene";

// Fixed ambient particles
const PARTICLES = [
  { id: 1, top: "18%", left: "12%", size: 4 },
  { id: 2, top: "72%", left: "8%", size: 3 },
  { id: 3, top: "30%", left: "88%", size: 5 },
  { id: 4, top: "65%", left: "80%", size: 3 },
  { id: 5, top: "85%", left: "55%", size: 4 },
  { id: 6, top: "10%", left: "60%", size: 3 },
  { id: 7, top: "48%", left: "5%", size: 4 },
  { id: 8, top: "20%", left: "40%", size: 2 },
];

export default function HeroScene() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const t = setInterval(update, 1000);
    update();
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">

      {/* Blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Concentric reticle rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border border-[#E85002]/25"
          style={{ width: 340, height: 340 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full border border-[#E85002]/15"
          style={{ width: 500, height: 500 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Ambient particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#E85002]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2 + p.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.id * 0.2,
          }}
        />
      ))}

      {/* Corner labels */}
      <div className="absolute top-16 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5">
        <span>UMYAL.DEV</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#E85002] rounded-full inline-block animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="absolute top-16 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right">
        <span>EST. 2024</span>
        <span>v3.0</span>
      </div>
      <div className="absolute bottom-10 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5">
        <span>DELHI, IN</span>
        <span>{time}</span>
      </div>
      <div className="absolute bottom-10 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right">
        <span>CREATIVE</span>
        <span>ENGINEER</span>
      </div>

      {/* 3D Avatar (hero mode, pointer-events on) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div style={{ width: 320, height: 420 }}>
          <AvatarScene mode="hero" interactive={true} />
        </div>
      </div>

      {/* Name + tagline (below avatar center) */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-2">
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter uppercase text-white">
          UMYAL DIXIT
        </h1>
        <p className="font-mono text-[11px] text-white/40 tracking-widest">
          // Creative Engineer · Delhi, IN · Open to Work
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">SCROLL</span>
        <div className="relative w-px h-8 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#E85002]"
            animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#E85002]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire HeroScene into landing-page.tsx**

In `components/landing-page.tsx`, add import:

```tsx
import HeroScene from "@/components/hero-scene";
```

Replace the current hero overlay block (the `<motion.div style={{ opacity: heroTextOpacity ... }}>` that shows "HI I'M UMYAL") with:

```tsx
<motion.div
  style={{ opacity: heroTextOpacity }}
  className="absolute inset-0 z-50 pointer-events-none"
>
  <HeroScene />
</motion.div>
```

- [ ] **Step 3: Verify hero**

Run `pnpm dev`. At 0% scroll you should see: blueprint grid, reticles, particles, corner labels, 3D avatar, name + tagline, scroll indicator. Scrolling should fade it out and reveal the bento grid as before.

- [ ] **Step 4: Commit**

```bash
git add components/hero-scene.tsx components/landing-page.tsx
git commit -m "feat: add full-viewport hero scene with grid, reticles, particles and avatar"
```

---

## Task 4: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
"use client";

import Navbar from "@/components/navbar";
import AvatarScene from "@/components/avatar-scene";

const techStack = [
  "React", "Next.js", "Three.js", "Python", "Node.js",
  "Tailwind", "WebGL/GLSL", "Figma", "MongoDB", "AI/LLMs",
];

const timeline = [
  {
    year: "2026",
    title: "Creative Engineer @ Freelance",
    description: "Building Awwwards-level interfaces and AI-driven products for global clients.",
    stack: ["React", "Three.js", "Next.js"],
  },
  {
    year: "2025",
    title: "AI Learning Platform",
    description: "Built a live video-based learning system for children with real-time AI tutors.",
    stack: ["Next.js", "Python", "AI"],
  },
  {
    year: "2024",
    title: "Genco — Anon Chat App",
    description: "Designed a community app with anonymous chat and AI-driven moderation.",
    stack: ["React Native", "Python", "MongoDB"],
  },
  {
    year: "2024",
    title: "Portfolio v1",
    description: "First personal portfolio — where it all started.",
    stack: ["HTML", "CSS", "JS"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-14 min-h-screen flex flex-col md:flex-row">

        {/* Left column */}
        <div className="w-full md:w-[340px] flex-shrink-0 bg-[#080808] border-r border-white/[0.06] p-8 flex flex-col gap-8">
          <div>
            <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Identity</span>
          </div>

          {/* Avatar */}
          <div className="w-full aspect-square max-w-[260px] mx-auto">
            <AvatarScene mode="card" interactive={false} />
          </div>

          {/* Stats */}
          <div className="flex gap-6 font-mono text-[11px] text-white/50 uppercase tracking-widest">
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">3+</span>
              <span>Years</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">12+</span>
              <span>Projects</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">5+</span>
              <span>Clients</span>
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest hover:border-[#E85002] hover:text-[#E85002] transition-colors cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 p-8 md:p-16 flex flex-col gap-12">

          <div>
            <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Who I Am</span>
          </div>

          <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95] uppercase tracking-tighter">
            ENGINEER WITH A <span className="text-[#E85002]">DESIGNER&apos;S</span> HEART.
          </h2>

          <p className="font-mono text-sm text-white/50 leading-relaxed max-w-xl">
            {"// "} I build interfaces that live at the edge of engineering and art.
            Based in Delhi, IN — working globally. Focused on fluid UI, real-time 3D,
            and AI-native products that people actually remember.
          </p>

          {/* Timeline */}
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">Timeline</p>
            <div className="flex flex-col gap-8">
              {timeline.map((entry) => (
                <div key={entry.year + entry.title} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] text-[#E85002] tracking-widest w-10 pt-1">{entry.year}</span>
                    <div className="w-px flex-1 bg-white/[0.06] mt-2" />
                  </div>
                  <div className="pb-8">
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-white group-hover:text-[#E85002] transition-colors">
                      {entry.title}
                    </h3>
                    <p className="font-mono text-xs text-white/40 mt-1 leading-relaxed">{entry.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.stack.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] font-mono text-[9px] text-white/40 uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify About page**

Run `pnpm dev` and navigate to `/about`. You should see the two-column layout: left has avatar + stats + stack chips, right has headline, bio, and timeline.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add About page with avatar, stats, stack, and timeline"
```

---

## Task 5: Blog Page

**Files:**
- Create: `app/blog/page.tsx`

- [ ] **Step 1: Create `app/blog/page.tsx`**

```tsx
import Navbar from "@/components/navbar";
import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Building Low-Poly Avatars with Three.js and No 3D Files",
    date: "2026-04-01",
    readTime: "6 min",
    tags: ["Three.js", "WebGL", "React"],
    excerpt: "How I built a fully procedural low-poly character using raw BufferGeometry — no .glb, no Blender, just math.",
    featured: true,
  },
  {
    id: 2,
    title: "Scroll-Driven Animations with Framer Motion: A Deep Dive",
    date: "2026-03-15",
    readTime: "5 min",
    tags: ["Framer Motion", "React"],
    excerpt: "useScroll + useTransform: the pattern that powers every scroll-linked animation on this site.",
    featured: false,
  },
  {
    id: 3,
    title: "Why I Design in Code First",
    date: "2026-03-01",
    readTime: "4 min",
    tags: ["Design", "Tailwind"],
    excerpt: "Figma is great for exploring. But the real design decisions happen in the browser.",
    featured: false,
  },
  {
    id: 4,
    title: "Building Real-Time AI Tutors for Kids",
    date: "2026-02-10",
    readTime: "7 min",
    tags: ["AI", "Python", "Next.js"],
    excerpt: "Architecture decisions behind a live video learning platform with AI co-teachers.",
    featured: false,
  },
  {
    id: 5,
    title: "Tailwind v4: What Actually Changed",
    date: "2026-01-20",
    readTime: "3 min",
    tags: ["Tailwind", "CSS"],
    excerpt: "A practical breakdown of what's different in v4 and what it means for your workflow.",
    featured: false,
  },
];

function TagChip({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 border border-white/10 font-mono text-[9px] text-white/40 uppercase tracking-widest">
      {label}
    </span>
  );
}

function PostCard({ post, featured }: { post: typeof posts[0]; featured?: boolean }) {
  return (
    <div
      className={`border border-white/[0.08] bg-[#080808] p-6 flex flex-col gap-4 hover:border-[#E85002]/40 transition-colors ${
        featured ? "row-span-2" : ""
      }`}
    >
      <div
        className="w-full bg-gradient-to-br from-[#E85002]/10 to-white/[0.03] flex items-center justify-center border-b border-white/[0.06]"
        style={{ height: featured ? 200 : 120 }}
      >
        <span className="font-mono text-[10px] text-[#E85002]/60 uppercase tracking-widest">{post.tags[0]}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {post.tags.map((t) => <TagChip key={t} label={t} />)}
      </div>
      <h3 className={`font-display font-bold uppercase tracking-tight leading-tight ${featured ? "text-2xl" : "text-base"} text-white`}>
        {post.title}
      </h3>
      <p className="font-mono text-xs text-white/40 leading-relaxed">{post.excerpt}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">{post.date} · {post.readTime}</span>
        <span className="font-mono text-[10px] text-[#E85002] tracking-widest">Read More →</span>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Hero header */}
      <div className="pt-28 pb-16 px-8 md:px-16 border-b border-white/[0.06]">
        <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Writing</span>
        <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter mt-4 leading-[0.9]">
          WORDS FROM THE <span className="text-[#E85002]">TERMINAL.</span>
        </h1>
        <div className="flex flex-wrap gap-2 mt-8">
          {["Three.js", "React", "AI", "Design", "Next.js", "CSS"].map((tag) => (
            <span key={tag} className="px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest hover:text-[#E85002] hover:border-[#E85002]/40 transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridTemplateRows: "auto" }}>
          {/* Featured - spans 2 rows */}
          <div className="md:row-span-2">
            <PostCard post={featured} featured />
          </div>
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify Blog page**

Navigate to `/blog`. You should see the large heading, floating tag chips, and the asymmetric card grid with the featured post taller on the left.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add Blog listing page with featured post grid"
```

---

## Task 6: Contact Page + API Route

**Files:**
- Create: `app/contact/page.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create contact API route `app/api/contact/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Resend integration — RESEND_API_KEY must be set in .env.local
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Dev fallback: log and return success so form works without Resend configured
    console.log("[contact]", { name, email, subject, message });
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "portfolio@umyal.dev",
      to: "hello@umyal.dev",
      subject: `[Portfolio] ${subject || "New message"} — from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create `app/contact/page.tsx`**

```tsx
"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";

const subjects = [
  "Freelance Project",
  "Full-time Role",
  "Collaboration",
  "Just saying hi",
];

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/umyaldixit" },
  { label: "X / Twitter", href: "https://x.com/umyaldixit" },
  { label: "Email", href: "mailto:hello@umyal.dev" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-14 min-h-screen flex flex-col md:flex-row">

        {/* Left column */}
        <div className="w-full md:w-[380px] flex-shrink-0 bg-[#080808] border-r border-white/[0.06] p-10 flex flex-col gap-10 relative overflow-hidden">
          {/* Background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="font-display font-black text-[120px] leading-none whitespace-nowrap opacity-[0.03]"
              style={{ WebkitTextStroke: "1px white" }}
            >
              SAY HELLO
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            <div>
              <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Get In Touch</span>
            </div>

            <h2 className="font-display font-black text-5xl uppercase tracking-tighter leading-[0.9]">
              SAY <span className="text-[#E85002]">HELLO.</span>
            </h2>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E85002] animate-pulse" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest">Available for Work</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["React", "Three.js", "Next.js", "Python", "Figma"].map((t) => (
                <span key={t} className="px-2 py-1 border border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-white/10 font-mono text-[11px] text-white/50 uppercase tracking-widest hover:bg-[#E85002] hover:text-black hover:border-[#E85002] transition-all"
                >
                  {s.label}
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — form */}
        <div className="flex-1 p-10 md:p-16 flex items-start">
          {status === "sent" ? (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Message sent</span>
              <p className="font-display font-bold text-3xl uppercase">Got it. I&apos;ll be in touch.</p>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="w-fit font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-white/20 text-white/50 hover:border-white hover:text-white transition-all mt-4"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-5">
              <div>
                <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Contact Form</span>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20"
                  placeholder="you@example.com"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="bg-[#050505] border border-white/10 px-4 py-3 font-mono text-sm text-white/60 focus:outline-none focus:border-[#E85002] transition-colors"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status === "error" && (
                <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">
                  // Failed to send. Try emailing directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full px-6 py-4 border-2 border-[#E85002] text-[#E85002] font-mono text-sm uppercase tracking-widest hover:bg-[#E85002] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {status === "sending" ? "SENDING..." : "SEND_MESSAGE [↗]"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify Contact page**

Navigate to `/contact`. Left column should show "SAY HELLO" background text, heading, availability badge, stack chips, and social links. Right column should show the form. Submitting should log to console in dev (no RESEND_API_KEY needed).

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx app/api/contact/route.ts
git commit -m "feat: add Contact page with form and API route"
```

---

## Task 7: Polish Pass

**Files:**
- Modify: `app/layout.tsx` — add AnimatePresence wrapper
- Modify: `components/landing-page.tsx` — wire INITIATE_CONTACT button to /contact
- Modify: `app/gallery/page.tsx` — remove PinterestHeader if it duplicates nav

- [ ] **Step 1: Wire home page "INITIATE_CONTACT" button**

In `components/landing-page.tsx`, find the `INITIATE_CONTACT` button in item `id: 8` and make it a Link:

```tsx
// Add at top of file (already imported if Navbar is there):
import Link from "next/link";

// Replace the div button with:
<Link
  href="/contact"
  className="px-6 py-4 border-2 border-[#E85002] text-[#E85002] font-bold text-sm hover:bg-[#E85002] hover:text-black transition-all uppercase tracking-widest shadow-[4px_4px_0px_#E85002]"
>
  INITIATE_CONTACT
</Link>
```

- [ ] **Step 2: Check PinterestHeader for nav duplication**

Read `components/pinterest/layout.tsx`. If `PinterestHeader` renders its own navigation bar, remove it from `app/gallery/page.tsx` and keep only `<Navbar />`.

- [ ] **Step 3: Add page transition wrapper**

In `app/layout.tsx`, if the project is not already using AnimatePresence for page transitions, it stays client-side — skip this for now (Next.js App Router page transitions require a separate client wrapper; only add if user requests it).

- [ ] **Step 4: Mobile check**

Open dev tools, set viewport to 375px wide. Verify:
- Navbar links are hidden on mobile (they are — `hidden md:flex`)
- Hero scene is readable on small screens (avatar and name don't overflow)
- About/Blog/Contact pages stack to single column (they do — `flex-col md:flex-row`)

- [ ] **Step 5: Final commit**

```bash
git add components/landing-page.tsx app/gallery/page.tsx
git commit -m "polish: wire contact button, clean up gallery nav"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by task |
|---|---|
| Shared Navbar (scroll bg, logo, links, CTA) | Task 1 |
| 3D Avatar (OctahedronGeometry, eyes, neck, shoulders, mouse tracking, card idle) | Task 2 |
| Hero blueprint grid | Task 3 |
| Hero reticle rings | Task 3 |
| Hero ambient particles | Task 3 |
| Hero corner labels + live clock | Task 3 |
| Hero avatar (hero mode) | Task 3 |
| Hero name + tagline | Task 3 |
| Hero scroll indicator | Task 3 |
| Bento center card → AvatarScene | Task 2 Step 4 |
| About page (two-column, avatar, stats, stack, timeline) | Task 4 |
| Blog page (hero header, tag chips, asymmetric grid) | Task 5 |
| Contact page (left column, form, social links) | Task 6 |
| Contact API route (Resend) | Task 6 |
| Nav bar on `/projects` | Task 1 Step 3 |
| Nav bar on `/gallery` | Task 1 Step 4 |
| INITIATE_CONTACT → /contact | Task 7 Step 1 |

All spec sections are covered.
