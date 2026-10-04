"use client";

import React from "react";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { TimelineSection } from "@/components/layout/TimelineSection";
import { GallerySection } from "@/components/layout/GallerySection";
import { BestGirlfriendSection } from "@/components/layout/BestGirlfriendSection";
import { Footer } from "@/components/layout/Footer";
import { RelationshipTimer } from "@/components/interactive/RelationshipTimer";
import { FallingHearts } from "@/components/interactive/FallingHearts";
import { ParticleBackground } from "@/components/interactive/ParticleBackground";
import { MusicPlayer } from "@/components/interactive/MusicPlayer";
import { MusicProvider } from "@/context/MusicContext";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
    <MusicProvider>
      {/* Interactive Background Canvas Layers */}
      <ParticleBackground />
      <FallingHearts />

      {/* Main Layout Navigation */}
      <Navbar />

      {/* Core Layout Containers */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Relationship Timer Section */}
        <section id="timer" className="py-24 relative overflow-hidden bg-bg-secondary/10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/3 rounded-full blur-[100px] pointer-events-none -z-10" />
          <ScrollAnimate preset="fade-up" duration={0.8}>
            <RelationshipTimer startDate="2025-02-02" />
          </ScrollAnimate>
        </section>

        {/* Timeline Story Section */}
        <TimelineSection />

        {/* Photo Memories Gallery Section */}
        <GallerySection />

        {/* Best Girlfriend Award Finale */}
        <BestGirlfriendSection startDate="2025-02-02" />
      </main>

      {/* Global Music Player Trigger */}
      <MusicPlayer />

      {/* Footer Content */}
      <Footer />
    </MusicProvider>
    </MotionConfig>
  );
}
