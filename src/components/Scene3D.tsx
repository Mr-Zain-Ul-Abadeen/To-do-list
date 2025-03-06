import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { CheckmarkModel } from './CheckmarkModel';
import { InteractiveOrbs } from './InteractiveOrbs';
import { MousePosition } from './MousePosition';
import { DecorativeElements } from './DecorativeElements';
import { ExplosionParticles } from './ExplosionParticles';

export function Scene3D({ completedTasks, total }: { completedTasks: number; total: number }) {
  const isComplete = total > 0 && completedTasks === total;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 5, 20]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366F1" />
        
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <DecorativeElements />
        
        <group position={[0, 0, -2]}>
          <CheckmarkModel isCompleted={completedTasks > 0} position={[3, 2, 0]} />
          <InteractiveOrbs count={12} />
          <ExplosionParticles active={isComplete} />
        </group>
        
        <MousePosition />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}