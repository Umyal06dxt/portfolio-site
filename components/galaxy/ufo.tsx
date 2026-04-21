'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Ufo() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Lerp rotation toward mouse (max ±8 degrees = ~0.14 radians)
    const maxRot = 0.14
    targetRotation.current.x += (mouse.current.y * maxRot - targetRotation.current.x) * 4 * delta
    targetRotation.current.y += (mouse.current.x * maxRot - targetRotation.current.y) * 4 * delta

    groupRef.current.rotation.x = targetRotation.current.x
    groupRef.current.rotation.y = targetRotation.current.y

    // Idle vertical bob
    groupRef.current.position.y = -1.8 + Math.sin(Date.now() * 0.0008) * 0.08
  })

  return (
    // Fixed forward of camera — position z=48 keeps it just inside camera's near clip plane
    <group ref={groupRef} position={[0, -1.8, 18]}>
      {/* Disc body */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.1} metalness={0.9} transparent opacity={0.9} />
      </mesh>

      {/* Orange rim light ring */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.48, 0.025, 8, 32]} />
        <meshBasicMaterial color="#FF6B2B" />
      </mesh>

      {/* Left fin */}
      <mesh position={[-0.6, -0.03, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.2, 0.04, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Right fin */}
      <mesh position={[0.6, -0.03, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.2, 0.04, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}
