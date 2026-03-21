"use client"

import React, { useEffect, useRef } from 'react';

export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let cancelled = false;

    // Dynamic import — guarantees no SSR crash
    import('three').then((THREE) => {
      if (cancelled || !containerRef.current) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        58, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      camera.position.z = 5;

      const COUNT = 2000;
      const pos = new Float32Array(COUNT * 3);
      const col = new Float32Array(COUNT * 3);
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const R = 2.3;

      for (let i = 0; i < COUNT; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / COUNT);
        const p = 2 * Math.PI * i / goldenRatio;

        pos[i * 3]     = R * Math.sin(theta) * Math.cos(p);
        pos[i * 3 + 1] = R * Math.sin(theta) * Math.sin(p);
        pos[i * 3 + 2] = R * Math.cos(theta);

        const nx = (pos[i * 3] / R + 1) / 2;
        const ny = (pos[i * 3 + 1] / R + 1) / 2;
        const t = nx;

        col[i * 3]     = Math.min(1, t < 0.5 ? 0.5 + t : 1.0);
        col[i * 3 + 1] = Math.min(1, t < 0.5 ? t * 0.3 * ny : (t - 0.5) * 1.3 * ny);
        col[i * 3 + 2] = Math.min(1, t < 0.5 ? (1 - t) * 0.95 * (1 - ny * 0.6) : 0);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

      // Glow texture
      const tc = document.createElement('canvas');
      tc.width = tc.height = 64;
      const ctx = tc.getContext('2d')!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0,    'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,230,180,0.85)');
      g.addColorStop(0.55, 'rgba(255,100,50,0.25)');
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);

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

      // Scroll state
      const scroll = { progress: 0 };
      const sv = { scale: 1, offsetX: 0, speed: 0.16, opacity: 0.95 };
      const onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        if (max > 0) scroll.progress = Math.min(window.scrollY / max, 1);
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // Mouse state — object ref avoids stale closure
      const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.tx = ((e.clientY / window.innerHeight) - 0.5) * 0.7;
        mouse.ty = ((e.clientX / window.innerWidth)  - 0.5) * 0.7;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      let bt = 0;

      const loop = () => {
        if (cancelled) return;
        requestAnimationFrame(loop);

        const t  = clock.getElapsedTime();
        const sp = scroll.progress;
        bt += 0.006;

        // Scroll-driven lerp targets
        sv.scale   += ((1.0 - sp * 0.65) - sv.scale)   * 0.06;
        sv.offsetX += ((sp * 2.8)         - sv.offsetX) * 0.06;
        sv.speed   += ((0.16 + sp * 0.55) - sv.speed)   * 0.06;
        sv.opacity += (
          (sp > 0.7 ? 1 - ((sp - 0.7) / 0.3) * 0.85 : 0.95) - sv.opacity
        ) * 0.06;

        // Mouse lerp BEFORE use
        mouse.cx += (mouse.tx - mouse.cx) * 0.035;
        mouse.cy += (mouse.ty - mouse.cy) * 0.035;

        pts.rotation.y = t * sv.speed + mouse.cy;
        pts.rotation.x = mouse.cx * 0.4 + Math.sin(t * 0.1) * 0.05;
        pts.scale.setScalar(sv.scale * (1 + Math.sin(bt) * 0.015));
        pts.position.x = sv.offsetX;
        mat.opacity    = Math.max(0, sv.opacity);

        renderer.render(scene, camera);
      };

      loop();

      // Store cleanup inside the then() scope
      const cleanup = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };

      // Attach cleanup to cancelled check
      (containerRef.current as any).__threeCleanup = cleanup;
    });

    return () => {
      cancelled = true;
      const el = containerRef.current as any;
      if (el?.__threeCleanup) {
        el.__threeCleanup();
        delete el.__threeCleanup;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}  // explicit style beats Tailwind z-0 specificity issues
    />
  );
}