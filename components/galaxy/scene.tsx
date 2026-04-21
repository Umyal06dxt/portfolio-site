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
  startX: number
  startY: number
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
    startX: 0,
    startY: 0,
  })

  useFrame((_, delta) => {
    if (zoom.current.active && zoom.current.target) {
      zoom.current.progress = Math.min(1, zoom.current.progress + delta * 1.1)
      const t = easeInOutCubic(zoom.current.progress)
      const targetZ = zoom.current.target.position[2] + 3
      camera.position.z = zoom.current.startZ + (targetZ - zoom.current.startZ) * t
      camera.position.x = zoom.current.startX + (zoom.current.target.position[0] - zoom.current.startX) * t
      camera.position.y = zoom.current.startY + (zoom.current.target.position[1] - zoom.current.startY) * t
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
      startX: camera.position.x,
      startY: camera.position.y,
    }
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
