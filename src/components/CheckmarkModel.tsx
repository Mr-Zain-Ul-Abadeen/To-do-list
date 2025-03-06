import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CheckmarkModel({ 
  isCompleted, 
  position = [0, 0, 0] 
}: { 
  isCompleted: boolean; 
  position?: [number, number, number] 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = useRef(0.3);
  const floatRadius = useRef(1);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
  
      meshRef.current.position.x = position[0] + Math.cos(time * 0.5) * floatRadius.current;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.7) * floatRadius.current * 0.5;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.3) * floatRadius.current * 0.3;
      
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.y = time * rotationSpeed.current;
      meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.1;
      
      
      if (isCompleted) {
        const pulseScale = 1 + Math.sin(time * 2) * 0.2;
        meshRef.current.scale.setScalar(pulseScale);
      } else {
        meshRef.current.scale.setScalar(0.8);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1, 0.2, 32, 64]} />
      <meshStandardMaterial
        color={isCompleted ? "#10B981" : "#6366F1"}
        metalness={0.9}
        roughness={0.1}
        emissive={isCompleted ? "#10B981" : "#6366F1"}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}