import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Element {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  speed: number;
  type: 'cross' | 'circle' | 'diamond';
}

export function DecorativeElements() {
  const crossRef = useRef<THREE.InstancedMesh>(null);
  const circleRef = useRef<THREE.InstancedMesh>(null);
  const diamondRef = useRef<THREE.InstancedMesh>(null);

  const elements = useMemo(() => {
    const temp: Element[] = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
    
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      temp.push({
        position,
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: 0.2 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.3,
        type: ['cross', 'circle', 'diamond'][Math.floor(Math.random() * 3)] as Element['type']
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const matrix = new THREE.Matrix4();

    elements.forEach((element, i) => {
    
      const position = element.position.clone();
      position.x += Math.sin(time * element.speed + i) * 0.5;
      position.y += Math.cos(time * element.speed + i) * 0.5;
      position.z += Math.sin(time * element.speed * 0.5 + i) * 0.3;

      
      const rotation = element.rotation.clone();
      rotation.x += time * element.speed * 0.2;
      rotation.y += time * element.speed * 0.3;

    
      matrix.makeRotationFromEuler(rotation);
      matrix.setPosition(position);
      matrix.scale(new THREE.Vector3(element.scale, element.scale, element.scale));

    
      if (element.type === 'cross' && crossRef.current) {
        crossRef.current.setMatrixAt(i, matrix);
      } else if (element.type === 'circle' && circleRef.current) {
        circleRef.current.setMatrixAt(i, matrix);
      } else if (element.type === 'diamond' && diamondRef.current) {
        diamondRef.current.setMatrixAt(i, matrix);
      }
    });

    if (crossRef.current) crossRef.current.instanceMatrix.needsUpdate = true;
    if (circleRef.current) circleRef.current.instanceMatrix.needsUpdate = true;
    if (diamondRef.current) diamondRef.current.instanceMatrix.needsUpdate = true;
  });

  const crossCount = elements.filter(e => e.type === 'cross').length;
  const circleCount = elements.filter(e => e.type === 'circle').length;
  const diamondCount = elements.filter(e => e.type === 'diamond').length;

  return (
    <group>
      <instancedMesh ref={crossRef} args={[undefined, undefined, crossCount]}>
        <group>
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <boxGeometry args={[0.1, 0.5, 0.1]} />
        </group>
        <meshStandardMaterial
          color="#4F46E5"
          metalness={0.8}
          roughness={0.2}
          emissive="#4F46E5"
          emissiveIntensity={0.2}
        />
      </instancedMesh>

      <instancedMesh ref={circleRef} args={[undefined, undefined, circleCount]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#6366F1"
          metalness={0.8}
          roughness={0.2}
          emissive="#6366F1"
          emissiveIntensity={0.2}
        />
      </instancedMesh>

      <instancedMesh ref={diamondRef} args={[undefined, undefined, diamondCount]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#818CF8"
          metalness={0.8}
          roughness={0.2}
          emissive="#818CF8"
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  );
}