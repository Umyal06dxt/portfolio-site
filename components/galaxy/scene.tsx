'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const scrollY = useRef(0)
  const zoom = useRef<ZoomState>({
    active: false,
    target: null,
    progress: 0,
    startZ: CAMERA_START_Z,
    startX: 0,
    startY: 0,
  })

  // Cinematic rendering
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
    scene.fog = new THREE.FogExp2('#050505', 0.012)
  }, [gl, scene])

  // Track native page scroll
  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((_, delta) => {
    if (zoom.current.active && zoom.current.target) {
      zoom.current.progress = Math.min(1, zoom.current.progress + delta * 1.1)
      const t = easeInOutCubic(zoom.current.progress)
      const targetZ = zoom.current.target.position[2] + 3
      camera.position.z = zoom.current.startZ + (targetZ - zoom.current.startZ) * t
      camera.position.x = zoom.current.startX + (zoom.current.target.position[0] - zoom.current.startX) * t
      camera.position.y = zoom.current.startY + (zoom.current.target.position[1] - zoom.current.startY) * t
    } else {
      // Native scroll → camera Z
      const scrollMax = Math.max(1,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const progress = Math.min(1, scrollY.current / scrollMax)
      const targetZ = CAMERA_START_Z - progress * (CAMERA_START_Z - CAMERA_END_Z)

      // Smooth lerp
      camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 4)

      // Subtle upward drift as you fly in
      const targetY = (1 - progress) * 0.8
      camera.position.y += (targetY - camera.position.y) * delta * 2
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

      <ambientLight intensity={0.12} color="#0d1020" />
      <directionalLight position={[8, 6, 10]} intensity={2.0} color="#ffe8d0" />
      <pointLight position={[-3, -2, 5]} intensity={5} color="#FF6B2B" distance={30} />
      <pointLight position={[8, 4, -8]} intensity={1.5} color="#3a6fd8" distance={40} />

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
