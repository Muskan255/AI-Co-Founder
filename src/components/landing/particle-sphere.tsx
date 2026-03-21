
"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Particle Creation (Fibonacci Sphere)
    const COUNT = 2000;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const R = 2.3; // Sphere radius

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const p = 2 * Math.PI * i / phi;
      
      pos[i * 3]     = R * Math.sin(theta) * Math.cos(p);
      pos[i * 3 + 1] = R * Math.sin(theta) * Math.sin(p);
      pos[i * 3 + 2] = R * Math.cos(theta);

      // Color mapping: magenta → red-orange → gold
      const nx = (pos[i * 3] / R + 1) / 2;
      const ny = (pos[i * 3 + 1] / R + 1) / 2;
      const t = nx;
      
      const r = t < 0.5 ? (0.5 + t * 1.0) : 1.0;
      const g = t < 0.5 ? (t * 0.3 * ny) : (t - 0.5) * 1.3 * ny;
      const b = t < 0.5 ? ((1 - t) * 0.95 * (1 - ny * 0.6)) : 0;

      col[i * 3]     = Math.min(1, r);
      col[i * 3 + 1] = Math.min(1, g);
      col[i * 3 + 2] = Math.min(1, b);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    // ── Glow Texture (The soft bloom)
    const tc = document.createElement('canvas');
    tc.width = tc.height = 64;
    const ctx2d = tc.getContext('2d')!;
    const grad = ctx2d.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,    'rgba(255,255,255,1)');       // bright white center
    grad.addColorStop(0.25, 'rgba(255,230,180,0.85)');    // warm halo
    grad.addColorStop(0.55, 'rgba(255,100,50,0.25)');     // orange fade
    grad.addColorStop(1,    'rgba(0,0,0,0)');             // transparent edge
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, 64, 64);

    const mat = new THREE.PointsMaterial({
      size: 0.075, 
      map: new THREE.CanvasTexture(tc),
      vertexColors: true, 
      transparent: true,
      depthWrite: false, 
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true, 
      opacity: 0.95,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // ── Interaction State
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMouseMove = (e: MouseEvent) => {
      tx = ((e.clientY / window.innerHeight) - 0.5) * 0.7;
      ty = ((e.clientX / window.innerWidth)  - 0.5) * 0.7;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let bt = 0; // Breath timer
    let cancelled = false;

    const loop = () => {
      if (cancelled) return;
      requestAnimationFrame(loop);

      const t = clock.getElapsedTime();
      bt += 0.006; // Increment breath timer

      // Smooth mouse lerp (0.035 factor)
      cx += (tx - cx) * 0.035;
      cy += (ty - cy) * 0.035;

      // Continuous rotation & wobble
      pts.rotation.y = t * 0.16 + cy;
      pts.rotation.x = cx * 0.4 + Math.sin(t * 0.1) * 0.05;

      // Breathing pulse (±1.5% oscillation)
      const br = 1 + Math.sin(bt) * 0.015;
      pts.scale.setScalar(br);

      renderer.render(scene, camera);
    };

    loop();

    return () => {
      cancelled = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none bg-transparent" />;
}
