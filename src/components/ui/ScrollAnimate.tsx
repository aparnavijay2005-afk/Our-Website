"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

type AnimationPreset = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "fade";

interface ScrollAnimateProps {
  children: React.ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  duration?: number;
  threshold?: number; // 0 to 1 for triggering animation
  className?: string;
}

export function ScrollAnimate({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  className = "",
}: ScrollAnimateProps) {
  // Reduced-motion users are handled app-wide by <MotionConfig reducedMotion="user"> in page.tsx
  // (transforms are skipped, opacity still fades). Branching on matchMedia during render here would
  // make the server and first client render differ and cause a hydration mismatch.

  // Animation variants
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: preset === "fade-up" ? 30 : preset === "fade-down" ? -30 : 0,
      x: preset === "fade-left" ? 30 : preset === "fade-right" ? -30 : 0,
      scale: preset === "zoom-in" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth custom easeOutExpo
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
