'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

export function StarField() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.005
      groupRef.current.rotation.x += delta * 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {/* Far star layer — slow, dense */}
      <Stars
        radius={150}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0}
      />
      {/* Near star layer — slightly brighter */}
      <Stars
        radius={80}
        depth={30}
        count={800}
        factor={2}
        saturation={0.1}
        fade
        speed={0}
      />
    </group>
  )
}
