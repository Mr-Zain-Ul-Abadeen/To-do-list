import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from './MousePosition';

interface Orb {
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  scale: number;
  speed: number;
  phase: number;
}

export function InteractiveOrbs({ count = 12 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mousePos = useMousePosition();
  
  const orbs = useMemo(() => {
    const temp: Orb[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 5;

      temp.push({
        position: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        basePosition: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        scale: 0.2 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const time = state.clock.getElapsedTime();

    orbs.forEach((orb, i) => {
      const targetX = mousePos.x * 8;
      const targetY = mousePos.y * 8;
      
      // Calculate distance to mouse
      const dx = targetX - orb.position.x;
      const dy = targetY - orb.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move towards mouse with spring effect
      orb.position.x += (dx / distance) * 0.1 * orb.speed;
      orb.position.y += (dy / distance) * 0.1 * orb.speed;
      
      // Return to base position with spiral motion
      const spiralX = orb.basePosition.x + Math.cos(time * 0.5 + orb.phase) * 2;
      const spiralY = orb.basePosition.y + Math.sin(time * 0.5 + orb.phase) * 2;
      const spiralZ = orb.basePosition.z + Math.cos(time * 0.3 + orb.phase) * 1;
      
      orb.position.x += (spiralX - orb.position.x) * 0.03;
      orb.position.y += (spiralY - orb.position.y) * 0.03;
      orb.position.z += (spiralZ - orb.position.z) * 0.03;

      matrix.makeTranslation(
        orb.position.x,
        orb.position.y,
        orb.position.z
      );
      
      // Pulsating scale effect
      const pulseScale = orb.scale * (1 + Math.sin(time * 2 + orb.phase) * 0.2);
      matrix.scale(new THREE.Vector3(pulseScale, pulseScale, pulseScale));
      
      meshRef.current.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#6366F1"
        metalness={0.9}
        roughness={0.1}
        emissive="#6366F1"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  );
}