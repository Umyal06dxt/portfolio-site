# Portfolio v3 — Design Spec
**Date:** 2026-04-01
**Author:** Umyal Dixit
**Goal:** Awwwards-level creative engineering portfolio with an interactive 3D avatar, new pages (About, Blog, Contact), and a full-viewport hero entry experience.

---

## 1. Goals & Audience

The site must serve three audiences simultaneously:
- **Recruiters / hiring managers** — clear identity, showcased work, easy contact
- **Freelance clients** — services implied, personality visible, contact friction-free
- **Personal brand / community** — expressive design, blog presence, memorable aesthetic

Success = a visitor remembers the site after closing it.

---

## 2. Tech Stack

No new dependencies required. All work uses what's already installed:

| Tool | Use |
|------|-----|
| Next.js 16 + React 19 | Routing, SSR, page structure |
| Three.js + @react-three/fiber | 3D avatar, hero scene |
| Framer Motion | Scroll animations, page transitions |
| Tailwind CSS v4 | Layout, utility styles |
| TypeScript | All files |

---

## 3. Design Language (unchanged)

- **Background:** `#050505`
- **Accent:** `#E85002` (orange)
- **Text:** `#ffffff` + `rgba(255,255,255,0.4–0.6)` for secondary
- **Border:** `rgba(255,255,255,0.08–0.1)`
- **Display font:** Syne (uppercase, heavy, tracked tight)
- **Mono font:** Courier New / system mono (labels, tags, terminal text)
- **Aesthetic:** Dark brutalist × tech terminal × creative studio

---

## 4. Home Page (`/`)

### Phase 1 — Hero (first load, 0% scroll)

Full-viewport dark scene. Elements:

- **Nav bar** (fixed, top): `U.DIXIT` logo · Home · Projects · About · Blog · Gallery · `[Contact]` CTA button
- **Blueprint grid background:** faint `rgba(255,255,255,0.03)` 44px grid
- **Concentric reticle rings:** two `rgba(232,80,2,0.25)` circles, slowly pulsing, centered on avatar
- **Ambient particles:** 6–8 small orange dots scattered across viewport
- **Corner data labels:** top-left `UMYAL.DEV / ◆ LIVE`, top-right `EST. 2024 / v3.0`, bottom-left `DELHI, IN / HH:MM:SS` (live clock), bottom-right `CREATIVE / ENGINEER`
- **3D Avatar** (center): low-poly geometric head, eyes track cursor in real-time
- **Name + tagline** (below avatar): `UMYAL DIXIT` in Syne black, `// Creative Engineer · Delhi, IN · Open to Work` in mono
- **Scroll indicator** (bottom center): `SCROLL` label + animated orange line + pulsing dot

### Phase 2 — Bento Grid (50–100% scroll progress)

Scroll triggers the existing zoom-out animation. Changes:
- Avatar smoothly shrinks and transitions into the center bento card
- The `DistortImageCanvas` component in the center card is **replaced** by the 3D avatar component (smaller, static/idle)
- All other bento cards (contact links, gallery, projects, about strip) fade in as before
- Bottom row ("BRIDGING CHAOS & LOGIC") remains unchanged

---

## 5. 3D Avatar — Technical Design

### Geometry

Built entirely in Three.js — no external `.glb`/`.fbx` file.

```
Head: Modified OctahedronGeometry or custom BufferGeometry
  - ~16–20 flat-shaded triangular faces
  - Proportions: slightly wider than tall (human-ish)
  - Eye planes: two flat rectangular meshes inset into the face
  - Orange (#E85002) as primary color with darker facet shading
  - MeshPhongMaterial (flat shading) for the low-poly faceted look
  - Neck: BoxGeometry, dark (#1a0800)
  - Shoulders: BoxGeometry, very dark (#0f0f1a) with thin orange top edge

Lighting:
  - AmbientLight (low intensity, warm white)
  - PointLight at top-right (warm, creates face shading)
  - PointLight near bottom (orange tint, mimics glow-orange CSS effect)
```

### Mouse Tracking (Head Look-Around)

In hero mode (full viewport):
- On `mousemove`, calculate normalized cursor position `(x, y)` relative to viewport center
- Rotate head mesh: `head.rotation.y = lerp(current, targetX * 0.4, 0.05)` per frame
- Rotate head mesh: `head.rotation.x = lerp(current, -targetY * 0.2, 0.05)` per frame
- Eye planes shift laterally within sockets to amplify the "looking" effect
- Smooth lerp so motion feels organic, not mechanical

In bento card mode (small):
- Same logic but reduced rotation range (±0.15 rad instead of ±0.4)
- Idle animation: slow subtle head bob (sin wave on Y rotation)

### Component API

```tsx
<AvatarScene
  mode="hero" | "card"     // controls size + rotation range
  interactive={true}       // enables mouse tracking
/>
```

`AvatarScene` wraps a `<Canvas>` from `@react-three/fiber`. The inner `Avatar` mesh component handles geometry, materials, and the useFrame loop.

File: `components/avatar-scene.tsx`

---

## 6. New Pages

### `/about`

**Layout:** Two-column split.

**Left column** (narrower, dark bg `#080808`):
- Section tag: `// Identity`
- Low-poly avatar (same component, `mode="card"`, non-interactive or subtle idle)
- Stats row: `3+ Years · 12+ Projects · 5+ Clients`
- Tech stack chips with SVG brand icons: React, Next.js, Three.js, Python, Node.js, Tailwind, WebGL/GLSL, Figma, MongoDB, AI/LLMs

**Right column**:
- Section tag: `// Who I Am`
- Big headline: `ENGINEER WITH A DESIGNER'S HEART.` (orange on "DESIGNER'S")
- Bio paragraph in mono style
- Timeline section with entries, each showing year · title · description · inline tech stack badges with brand icons

### `/blog`

**Layout:** Hero header + masonry-style card grid.

**Hero:**
- `WORDS FROM THE TERMINAL.` heading (Syne, bold, orange on "TERMINAL.")
- Row of floating tech icon chips below heading

**Grid:** `grid-template-columns: 1.4fr 1fr 1fr`
- Featured post: tall card spanning 2 rows, larger image area
- Remaining posts: standard cards
- Each card: image area (gradient bg with relevant tech icon) · tech icon tags · title · date + read time · `Read More →`

Blog posts are static data for now (no CMS). Structure supports adding a CMS later.

### `/contact`

**Layout:** Two-column split.

**Left column** (`#080808`):
- Large background text: `SAY HELLO` (very faint stroke, decorative)
- `SAY HELLO.` heading (orange on "HELLO.")
- Availability badge: `◆ Available for Work`
- Row of tech icons (React, Three.js, Next.js, Python, Figma)
- Social links with brand icons: LinkedIn, X/Twitter, Email

**Right column:**
- Contact form: Name · Email · Subject (dropdown hint) · Message · `SEND_MESSAGE [↗]` button
- Form submits to a Next.js API route (`/api/contact`) using Resend (free tier) for email delivery

---

## 7. Existing Pages — Polishing

### `/projects` (Netflix UI)
- Add consistent nav bar (currently missing)
- Replace placeholder images with real project screenshots when available
- No structural changes

### `/gallery` (Pinterest masonry)
- No structural changes
- Ensure nav bar is consistent

---

## 8. Navigation

A shared `<Navbar>` component used across all pages:

```
Left:   U.DIXIT logo (links to /)
Center: Home · Projects · About · Blog · Gallery
Right:  [Contact] — orange bordered button
```

On scroll: background transitions from transparent → `rgba(5,5,5,0.9)` + `backdrop-blur`.

File: `components/navbar.tsx`

---

## 9. Site-Wide Improvements

- Add `.gitignore` entry for `.superpowers/`
- No additional 3D libraries needed — avatar is built with raw Three.js + @react-three/fiber only
- All pages use the shared `<Navbar>`
- Consistent page transitions via Framer Motion `AnimatePresence`

---

## 10. Implementation Phases

### Phase 1 — Foundation
- Build `<Navbar>` component
- Integrate navbar into all existing pages

### Phase 2 — 3D Avatar
- Build `AvatarScene` component with low-poly geometry
- Implement mouse-tracking head rotation
- Integrate into home page hero (replace current hero text area)
- Integrate into bento center card (replace `DistortImageCanvas`)

### Phase 3 — Home Page Hero
- Build full-viewport hero scene (grid bg, particles, reticles, corner labels, scroll indicator)
- Wire scroll transition: hero → bento grid

### Phase 4 — New Pages
- Build `/about`
- Build `/blog`
- Build `/contact` (with form API route)

### Phase 5 — Polish
- Page transitions
- Mobile responsiveness pass
- Performance audit (Three.js canvas sizing, pixel ratio)
