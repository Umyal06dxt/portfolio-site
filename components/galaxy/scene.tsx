'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { Planet } from './planet'
import { Ufo } from './ufo'
import { StarField } from './star-field'
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
  const { camera, gl, scene } = useThree()
  const scroll = useScroll()
  const zoom = useRef<ZoomState>({
    active: false,
    target: null,
    progress: 0,
    startZ: CAMERA_START_Z,
    startX: 0,
    startY: 0,
  })

  // Cinematic tone mapping + fog — run once on mount
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.3
    scene.fog = new THREE.FogExp2('#050505', 0.018)
  }, [gl, scene])

  useFrame((_, delta) => {
    if (zoom.current.active && zoom.current.target) {
      zoom.current.progress = Math.min(1, zoom.current.progress + delta * 1.1)
      const t = easeInOutCubic(zoom.current.progress)
      const targetZ = zoom.current.target.position[2] + 3
      camera.position.z = zoom.current.startZ + (targetZ - zoom.current.startZ) * t
      camera.position.x = zoom.current.startX + (zoom.current.target.position[0] - zoom.current.startX) * t
      camera.position.y = zoom.current.startY + (zoom.current.target.position[1] - zoom.current.startY) * t
    } else {
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
      <StarField />

      {/* Low ambient — planets glow from emissive, not from ambient fill */}
      <ambientLight intensity={0.15} color="#0d1020" />

      {/* Main key light — slightly warm, from upper right */}
      <directionalLight
        position={[8, 6, 10]}
        intensity={1.8}
        color="#ffe8d0"
      />

      {/* Sukku accent — warm orange from below-left, makes it feel like the gravity center */}
      <pointLight position={[-4, -3, 2]} intensity={4.0} color="#FF6B2B" distance={25} />

      {/* Cool fill from opposite side */}
      <pointLight position={[6, 4, -5]} intensity={1.2} color="#3a6fd8" distance={30} />

      {PLANETS.map(planet => (
        <Planet
          key={planet.id}
          planet={planet}
          onClick={() => handlePlanetClick(planet)}
        />
      ))}
      <Ufo />
    </>
  )
}
