'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@/lib/planets'

type Props = {
  planet: PlanetType
  onClick: () => void
}

export function Planet({ planet, onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.0008) * 0.04
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={planet.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={hovered ? 0.25 : 0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.5 : 0.25}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html
          center
          position={[0, -(planet.size + 0.4), 0]}
          style={{ pointerEvents: 'none' }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '11px',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            {planet.name}
          </p>
        </Html>
      )}
    </group>
  )
}
