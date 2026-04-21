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
