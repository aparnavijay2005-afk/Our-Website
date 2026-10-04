"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseSpeedY: number;
  speedX: number;
  opacity: number;
  twinkleSpeed: number;
  phase: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Graceful exit if client prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId = 0;
    let lastTime = performance.now();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let seededWidth = -1;

    const FRAME_MS = 1000 / 60;
    const MAX_FRAME_STEP = 3;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile browsers fire resize as the URL bar shows/hides; only re-seed when the width really changed
      if (width !== seededWidth) {
        seededWidth = width;
        initParticles();
      }
    };

    const getParticleCount = () => {
      // Scale count based on screen width
      if (width < 768) {
        return 18; // Mobile-friendly density
      }
      return 40;  // Desktop density
    };

    const initParticles = () => {
      const count = getParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
          baseSpeedY: -(Math.random() * 0.15 + 0.05), // Slowly drift upwards
          speedX: (Math.random() - 0.5) * 0.1, // Drifts slightly sideways
          opacity: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const animate = (now: number) => {
      // Scale motion by elapsed time so speed is identical on 60Hz and 120/144Hz screens
      const step = Math.min((now - lastTime) / FRAME_MS, MAX_FRAME_STEP);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render background gradient if canvas was transparent, but here we just render
      // particles on top of our existing CSS backgrounds.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position (drift upwards)
        p.y += p.baseSpeedY * step;
        p.x += p.speedX * step;
        p.phase += p.twinkleSpeed * step;

        // Reset if drifted off screen top or sides
        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -5 || p.x > width + 5) {
          p.x = p.x < -5 ? width + 5 : -5;
        }

        // Twinkle opacity calculation
        const currentOpacity = Math.max(0.05, p.opacity + Math.sin(p.phase) * 0.2);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft yellow-gold glow for particles
        ctx.fillStyle = `rgba(251, 191, 36, ${currentOpacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Observer to pause animation loop when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
