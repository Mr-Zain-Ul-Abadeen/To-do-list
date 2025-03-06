import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
}

export function ExplosionParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);

  const particles = useMemo(() => {
    const temp: Particle[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * (0.5 + Math.random() * 0.5),
        Math.sin(angle) * (0.5 + Math.random() * 0.5),
        (Math.random() - 0.5) * 2
      );

      temp.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity,
        scale: 0.2 + Math.random() * 0.3,
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !active) {
      startTime.current = null;
      return;
    }

    if (startTime.current === null) {
      startTime.current = state.clock.getElapsedTime();
    }

    const matrix = new THREE.Matrix4();
    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 2; 

    if (elapsed > duration) {
      meshRef.current.visible = false;
      return;
    }

    particles.forEach((particle, i) => {
      const progress = elapsed / duration;
      const position = particle.position.clone();
      const velocity = particle.velocity.clone();

 
      position.x += velocity.x * elapsed * 10;
      position.y += velocity.y * elapsed * 10;
      position.z += velocity.z * elapsed * 10;

      position.x += Math.sin(elapsed * 5 + i) * 0.2;
      position.y += Math.cos(elapsed * 5 + i) * 0.2;

  
      const scale = particle.scale * (1 - progress);

      matrix.makeRotationFromEuler(particle.rotation);
      matrix.setPosition(position);
      matrix.scale(new THREE.Vector3(scale, scale, scale));

      meshRef.current.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.visible = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
      <dodecahedronGeometry args={[0.2]} />
      <meshStandardMaterial
        color="#6366F1"
        metalness={0.8}
        roughness={0.2}
        emissive="#6366F1"
        emissiveIntensity={2}
      />
    </instancedMesh>
  );
}