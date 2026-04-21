# Portfolio v4 — Space Universe Design Spec
**Date:** 2026-04-21
**Status:** Approved

---

## One-Line Thesis

This portfolio is not a list of projects. It is a playable artifact of how I think.

---

## Core Metaphor

| Element | Meaning |
|---|---|
| Universe | Me |
| Planets | Projects — each with its own character, size, visual identity |
| Navigation | Piloting, not clicking |
| UFO | The visitor's vehicle |
| Entering a planet | Zooming into atmosphere, not loading a page |

The metaphor is non-negotiable and internally consistent throughout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, current version in repo) |
| 3D | React Three Fiber + `@react-three/drei` + `@react-three/postprocessing` |
| Styling | Tailwind v4 (already configured) |
| 2D animation | Framer Motion (already installed) |
| 3D animation | R3F `useFrame` + `useSpring` |
| Deployment | Vercel at dixitumyal.com |
| Contact API | Resend (`RESEND_API_KEY`, unchanged) |

**New dependencies to add:**
- `@react-three/drei`
- `@react-three/postprocessing`

---

## Architecture — Approach B (Hybrid Canvas + Next.js Pages)

The galaxy (`/`) is a full-screen R3F canvas. Clicking a planet triggers a cinematic zoom animation, then crossfades to a real Next.js route (`/projects/[slug]`). Planet interiors are clean HTML pages. One button zooms back out.

### File Structure

```
app/
├── page.tsx                      ← full-screen R3F galaxy canvas
├── layout.tsx                    ← fonts + metadata updated
├── globals.css                   ← new space palette, no cyberpunk utilities
├── projects/
│   ├── sukku/page.tsx            ← planet interior (full content)
│   ├── emotion-ai/page.tsx       ← planet interior (full content)
│   ├── genco/page.tsx            ← planet interior (stub)
│   ├── ai-learning/page.tsx      ← planet interior (stub)
│   └── design-system/page.tsx   ← planet interior (stub)
├── about/page.tsx                ← "coming soon" stub
├── blog/page.tsx                 ← "coming soon" stub
├── gallery/page.tsx              ← "coming soon" stub
├── contact/page.tsx              ← restyled, Resend API intact
└── api/contact/route.ts          ← UNTOUCHED

components/
├── galaxy/
│   ├── scene.tsx                 ← R3F Canvas root, camera rig, star field
│   ├── planet.tsx                ← planet mesh + glow + label
│   ├── ufo.tsx                   ← UFO mesh, mouse-tracking parallax
│   └── zoom-transition.tsx       ← camera animation + crossfade to page
├── planet-interior/
│   ├── layout.tsx                ← shared wrapper: back button, entrance anim
│   └── exit-transition.tsx       ← zoom back out effect
└── ui/
    └── coming-soon.tsx           ← shared stub for phase 2 pages
```

---

## Color System

**Primary:** Orange (`#FF6B2B`) — Sukku's identity color, used for accents throughout
**Background:** `#050505` (near-black, unchanged from v3)
**Text:** `#ffffff`
**Each planet has its own color temperature:**

| Planet | Primary Color | Character |
|---|---|---|
| Sukku | `#FF6B2B` orange + amber halo | Largest, warmest, slow pulse |
| Emotion AI | `#4A90E2` electric blue + violet edge | Dense, layered, engineered |
| Genco | `#4ECDC4` soft green + constellation cluster | Light, social, connected |
| AI Learning | `#FFD166` warm yellow | Approachable, radiating |
| Design System | Cold white + grey grid lines | Minimal, geometric |

**Fonts:** Syne (headings, already installed) + Manrope (body, already installed). No monospace anywhere.

---

## Galaxy Scene — Home Page

### Canvas Setup
- Full-viewport R3F canvas, no scroll bar, `#050505` background
- Camera: perspective, positioned far back on Z-axis, 15–25° tilt for depth
- `<Stars>` from drei: ~3000 stars, slow rotation (0.02 rad/s), two depth layers for parallax

### Scroll-Driven Camera Flight
Scroll progress (0→1) maps to camera Z position via `useScroll` from drei:

```
0%   — camera far back, all planets tiny in the distance
50%  — mid-galaxy, Emotion AI and Genco clearly visible
90%  — close to Sukku, fills ~40% viewport, orange glow dominant
```

Planets are depth-staggered along Z-axis (not flat orbital ring):
```
[Camera] → stars → Genco → AI Learning → Design Sys → Emotion AI → [SUKKU — deepest]
```

Sukku is always visible ahead — gravitational pull made visual.

### UFO
- Fixed in lower-center of viewport (does not scroll with camera)
- Procedural mesh: flat cylinder body + dome + two fin boxes (~200 triangles)
- Color: `#1a1a2e` dark metallic + thin orange rim light
- Mouse tracking: ±8° tilt on X/Y, lerped smoothly
- Idle: slow sine-wave vertical bob

### Planet Labels
- On hover: planet name fades in below — Manrope, 12px, 80% opacity, white
- No tooltip cards, no description boxes

### HUD Elements
- Bottom-left: `"Umyal Dixit · Creative Engineer · Delhi, IN · Open to Work"` — Manrope, 11px, 40% opacity
- Bottom-right: LinkedIn, X, Email — three minimal icon dots, expand to label on hover
- No navbar. No version stamp. No scroll prompts.

---

## Signature Transition (Highest Priority)

The zoom from galaxy into planet interior is the defining interaction. Build this first, before anything else.

### Phase 1 — Approach (0–400ms)
Camera accelerates forward along Z toward clicked planet. Starts slow, peaks mid-way, slight overshoot. `useSpring` tension 120, friction 14. UFO stays fixed (parallax speed sensation). Other planets blur slightly via depth-of-field (`@react-three/postprocessing`).

### Phase 2 — Fill (400–700ms)
Planet fills ~80% of viewport. Surface shader becomes visible. Glow halo bleeds to screen edges. Background color begins shifting from `#050505` toward planet's interior color.

### Phase 3 — Dissolve (700–900ms)
Canvas fades to planet's background color. At ~750ms, `router.push('/projects/[slug]')` fires.

### Phase 4 — Interior Reveal (900ms–1200ms)
Planet interior page fades in from planet color. Content appears with staggered entrance. Feels like atmosphere entry — not a page load.

### Exit (Back to Galaxy)
- Top-left: `"← orbit"` — Manrope, small, no icon
- Reverse sequence: interior fades to planet color → canvas fades in close to planet → camera pulls back to mid-galaxy

**Total transition time: ~1.2 seconds.**

---

## Planet Interiors

### Shared Layout
```
[Planet color background — muted, desaturated]
[← orbit]                    [planet name, small, top-right]

[Hero statement — one line, large, Syne]

[What it is]
[Why I built it]
[What's technically interesting]
[Demo / video / link]
```

Max 3 scroll screens per planet. No sidebars. No cards.

### Sukku — `background: #1A0A00`
> *"An AI that doesn't just respond — it understands, remembers, and lives alongside you."*

Content sections:
1. What it is: companion system, not assistant — emotional + environmental awareness
2. Why I built it: reactive tools vs. proactive presence
3. Technical: memory architecture, hybrid local/cloud privacy model, multimodal input (face, voice, context)
4. Status: software complete, hardware incoming — teaser for embodied version
5. CTA: GitHub / demo link

### Emotion AI — `background: #060D1A`
> *"Multimodal emotion recognition — video, audio, text — at 98% accuracy."*

Content sections:
1. What it is: real-time emotion detection across modalities
2. Why I built it: foundation for Sukku's emotional awareness layer
3. Technical: PyTorch pipeline, multimodal fusion approach, AWS deployment
4. Demo: video embed / link
5. CTA: GitHub / live demo

### Genco, AI Learning, Design System
Phase 1 stubs — same layout shell, one paragraph, "full case study coming" note.

---

## Planets to Add in Phase 1

| Planet | Status | Interior |
|---|---|---|
| Sukku | Full content | ✓ |
| Emotion AI | Full content | ✓ |
| Genco | Stub | — |
| AI Learning | Stub | — |
| Design System | Stub | — |

---

## Fallbacks

### Reduced Motion (`prefers-reduced-motion: reduce`)
No canvas. Static page: clean dark grid of project cards, same content, same typography, zero animation. Handled via Tailwind `motion-safe:` / `motion-reduce:` utilities.

### Mobile
Canvas renders. Scroll-driven flight replaced with tap-to-explore map view: planets as a zoomable 2D grid, colored circles with names. Tap triggers zoom transition to interior. Metaphor survives, performance protected.

### No-JS
`<noscript>` block: plain HTML project list — title, description, link per project. Navigable without any styling.

---

## Performance Targets

- 60fps on mid-range laptop
- Time to first interaction ≤ 2s on decent connection
- Lighthouse performance ≥ 85
- Procedural shaders only — no texture files for planet surfaces
- Canvas deferred — first paint is static dark background
- `<AdaptiveDpr />` and `<Preload />` from drei for runtime performance management
- Target <2MB JS bundle (Stars + 5 planets + UFO + shaders)

---

## Build Order

**Follow this exactly. Do not skip ahead.**

1. **Signature transition** — one planet + zoom-in + planet interior. Nothing else. If this doesn't feel magical in isolation, the rest won't save it.
2. **Galaxy** — remaining planets, scroll-driven flight, orbital depth arrangement
3. **UFO** — mesh, mouse tracking, parallax
4. **Ambient polish** — stars, depth-of-field, glow, color grading
5. **Fallbacks** — reduced-motion, mobile map view, no-JS list

---

## Phase 1 Definition of Done

- [ ] Deep-space landing with scroll-driven camera flight
- [ ] UFO navigator with mouse parallax and idle bob
- [ ] 5 planets: Sukku (hero), Emotion AI, Genco, AI Learning, Design System
- [ ] Smooth cinematic zoom transition into planet interior
- [ ] Sukku and Emotion AI interiors with real content
- [ ] Genco, AI Learning, Design System as stubs
- [ ] Exit gesture returns to galaxy at mid-flight position
- [ ] `/about`, `/blog`, `/gallery` as "coming soon" stubs
- [ ] `/contact` restyled with Resend API intact
- [ ] Desktop: full experience
- [ ] Mobile: map view fallback
- [ ] Reduced-motion: static grid fallback
- [ ] No-JS: plain HTML list
- [ ] Deployed to Vercel at dixitumyal.com

---

## What This Is NOT

- Not a marketing site
- Not a dashboard
- Not a "cool space effects" showcase
- Not a game, even though it is playful
- Not the complete v4 — Blog, Gallery, About are Phase 2
