"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { asset } from "@/lib/asset";
import { Camera, Image as ImageIcon, Heart, Sparkles, Map, Film, Expand } from "lucide-react";

interface GalleryItem {
  id: string;
  category: string;
  titlePlaceholder: string;
  icon: React.ReactNode;
  imageSrc: string;
  isVideo: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    category: "Dates",
    titlePlaceholder: "Romantic Dinner Date",
    icon: <Heart className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/1.jpeg"),
    isVideo: false,
  },
  {
    id: "2",
    category: "Travels",
    titlePlaceholder: "Our Travel Highlights",
    icon: <Map className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/2.mp4"),
    isVideo: true,
  },
  {
    id: "3",
    category: "Sunsets",
    titlePlaceholder: "Warm Evening Skies",
    icon: <Sparkles className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/3.mp4"),
    isVideo: true,
  },
  {
    id: "4",
    category: "Silly Faces",
    titlePlaceholder: "Fun & Laughs Together",
    icon: <Camera className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/4.mp4"),
    isVideo: true,
  },
  {
    id: "5",
    category: "Anniversaries",
    titlePlaceholder: "Celebrating Milestones",
    icon: <Film className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/5.jpeg"),
    isVideo: false,
  },
  {
    id: "6",
    category: "Bowling Days",
    titlePlaceholder: "Bowling Nights",
    icon: <ImageIcon className="w-6 h-6 text-primary/40" />,
    imageSrc: asset("/images/gallery/6.jpeg"),
    isVideo: false,
  },
];

function GalleryImage({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only play while on screen: saves CPU/battery and bandwidth with several autoplaying clips on the page
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [hasError]);

  if (hasError) {
    return (
      <div className="w-full h-[78%] rounded-xl bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center px-4 transition-all duration-300 group-hover:bg-primary/10">
        {item.icon}
        <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/60 mt-2 block">
          Add Your Media
        </span>
        <span className="text-[8px] text-text-secondary opacity-70 mt-1 block">
          Place in public/images/gallery/{item.id}{item.isVideo ? ".mp4" : ".jpeg"}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full h-[78%] rounded-xl overflow-hidden relative cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
      aria-label={`View ${item.titlePlaceholder}`}
    >
      {/* Shimmer skeleton: sits behind the media and is simply covered once pixels arrive */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-primary/10 bg-[linear-gradient(110deg,transparent_30%,var(--border-custom)_50%,transparent_70%)] bg-[length:200%_100%] motion-safe:animate-shimmer"
      />
      {item.isVideo ? (
        <video
          ref={videoRef}
          src={item.imageSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setHasError(true)}
        />
      ) : (
        <img
          src={item.imageSrc}
          alt={item.titlePlaceholder}
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setHasError(true)}
        />
      )}
      {/* Hover/focus affordance is driven by the card (`group`), not by hovering the tiny icon itself */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-focus-within:bg-black/20 transition-colors duration-300 flex items-center justify-center rounded-xl">
        <span className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 scale-90 group-hover:scale-100 group-focus-within:scale-100 transition-all duration-300 p-2 rounded-full bg-white/25 backdrop-blur-sm text-white">
          <Expand className="w-5 h-5" />
        </span>
      </div>
    </button>
  );
}

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems: LightboxItem[] = GALLERY_ITEMS.map((item) => ({
    src: item.imageSrc,
    isVideo: item.isVideo,
    caption: `${item.category} — ${item.titlePlaceholder}`,
  }));

  return (
    <section id="memories" className="py-24 relative overflow-hidden bg-bg-secondary/20">
      {/* Background radial glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-text-primary">
            Our Memory Album
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto">
            A digital frame collection of your favorite captured moments.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <ScrollAnimate
              key={item.id}
              preset="zoom-in"
              delay={index * 0.05}
              threshold={0.1}
            >
              <Card
                hoverEffect
                className="group relative overflow-hidden aspect-[4/3] flex flex-col justify-between p-4 border border-border-custom/40"
              >
                <GalleryImage item={item} onClick={() => setLightboxIndex(index)} />

                {/* Footer text */}
                <div className="h-[18%] flex items-center justify-between px-1">
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-text-primary mt-0.5 block truncate max-w-[200px]">
                      {item.titlePlaceholder}
                    </span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-primary/30 group-hover:text-primary group-hover:fill-primary/20 transition-all duration-300" />
                </div>
              </Card>
            </ScrollAnimate>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
