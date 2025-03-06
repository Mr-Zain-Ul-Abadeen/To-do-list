import { create } from 'zustand';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';

interface MouseState {
  x: number;
  y: number;
  setPosition: (x: number, y: number) => void;
}

const useMouseStore = create<MouseState>((set) => ({
  x: 0,
  y: 0,
  setPosition: (x, y) => set({ x, y }),
}));

export function MousePosition() {
  const setPosition = useMouseStore((state) => state.setPosition);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setPosition(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setPosition]);

  return null;
}

export const useMousePosition = () => {
  const x = useMouseStore((state) => state.x);
  const y = useMouseStore((state) => state.y);
  return { x, y };
};