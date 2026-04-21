'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@/lib/planets'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uEmissive;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = smoothstep(0.,1.,fract(p));
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main() {
    // Animated surface texture
    float n = noise(vUv * 5.0 + vec2(uTime * 0.012, 0.0)) * 0.35 + 0.65;
    float n2 = noise(vUv * 12.0 - vec2(uTime * 0.008)) * 0.15 + 0.85;

    // Fresnel rim (atmosphere edge)
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);

    // Directional light
    vec3 light = normalize(vec3(4.0, 6.0, 8.0));
    float diff = max(dot(vNormal, light), 0.0) * 0.65 + 0.35;

    vec3 base = uColor * n * n2 * diff;
    vec3 emis = uColor * uEmissive;
    vec3 rim  = uColor * fresnel * 1.8;

    gl_FragColor = vec4(base + emis + rim, 1.0);
  }
`

type Props = {
  planet: PlanetType
  onClick: () => void
}

export function Planet({ planet, onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isHero = planet.id === 'sukku'

  useEffect(() => { return () => { document.body.style.cursor = 'auto' } }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y += delta * (isHero ? 0.04 : 0.08)
    if (matRef.current) matRef.current.uniforms.uTime.value = t
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 0.5 + planet.position[0]) * 0.05
      glowRef.current.scale.setScalar(pulse)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hovered ? 0.22 : 0.1
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.025
  })

  const uniforms = useRef({
    uColor: { value: new THREE.Color(planet.color) },
    uTime: { value: 0 },
    uEmissive: { value: isHero ? 0.5 : 0.35 },
  })

  return (
    <group position={planet.position}>
      {/* Tight glow — 1.5x only, feeds bloom */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Planet body with custom shader */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
        />
      </mesh>

      {/* Sukku orbital ring */}
      {isHero && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0.15, 0]}>
          <torusGeometry args={[planet.size * 1.6, 0.03, 8, 100]} />
          <meshBasicMaterial color="#FF8C42" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Planet label */}
      <Html
        center
        position={[0, -(planet.size + 0.55), 0]}
        style={{ pointerEvents: 'none' }}
      >
        <p style={{
          color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
          fontSize: isHero ? '12px' : '10px',
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '0.2em',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
          fontWeight: 500,
        }}>
          {planet.name}
        </p>
      </Html>
    </group>
  )
}
