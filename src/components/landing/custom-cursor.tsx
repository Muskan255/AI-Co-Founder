
"use client"

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { damping: 25, stiffness: 200 });
  const springY = useSpring(0, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [springX, springY]);

  return (
    <>
      <motion.div 
        className="fixed z-[9999] w-2 h-2 rounded-full bg-primary pointer-events-none mix-blend-screen"
        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      />
      <motion.div 
        className="fixed z-[9998] w-8 h-8 rounded-full border border-secondary/45 pointer-events-none"
        style={{ left: springX, top: springY, transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
