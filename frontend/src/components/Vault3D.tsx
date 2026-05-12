"use client";
import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 100, 200]} scale={1.2}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function FloatingCube() {
  const cubeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
    cubeRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
  });

  return (
    <mesh ref={cubeRef} rotation={[45, 45, 45]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#818cf8" wireframe />
    </mesh>
  );
}

export default function Vault3D() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-[500px]" />;

  return (
    <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
           <AnimatedSphere />
           <FloatingCube />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
