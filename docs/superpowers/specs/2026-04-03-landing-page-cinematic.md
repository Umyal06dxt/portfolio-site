# Landing Page Cinematic Enhancement — Design Spec

**Date:** 2026-04-03
**Author:** Umyal Dixit
**Goal:** Add cinematic + luxury motion to the landing page — a branded loader, orchestrated hero entry, character scramble on the name, and 3D tilt + cursor spotlight on the bento grid.

---

## 1. Approach

Unified Framer Motion timeline using `AnimatePresence`, `initial/animate`, and staggered `transition.delay`. The loader overlays the already-rendered hero, lifts away like a curtain, then the hero elements animate in sequentially. No global state machine — timing is handled declaratively via Framer Motion.

---

## 2. New Files

| File | Responsibility |
|------|---------------|
| `components/loader.tsx` | Full-screen branded intro overlay, shown once per session |
| `components/scramble-text.tsx` | Reusable character-scramble text animation component |
| `components/tilt-card.tsx` | 3D magnetic tilt wrapper for bento cards |

## 3. Modified Files

| File | Change |
|------|--------|
| `app/layout.tsx` | Render `<Loader>` above children (so it overlays all pages on first visit) |
| `components/hero-scene.tsx` | Add `initial/animate` entry animations to every element |
| `components/landing-page.tsx` | Wrap bento items in `<TiltCard>`, add spotlight overlay to grid |

---

## 4. Loader (`components/loader.tsx`)

Full-screen `#050505` overlay rendered in `app/layout.tsx` above `{children}`. Uses `sessionStorage` key `"loader_shown"` — if set, renders nothing immediately. On first visit:

### Beat 1 (0–0.6s): Name reveal
`UMYAL DIXIT` split into individual `<span>` characters. Each letter animates in with `opacity: 0→1` and `y: 12→0` with a stagger of `0.05s` per character. Font: Syne Black, large (clamp 48px–96px), centered.

### Beat 2 (0.6–1.2s): Orange line sweep
A `1px` tall `#E85002` line animates `width: 0%→100%` across the full viewport width, positioned just below the name. Duration 0.5s, ease `easeInOut`.

### Beat 3 (1.2–1.8s): Curtain wipe exit
The entire overlay animates `y: 0→-100%` (slides upward off screen) over 0.6s with `ease: [0.76, 0, 0.24, 1]` (sharp cubic bezier — cinematic feel). The hero is fully rendered beneath and becomes visible as the curtain lifts.

After exit animation completes, the loader sets `sessionStorage.loader_shown = "1"` and unmounts via `AnimatePresence`.

### Accessibility
`aria-hidden="true"` on the loader — it's decorative. `prefers-reduced-motion` check: if set, skip the loader entirely (set sessionStorage and exit immediately).

---

## 5. Hero Entry Sequence (`components/hero-scene.tsx`)

All elements start at `opacity: 0` (or offset position). After the loader curtain lifts (~1.8s from page load), `heroReady` state becomes true and triggers the sequence. Each element uses `animate={heroReady ? "visible" : "hidden"}` with a Framer Motion `variants` object.

| Element | Entry animation | Delay |
|---------|----------------|-------|
| Blueprint grid | `opacity: 0→1` | 0s |
| Reticle rings | `scale: 0→1, opacity: 0→1` (spring, stiffness 80) | 0.1s |
| Corner labels | `opacity: 0→1, x: ±20→0` (from their edge) | 0.2s |
| Particles | `opacity: 0→1, scale: 0.5→1` staggered | 0.3s |
| Avatar | `opacity: 0→1, y: 40→0` | 0.4s |
| Name (ScrambleText) | Scramble triggers | 0.7s |
| Tagline | `opacity: 0→1` | 1.1s |
| Scroll indicator | `opacity: 0→1` | 1.3s |

`heroReady` is lifted from `HeroScene` to `LandingPage` as a prop or via a context. The loader triggers it via a callback after its exit animation completes.

---

## 6. Character Scramble (`components/scramble-text.tsx`)

### Props
```tsx
interface ScrambleTextProps {
  text: string;
  trigger: boolean;       // starts scramble when true
  className?: string;
  staggerMs?: number;     // ms between each char resolving (default: 30)
  scrambleDuration?: number; // ms each char scrambles before resolving (default: 400)
}
```

### Behavior
- Characters pulled from: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&`
- Each character slot independently runs through random chars via `setInterval` at 40ms
- Characters resolve left→right: char 0 resolves at `staggerMs * 0`, char 1 at `staggerMs * 1`, etc.
- Spaces are preserved — they never scramble, they're just rendered as-is
- Once `trigger` becomes `true`, the effect runs once and stops — no repeat
- If `trigger` goes from `true` back to `false`, resets to original text (for re-triggering)
- Uses `useEffect` with cleanup — all intervals cleared on unmount

### Usage in hero
```tsx
<ScrambleText
  text="UMYAL DIXIT"
  trigger={heroReady}
  className="font-display font-black text-5xl md:text-7xl tracking-tighter uppercase text-white"
/>
```

---

## 7. Bento Grid Enhancements (`components/landing-page.tsx`)

### TiltCard (`components/tilt-card.tsx`)

Wrapper component. On `mousemove`:
1. Calculates cursor position relative to card center: `dx = (x - centerX) / (width/2)`, `dy = (y - centerY) / (height/2)`
2. Applies: `rotateY = dx * maxDeg`, `rotateX = -dy * maxDeg`
3. Uses Framer Motion `useSpring` for both rotation values (`stiffness: 300, damping: 30`)
4. On `mouseleave`: springs both back to 0

Props:
```tsx
interface TiltCardProps {
  children: React.ReactNode;
  maxDeg?: number;   // default 8, center avatar card uses 4
  className?: string;
}
```

Parent container must have `style={{ perspective: "800px" }}` — added to the grid wrapper in `landing-page.tsx`.

### Cursor Spotlight

A single `div` absolutely positioned over the entire bento grid:
```tsx
<div
  className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
  style={{
    background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(232,80,2,0.06), transparent 70%)`,
    opacity: isHovered ? 1 : 0,
  }}
/>
```

`mouseX/mouseY` updated via `onMouseMove` on the grid container. `isHovered` true while cursor is inside the grid. No spring — direct position update for instant response.

---

## 8. Timing Summary (First Load)

```
0ms     — Page renders (loader overlays hero)
0ms     — Beat 1: "UMYAL DIXIT" letters stagger in
600ms   — Beat 2: Orange line sweeps
1200ms  — Beat 3: Curtain lifts (0.6s wipe)
1800ms  — Hero entry sequence begins
1800ms  — Grid, reticles, corner labels start fading in
2100ms  — Avatar rises
2500ms  — Name scramble fires
2900ms  — Tagline appears
3100ms  — Scroll indicator appears
```

Total time to fully loaded hero: ~3.5s. Premium but not sluggish.

---

## 9. `prefers-reduced-motion` Handling

- Loader: skip entirely (set sessionStorage and unmount)
- Hero entry: all elements start at `opacity: 1`, no y/scale offsets
- Scramble: show final text immediately, no scramble
- Tilt: disable (cards stay flat)
- Spotlight: keep (it's not motion, it's ambient light)

---

## 10. Performance Notes

- Loader uses `will-change: transform` on the curtain div
- TiltCard uses `transform` only (no layout properties) — GPU composited
- Spotlight uses `background` which doesn't trigger layout
- ScrambleText uses `setInterval` — intervals are always cleaned up
- No new Three.js / WebGL instances added in this spec
