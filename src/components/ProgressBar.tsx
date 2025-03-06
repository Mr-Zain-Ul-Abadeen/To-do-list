import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${percentage}%`,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [percentage]);

  return (
    <div className="relative pt-1 px-8">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-200 bg-indigo-500/20">
            Task Progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-indigo-200">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-indigo-500/10">
        <div
          ref={progressRef}
          style={{ width: '0%' }}
          className="flex flex-col justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-lg shadow-indigo-500/30 transition-all duration-500"
        ></div>
      </div>
    </div>
  );
}