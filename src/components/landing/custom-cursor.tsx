"use client"
import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf: number;
    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top  = my + 'px';
      }
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top  = ry + 'px';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 8, height: 8, borderRadius: '50%',
        background: 'hsl(9,100%,50%)', pointerEvents: 'none',
        transform: 'translate(-50%,-50%)', mixBlendMode: 'screen',
        zIndex: 9999,
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 32, height: 32, borderRadius: '50%',
        border: '1px solid rgba(204,0,255,0.45)', pointerEvents: 'none',
        transform: 'translate(-50%,-50%)', zIndex: 9998,
        transition: 'width 0.25s, height 0.25s',
      }} />
    </>
  );
}