'use client'

import { useRef, useState, useEffect } from 'react'
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
  const innerAtmoRef = useRef<THREE.Mesh>(null)
  const outerGlowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isHero = planet.id === 'sukku'

  useEffect(() => {
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHero ? 0.05 : 0.09)
    }
    if (outerGlowRef.current) {
      const pulse = 1 + Math.sin(t * 0.6 + planet.position[0]) * 0.06
      outerGlowRef.current.scale.setScalar(pulse)
    }
    if (innerAtmoRef.current) {
      const mat = innerAtmoRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hovered ? 0.22 : 0.1 + Math.sin(t * 0.4) * 0.03
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03
    }
  })

  return (
    <group position={planet.position}>
      {/* Wide soft outer glow — bloom target */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[planet.size * 2.2, 16, 16]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={hovered ? 0.18 : 0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Tight inner atmosphere */}
      <mesh ref={innerAtmoRef}>
        <sphereGeometry args={[planet.size * 1.12, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.12}
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
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.9 : 0.55}
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Sukku only — orbital ring */}
      {isHero && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0.2, 0]}>
          <torusGeometry args={[planet.size * 1.7, 0.04, 8, 80]} />
          <meshBasicMaterial color="#FF8C42" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Always-visible name label (not just on hover) */}
      <Html
        center
        position={[0, -(planet.size + 0.6), 0]}
        style={{ pointerEvents: 'none' }}
      >
        <p
          style={{
            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
            fontSize: isHero ? '13px' : '10px',
            fontFamily: 'Manrope, sans-serif',
            letterSpacing: '0.18em',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease',
            fontWeight: isHero ? '500' : '400',
          }}
        >
          {planet.name}
        </p>
      </Html>
    </group>
  )
}
