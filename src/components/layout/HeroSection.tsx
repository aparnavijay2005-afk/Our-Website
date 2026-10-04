"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useMusic } from "@/context/MusicContext";
import { asset } from "@/lib/asset";
import { Heart, Play, Calendar, Image as ImageIcon, Sparkles } from "lucide-react";

function HeroPhoto({ src, slot, isVideo }: { src: string; slot: string; isVideo?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "auto";
      video.oncanplay = () => setLoaded(true);
      video.onerror = () => setLoaded(false);
      video.src = src;
      video.load();
    } else {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setLoaded(false);
      img.src = src;
    }
  }, [src, isVideo]);

  return (
    <>
      {loaded ? (
        isVideo ? (
          <video src={src} autoPlay muted loop playsInline className="w-full h-[80%] rounded-2xl object-cover" />
        ) : (
          <img src={src} alt="" className="w-full h-[80%] rounded-2xl object-cover" />
        )
      ) : (
        <div className="w-full h-[80%] rounded-2xl bg-primary/5 dark:bg-primary/10 border border-dashed border-primary/20 flex flex-col items-center justify-center text-primary/40 text-center px-4">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Photo Placeholder</span>
          <span className="text-[9px] mt-1 opacity-70">{slot}</span>
        </div>
      )}
      <div className="h-[15%] flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold text-text-secondary font-mono">{slot}</span>
        <Heart className="w-3.5 h-3.5 text-primary/40 fill-primary/10" />
      </div>
    </>
  );
}

export function HeroSection() {
  const { togglePlay, isPlaying } = useMusic();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background radial soft light gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-4xl bg-primary/5 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left: Text & Action Callout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 text-center lg:text-left space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Shared Journey</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-tight text-text-primary"
          >
            Every Moment <br className="hidden md:inline" />
            <span className="text-primary relative inline-block">
              With You
              <svg
                className="absolute left-0 bottom-[-8px] w-full h-3 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,10 100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            Is Special
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Welcome to our private digital scrapbook. This space holds our milestones, 
            anniversaries, and beautiful memories. Created together, for each other.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md"
              onClick={() => {
                const el = document.getElementById("timer");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Timer
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto hover:border-primary/50"
              onClick={togglePlay}
            >
              <Play className={`w-4 h-4 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
              {isPlaying ? "Pause Music" : "Listen Together"}
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Premium Interactive Collage Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative flex justify-center items-center h-[350px] md:h-[450px]"
        >
          {/* Decorative frame elements forming a dynamic collage */}
          
          {/* Card 1: Main Photo Slot (Top Left offset) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute left-6 top-8 w-44 md:w-56 aspect-[3/4] bg-bg-secondary dark:bg-bg-secondary border border-border-custom/60 rounded-3xl p-3 shadow-xl transform rotate-[-4deg] flex flex-col justify-between"
          >
            <HeroPhoto src={asset("/images/hero/1.mp4")} slot="Slot 01" isVideo />
          </motion.div>

          {/* Card 2: Secondary Photo Slot (Bottom Right offset) */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            className="absolute right-6 bottom-8 w-40 md:w-48 aspect-[1/1] bg-bg-secondary dark:bg-bg-secondary border border-border-custom/60 rounded-3xl p-3 shadow-xl transform rotate-[6deg] flex flex-col justify-between"
          >
            <HeroPhoto src={asset("/images/hero/2.jpeg")} slot="Slot 02" />
          </motion.div>

          {/* Ring backdrop element */}
          <div className="absolute w-72 h-72 rounded-full border border-primary/10 dark:border-primary/5 -z-20 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
