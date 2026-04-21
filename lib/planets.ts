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
    size: 2.2,
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
    size: 1.5,
    position: [-3, 0.5, 5],
  },
  {
    id: 'genco',
    name: 'Genco',
    slug: 'genco',
    color: '#4ECDC4',
    glowColor: '#45B7D1',
    bgColor: '#051A18',
    tagline: 'Anonymous chat for real conversations.',
    size: 1.2,
    position: [4, -0.5, 10],
  },
  {
    id: 'ai-learning',
    name: 'AI Learning',
    slug: 'ai-learning',
    color: '#FFD166',
    glowColor: '#FFAA33',
    bgColor: '#1A1400',
    tagline: 'Real-time AI tutors that adapt to every learner.',
    size: 1.1,
    position: [-2.5, 1.0, 15],
  },
  {
    id: 'design-system',
    name: 'Design System',
    slug: 'design-system',
    color: '#E8E8E8',
    glowColor: '#AAAAAA',
    bgColor: '#0A0A0A',
    tagline: 'A precise, minimal component system.',
    size: 1.0,
    position: [3.5, -1.0, 20],
  },
]

// Camera starts close enough to see all planets — Sukku (z=0) is 20 units away on arrival
export const CAMERA_START_Z = 20
export const CAMERA_END_Z = 3
