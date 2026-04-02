"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const ROTATION_LIMITS = {
  hero: { maxY: 0.4, maxX: 0.2 },
  card: { maxY: 0.15, maxX: 0.08 },
} as const;

interface AvatarMeshProps {
  mode: "hero" | "card";
  interactive: boolean;
}

function AvatarMesh({ mode, interactive }: AvatarMeshProps) {
  const headRef = useRef<THREE.Mesh>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const headGeom = useMemo(() => {
    const geom = new THREE.OctahedronGeometry(0.55, 1);
    geom.applyMatrix4(new THREE.Matrix4().makeScale(1.15, 1.0, 0.9));
    return geom;
  }, []);

  useEffect(() => {
    return () => { headGeom.dispose(); };
  }, [headGeom]);

  useFrame(({ pointer, clock }) => {
    const { maxY, maxX } = ROTATION_LIMITS[mode];
    if (interactive) {
      targetRotation.current.y = pointer.x * maxY;
      targetRotation.current.x = -pointer.y * maxX;
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.05);
      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.05);
      if (headRef.current) {
        headRef.current.rotation.y = currentRotation.current.y;
        headRef.current.rotation.x = currentRotation.current.x;
      }
      const eyeShift = currentRotation.current.y * 0.08;
      if (leftEyeRef.current) leftEyeRef.current.position.x = -0.18 + eyeShift;
      if (rightEyeRef.current) rightEyeRef.current.position.x = 0.18 + eyeShift;
    }
    // Card idle bob always runs (outside the interactive guard)
    if (mode === "card" && headRef.current) {
      headRef.current.rotation.y = Math.sin(clock.elapsedTime) * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={headRef} geometry={headGeom}>
        <meshPhongMaterial color="#E85002" flatShading shininess={10} />
      </mesh>

      <mesh ref={leftEyeRef} position={[-0.18, 0.08, 0.44]}>
        <planeGeometry args={[0.1, 0.06]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh ref={rightEyeRef} position={[0.18, 0.08, 0.44]}>
        <planeGeometry args={[0.1, 0.06]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.22, 0.3, 0.2]} />
        <meshPhongMaterial color="#1a0800" flatShading />
      </mesh>

      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[1.1, 0.15, 0.35]} />
        <meshPhongMaterial color="#0f0f1a" flatShading />
      </mesh>
    </group>
  );
}

interface AvatarSceneProps {
  mode?: "hero" | "card";
  interactive?: boolean;
}

export default function AvatarScene({
  mode = "hero",
  interactive = true,
}: AvatarSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} color="#fff5e0" />
      <pointLight position={[2, 3, 2]} intensity={1.2} color="#fff5e0" />
      <pointLight position={[-1, -2, 1]} intensity={0.6} color="#E85002" />
      <AvatarMesh mode={mode} interactive={interactive} />
    </Canvas>
  );
}
