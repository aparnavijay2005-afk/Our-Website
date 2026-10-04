"use client";

import React, { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number; // px per 60fps frame; negative floats upward (click bursts)
  opacity: number;
  drift: number;
  driftSpeed: number;
  rotation: number;
  rotationSpeed: number;
  rgb: string;
}

// Hearts are tuned in "60fps frames"; scaling by elapsed time keeps the same speed on 120/144Hz screens.
const FRAME_MS = 1000 / 60;
const MAX_FRAME_STEP = 3; // clamp so a backgrounded tab doesn't teleport hearts on return
const MAX_AMBIENT_HEARTS = 20;
const MAX_TOTAL_HEARTS = 70; // cap including click bursts so rapid clicking can't pile up hearts

const COLORS = [
  "219, 39, 119",   // pink-600
  "244, 63, 94",    // rose-500
  "251, 113, 133",  // rose-400
  "252, 165, 180",  // rose-300
  "251, 191, 36",   // amber-400 (warm gold sparkles)
];

export function FallingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let lastTime = performance.now();
    let width = window.innerWidth;
    let height = window.innerHeight;
    const hearts: Heart[] = [];

    // Size the backing store for the device pixel ratio so hearts stay crisp on retina screens
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create a new heart. `depth` (0 = far, 1 = near) drives size, speed and opacity so the field feels layered.
    const createHeart = (x?: number, y?: number, sizeScale = 1): Heart => {
      const depth = Math.random();
      const size = (6 + depth * 12) * sizeScale;
      return {
        x: x !== undefined ? x : Math.random() * width,
        y: y !== undefined ? y : -size - 10,
        size,
        speed: 0.6 + depth * 1.1 + Math.random() * 0.3,
        opacity: 0.25 + depth * 0.4,
        drift: Math.random() * 2,
        driftSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        rgb: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    // Initialize initial hearts distributed vertically
    for (let i = 0; i < MAX_AMBIENT_HEARTS * 0.6; i++) {
      const heart = createHeart();
      heart.y = Math.random() * height;
      hearts.push(heart);
    }

    // Draw a single heart path
    const drawHeart = (c: CanvasRenderingContext2D, h: Heart) => {
      const { size } = h;
      c.save();
      c.translate(h.x, h.y);
      c.rotate(h.rotation);
      c.fillStyle = `rgba(${h.rgb}, ${h.opacity})`;
      c.beginPath();
      // Draw heart via cubic bezier curves
      c.moveTo(0, -size / 4);
      c.bezierCurveTo(-size / 2, -size * 0.7, -size, -size * 0.2, 0, size * 0.7);
      c.bezierCurveTo(size, -size * 0.2, size / 2, -size * 0.7, 0, -size / 4);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Click burst handler
    const handleWindowClick = (e: MouseEvent) => {
      // Spawn a burst of 4-7 hearts on click
      const burstCount = Math.floor(Math.random() * 4) + 4;
      for (let i = 0; i < burstCount && hearts.length < MAX_TOTAL_HEARTS; i++) {
        // Spawn slightly offset from pointer
        const px = e.clientX + (Math.random() - 0.5) * 40;
        const py = e.clientY + (Math.random() - 0.5) * 40;
        const heart = createHeart(px, py, 1.2);
        // Make click burst hearts float upwards instead of down, a touch brighter than ambient ones
        heart.speed = -(Math.random() * 2 + 1.5);
        heart.opacity = Math.min(0.75, heart.opacity + 0.15);
        hearts.push(heart);
      }
    };

    window.addEventListener("click", handleWindowClick);

    // Animation Loop
    const animate = (now: number) => {
      const step = Math.min((now - lastTime) / FRAME_MS, MAX_FRAME_STEP);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Add ambient hearts if density is low
      if (hearts.length < MAX_AMBIENT_HEARTS && Math.random() < 0.03 * step) {
        hearts.push(createHeart());
      }

      // Loop backward to safely remove out-of-bound hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];

        // Update positions
        h.y += h.speed * step;
        h.drift += h.driftSpeed * step;
        h.x += Math.sin(h.drift) * 0.4 * step;
        h.rotation += h.rotationSpeed * step;

        // Render heart
        drawHeart(ctx, h);

        // Remove conditions: off-bottom, off-top (for click burst) or off the sides
        const isOffBottom = h.y > height + h.size;
        const isOffTop = h.speed < 0 && h.y < -h.size - 20;
        const isOffSides = h.x < -h.size || h.x > width + h.size;

        if (isOffBottom || isOffTop || isOffSides) {
          hearts.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
