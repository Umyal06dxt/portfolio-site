# Landing Page Cinematic Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded intro loader, orchestrated hero entry animations, character scramble on the name, and 3D magnetic tilt + cursor spotlight on the bento grid.

**Architecture:** Framer Motion timeline — Loader overlays the already-rendered page, lifts away as a curtain, then fires `onComplete` which sets `heroReady=true` in `LandingPage`, triggering staggered entry animations on every hero element. Bento grid gets a TiltCard wrapper (per-card 3D tilt) and a single spotlight div (grid-wide cursor light).

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, TypeScript, Tailwind CSS v4.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/loader.tsx` | Create | Branded intro overlay — letter stagger, orange sweep, curtain wipe |
| `components/scramble-text.tsx` | Create | Reusable char-scramble text animation |
| `components/tilt-card.tsx` | Create | 3D magnetic tilt wrapper for bento cards |
| `components/hero-scene.tsx` | Modify | Add `ready` prop + entry animations on all elements |
| `components/landing-page.tsx` | Modify | Mount Loader, manage `heroReady` state, add spotlight + TiltCard |

`app/layout.tsx` is **not** modified — the Loader renders only on the home page, so it lives inside `LandingPage`.

---

## Task 1: ScrambleText Component

**Files:**
- Create: `components/scramble-text.tsx`

- [ ] **Step 1: Create `components/scramble-text.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface ScrambleTextProps {
  text: string;
  trigger: boolean;
  className?: string;
  staggerMs?: number;
  scrambleDuration?: number;
}

export default function ScrambleText({
  text,
  trigger,
  className,
  staggerMs = 30,
  scrambleDuration = 400,
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState<string[]>(() => text.split(""));
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];

    if (!trigger) {
      setDisplayed(text.split(""));
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text.split(""));
      return;
    }

    text.split("").forEach((char, i) => {
      if (char === " ") return;

      const startTimer = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayed((prev) => {
            const next = [...prev];
            next[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
            return next;
          });
        }, 40);
        intervalsRef.current.push(interval);

        const resolveTimer = setTimeout(() => {
          clearInterval(interval);
          setDisplayed((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
        }, scrambleDuration);
        timersRef.current.push(resolveTimer);
      }, i * staggerMs);

      timersRef.current.push(startTimer);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
    };
  }, [trigger, text, staggerMs, scrambleDuration]);

  return (
    <span className={className}>
      {displayed.map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            minWidth: char === " " ? "0.3em" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3 && pnpm build 2>&1 | tail -15
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3
git add components/scramble-text.tsx
git commit -m "feat: add ScrambleText component with character-by-character animation"
```

---

## Task 2: Loader Component

**Files:**
- Create: `components/loader.tsx`

- [ ] **Step 1: Create `components/loader.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOADER_KEY = "loader_shown";
const NAME = "UMYAL DIXIT";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [show, setShow] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyShown = Boolean(sessionStorage.getItem(LOADER_KEY));

    if (reduced || alreadyShown) {
      onComplete();
      return;
    }

    setShow(true);

    // Beat 1: letters animate in (0–600ms)
    // Beat 2: orange line sweeps (600–1200ms)
    const t1 = setTimeout(() => setLineActive(true), 600);
    // Beat 3: curtain lifts (1200ms, 650ms duration → done at 1850ms)
    const t2 = setTimeout(() => setExiting(true), 1200);
    const t3 = setTimeout(() => {
      sessionStorage.setItem(LOADER_KEY, "1");
      setShow(false);
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
      animate={{ y: exiting ? "-100%" : "0%" }}
      transition={
        exiting
          ? { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0 }
      }
    >
      {/* Letters */}
      <div className="flex items-baseline" style={{ gap: "0.02em" }}>
        {NAME.split("").map((char, i) => (
          <motion.span
            key={i}
            className="font-display font-black text-white uppercase select-none"
            style={{ fontSize: "clamp(40px, 7vw, 88px)", display: "inline-block" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.05,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>

      {/* Orange sweep line */}
      <motion.div
        className="h-px bg-[#E85002] mt-3 origin-left"
        style={{ width: "clamp(260px, 48vw, 580px)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: lineActive ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3 && pnpm build 2>&1 | tail -15
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3
git add components/loader.tsx
git commit -m "feat: add branded Loader with letter stagger, line sweep, and curtain wipe"
```

---

## Task 3: Hero Entry Animations + Wiring

Depends on Task 1 (ScrambleText) and Task 2 (Loader).

**Files:**
- Modify: `components/hero-scene.tsx`
- Modify: `components/landing-page.tsx`

- [ ] **Step 1: Rewrite `components/hero-scene.tsx` with entry animations**

Read the file first. Replace the entire file content with:

```tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AvatarScene from "@/components/avatar-scene";
import ScrambleText from "@/components/scramble-text";

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

interface HeroSceneProps {
  ready: boolean;
}

export default function HeroScene({ ready }: HeroSceneProps) {
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
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0 }}
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
          initial={{ opacity: 0, scale: 0 }}
          animate={
            ready
              ? { opacity: 1, scale: [1, 1.04, 1] }
              : { opacity: 0, scale: 0 }
          }
          transition={
            ready
              ? { opacity: { delay: 0.1, duration: 0.6 }, scale: { delay: 0.1, duration: 3, repeat: Infinity, ease: "easeInOut" } }
              : { duration: 0.3 }
          }
        />
        <motion.div
          className="absolute rounded-full border border-[#E85002]/15"
          style={{ width: 500, height: 500 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            ready
              ? { opacity: 1, scale: [1, 1.03, 1] }
              : { opacity: 0, scale: 0 }
          }
          transition={
            ready
              ? { opacity: { delay: 0.15, duration: 0.6 }, scale: { delay: 0.65, duration: 4, repeat: Infinity, ease: "easeInOut" } }
              : { duration: 0.3 }
          }
        />
      </div>

      {/* Ambient particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#E85002]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            ready
              ? { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }
              : { opacity: 0, scale: 0.5 }
          }
          transition={
            ready
              ? {
                  opacity: { delay: 0.3 + p.id * 0.04, duration: 2 + p.id * 0.3, repeat: Infinity, ease: "easeInOut" },
                  scale: { delay: 0.3 + p.id * 0.04, duration: 2 + p.id * 0.3, repeat: Infinity, ease: "easeInOut" },
                }
              : { duration: 0.2 }
          }
        />
      ))}

      {/* Corner labels — top left */}
      <motion.div
        className="absolute top-16 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -16 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span>UMYAL.DEV</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#E85002] rounded-full inline-block animate-pulse" />
          LIVE
        </span>
      </motion.div>

      {/* Corner labels — top right */}
      <motion.div
        className="absolute top-16 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 16 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span>EST. 2024</span>
        <span>v3.0</span>
      </motion.div>

      {/* Corner labels — bottom left */}
      <motion.div
        className="absolute bottom-10 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -16 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <span>DELHI, IN</span>
        <span>{time}</span>
      </motion.div>

      {/* Corner labels — bottom right */}
      <motion.div
        className="absolute bottom-10 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 16 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <span>CREATIVE</span>
        <span>ENGINEER</span>
      </motion.div>

      {/* 3D Avatar */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 40 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ width: 320, height: 420 }}>
          <AvatarScene mode="hero" interactive={true} />
        </div>
      </motion.div>

      {/* Name + tagline */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
      >
        <ScrambleText
          text="UMYAL DIXIT"
          trigger={ready}
          className="font-display font-black text-5xl md:text-7xl tracking-tighter uppercase text-white"
          staggerMs={30}
          scrambleDuration={400}
        />
        <motion.p
          className="font-mono text-[11px] text-white/40 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          // Creative Engineer · Delhi, IN · Open to Work
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">SCROLL</span>
        <div className="relative w-px h-8 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#E85002]"
            style={{ height: "50%" }}
            animate={ready ? { top: ["0%", "100%"] } : { top: "0%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#E85002]"
          animate={ready ? { opacity: [1, 0.2, 1] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Wire Loader and `heroReady` in `components/landing-page.tsx`**

Read `components/landing-page.tsx`. Make these changes:

**2a — Add imports at the top:**
```tsx
import Loader from "@/components/loader";
```

**2b — Add state in `LandingPage` component body, after the existing state declarations:**
```tsx
const [heroReady, setHeroReady] = useState(false);

// For returning visitors who've already seen the loader
useEffect(() => {
  if (typeof window !== "undefined" && sessionStorage.getItem("loader_shown")) {
    setHeroReady(true);
  }
}, []);
```

**2c — Add `<Loader>` as the first element inside the return JSX, before `<Navbar />`:**
```tsx
<Loader onComplete={() => setHeroReady(true)} />
```

**2d — Pass `ready` prop to `<HeroScene />`:**

Find:
```tsx
<HeroScene />
```
Replace with:
```tsx
<HeroScene ready={heroReady} />
```

- [ ] **Step 3: Build check**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3 && pnpm build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. If TypeScript complains about `HeroScene` missing `ready` prop — that's because `hero-scene.tsx` was updated in Step 1. Verify both files are saved.

- [ ] **Step 4: Commit**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3
git add components/hero-scene.tsx components/landing-page.tsx
git commit -m "feat: add hero entry animations, wire Loader + heroReady state"
```

---

## Task 4: TiltCard Component

**Files:**
- Create: `components/tilt-card.tsx`

- [ ] **Step 1: Create `components/tilt-card.tsx`**

```tsx
"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  maxDeg?: number;
  className?: string;
}

export default function TiltCard({
  children,
  maxDeg = 8,
  className,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useSpring(0, { stiffness: 300, damping: 30 });
  const rawY = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateY = useTransform(rawX, [-1, 1], [-maxDeg, maxDeg]);
  const rotateX = useTransform(rawY, [-1, 1], [maxDeg, -maxDeg]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(x);
    rawY.set(y);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3 && pnpm build 2>&1 | tail -15
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3
git add components/tilt-card.tsx
git commit -m "feat: add TiltCard with 3D magnetic tilt using Framer Motion springs"
```

---

## Task 5: Bento Spotlight + Wire TiltCard

Depends on Task 4 (TiltCard).

**Files:**
- Modify: `components/landing-page.tsx`

- [ ] **Step 1: Add TiltCard import and spotlight state to `landing-page.tsx`**

Read `components/landing-page.tsx`. Add these imports:
```tsx
import TiltCard from "@/components/tilt-card";
```

Add these state/ref declarations inside `LandingPage`, after existing state:
```tsx
const gridRef = useRef<HTMLDivElement>(null);
const [spotX, setSpotX] = useState(0);
const [spotY, setSpotY] = useState(0);
const [gridHovered, setGridHovered] = useState(false);
```

- [ ] **Step 2: Add `onMouseMove` handler for the spotlight**

Add this function inside `LandingPage`, after the existing `useEffect`:
```tsx
function handleGridMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = gridRef.current?.getBoundingClientRect();
  if (!rect) return;
  setSpotX(e.clientX - rect.left);
  setSpotY(e.clientY - rect.top);
}
```

- [ ] **Step 3: Wrap the scalable grid container with spotlight and TiltCard**

Find the `{/* SCALABLE GRID CONTAINER */}` section in `landing-page.tsx`. The structure is:

```tsx
<motion.div
    style={{ scale: gridScale }}
    className="relative w-full origin-center"
>
    {/* Raycast Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {/* Col 1 (Left) - Animated */}
        <motion.div ...>
            <BentoGridItem {...items[0]} className="flex-1" />
            <BentoGridItem {...items[1]} className="flex-1" />
        </motion.div>

        {/* Col 2 (Center: Profile) - The Anchor */}
        <div className="flex flex-col gap-3 relative z-20">
            <BentoGridItem
                {...items[2]}
                className="h-[536px] bg-[#080808] relative z-30 glow-orange border-white/10 shadow-[0_0_50px_-10px_#E85002_40]"
            />
        </div>

        {/* Col 3 (Right) - Animated */}
        <motion.div ...>
            <div className="flex-1">
                <BentoGridItem
                    {...items[3]}
                    onClick={() => setSelectedProject(items[3])}
                    className="h-full"
                />
            </div>
             <div className="flex-1 flex flex-col gap-3">
                <BentoGridItem
                    {...items[4]}
                    onClick={() => setSelectedProject(items[4])}
                    className="flex-1"
                />
                <BentoGridItem
                    {...items[5]}
                    onClick={() => setSelectedProject(items[5])}
                    className="flex-1"
                />
             </div>
        </motion.div>
    </div>

    {/* Bottom Row - Animated */}
    <motion.div ...>
        <BentoGridItem {...items[6]} className="w-full shadow-none" />
    </motion.div>
</motion.div>
```

Replace it with this (adding the `ref`, `onMouseMove`, `onMouseLeave`, spotlight div, perspective, and TiltCard wrappers):

```tsx
<motion.div
    ref={gridRef}
    style={{ scale: gridScale, perspective: "800px" }}
    className="relative w-full origin-center"
    onMouseMove={handleGridMouseMove}
    onMouseEnter={() => setGridHovered(true)}
    onMouseLeave={() => setGridHovered(false)}
>
    {/* Cursor spotlight overlay */}
    <div
      className="pointer-events-none absolute inset-0 z-30 rounded-lg transition-opacity duration-300"
      style={{
        background: `radial-gradient(400px circle at ${spotX}px ${spotY}px, rgba(232,80,2,0.06), transparent 70%)`,
        opacity: gridHovered ? 1 : 0,
      }}
    />

    {/* Raycast Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">

        {/* Col 1 (Left) - Animated */}
        <motion.div
            style={{ opacity: sideColsOpacity, scale: sideColsScale }}
            className="flex flex-col gap-3"
        >
            <TiltCard className="flex-1">
              <BentoGridItem {...items[0]} className="h-full" />
            </TiltCard>
            <TiltCard className="flex-1">
              <BentoGridItem {...items[1]} className="h-full" />
            </TiltCard>
        </motion.div>

        {/* Col 2 (Center: Profile) - reduced tilt */}
        <div className="flex flex-col gap-3 relative z-20">
            <TiltCard maxDeg={4}>
              <BentoGridItem
                  {...items[2]}
                  className="h-[536px] bg-[#080808] relative z-30 glow-orange border-white/10 shadow-[0_0_50px_-10px_#E85002_40]"
              />
            </TiltCard>
        </div>

        {/* Col 3 (Right) - Animated */}
        <motion.div
            style={{ opacity: sideColsOpacity, scale: sideColsScale }}
            className="flex flex-col gap-3"
        >
            <div className="flex-1">
                <TiltCard className="h-full">
                  <BentoGridItem
                      {...items[3]}
                      onClick={() => setSelectedProject(items[3])}
                      className="h-full"
                  />
                </TiltCard>
            </div>
            <div className="flex-1 flex flex-col gap-3">
                <TiltCard className="flex-1">
                  <BentoGridItem
                      {...items[4]}
                      onClick={() => setSelectedProject(items[4])}
                      className="flex-1"
                  />
                </TiltCard>
                <TiltCard className="flex-1">
                  <BentoGridItem
                      {...items[5]}
                      onClick={() => setSelectedProject(items[5])}
                      className="flex-1"
                  />
                </TiltCard>
            </div>
        </motion.div>

    </div>

    {/* Bottom Row - Animated */}
    <motion.div
         style={{ opacity: sideColsOpacity, scale: sideColsScale }}
         className="md:col-span-3 mt-3 relative z-20"
    >
        <TiltCard maxDeg={3}>
          <BentoGridItem
              {...items[6]}
              className="w-full shadow-none"
          />
        </TiltCard>
    </motion.div>

</motion.div>
```

- [ ] **Step 4: Build check**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3 && pnpm build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with all 10 routes.

- [ ] **Step 5: Commit**

```bash
cd /home/umyaldixit/Desktop/portfolio-site/.worktrees/feature/portfolio-v3
git add components/landing-page.tsx
git commit -m "feat: add cursor spotlight and 3D magnetic tilt to bento grid"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| Branded loader — letter stagger | Task 2 |
| Loader — orange sweep line | Task 2 |
| Loader — curtain wipe exit | Task 2 |
| sessionStorage (once per session) | Task 2 |
| prefers-reduced-motion — loader skip | Task 2 |
| Hero entry — blueprint grid fade | Task 3 |
| Hero entry — reticle rings scale in | Task 3 |
| Hero entry — corner labels slide in | Task 3 |
| Hero entry — particles drift in | Task 3 |
| Hero entry — avatar rise | Task 3 |
| Hero entry — name scramble (ScrambleText) | Task 3 + Task 1 |
| Hero entry — tagline fade | Task 3 |
| Hero entry — scroll indicator | Task 3 |
| prefers-reduced-motion — scramble skip | Task 1 |
| heroReady state wired from Loader | Task 3 |
| Returning visitor skip loader | Task 3 |
| TiltCard — 3D tilt with springs | Task 4 |
| TiltCard — maxDeg prop (4 for center, 3 for bottom) | Task 5 |
| Cursor spotlight — radial gradient | Task 5 |
| Spotlight — opacity 0 when cursor leaves grid | Task 5 |
| perspective: 800px on grid wrapper | Task 5 |
| prefers-reduced-motion — tilt disabled | NOT in plan |

**Gap found:** `prefers-reduced-motion` should disable tilt in `TiltCard`. Add a check inside `TiltCard`:

In `components/tilt-card.tsx` (Task 4, Step 1), add inside the component before the handlers:

```tsx
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Then in `handleMouseMove`:
```tsx
function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  if (prefersReduced) return;
  // ... rest of handler
}
```

This is already part of the code in Task 4 Step 1 — add it there. The plan above does NOT include this check, so **add it to Task 4 Step 1** before committing.

**Updated Task 4, Step 1** — add `prefersReduced` check:

```tsx
"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  maxDeg?: number;
  className?: string;
}

export default function TiltCard({
  children,
  maxDeg = 8,
  className,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useSpring(0, { stiffness: 300, damping: 30 });
  const rawY = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateY = useTransform(rawX, [-1, 1], [-maxDeg, maxDeg]);
  const rotateX = useTransform(rawY, [-1, 1], [maxDeg, -maxDeg]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(x);
    rawY.set(y);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
```

Use this version in Task 4.
