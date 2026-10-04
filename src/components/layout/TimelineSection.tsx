"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { Heart, MapPin, Coffee, Camera } from "lucide-react";

interface TimelineItem {
  id: string;
  date: string;
  titlePlaceholder: string;
  categoryPlaceholder: string;
  bodyPlaceholder: string;
  icon: React.ReactNode;
}

const PLACEHOLDER_MILESTONES: TimelineItem[] = [
  {
    id: "1",
    date: "Date Placeholder 1",
    titlePlaceholder: "Our First Encounter",
    categoryPlaceholder: "Where It All Began",
    bodyPlaceholder: "A beautiful space for you to write about how you first met, what the weather was like, or what your initial thoughts were. Keep it authentic and memorable.",
    icon: <Coffee className="w-5 h-5 text-primary" />,
  },
  {
    id: "2",
    date: "Date Placeholder 2",
    titlePlaceholder: "The First Official Date",
    categoryPlaceholder: "Making It Official",
    bodyPlaceholder: "Add the story of your first official date here. Where did you go? What did you eat? Write down the small details that make you smile when looking back.",
    icon: <Heart className="w-5 h-5 text-primary" />,
  },
  {
    id: "3",
    date: "Date Placeholder 3",
    titlePlaceholder: "Our First Adventure Together",
    categoryPlaceholder: "Explorers in Love",
    bodyPlaceholder: "Share the memories of your first trip or significant adventure together. The road trips, flights, lost paths, and beautiful sunsets you witnessed side by side.",
    icon: <MapPin className="w-5 h-5 text-primary" />,
  },
  {
    id: "4",
    date: "Date Placeholder 4",
    titlePlaceholder: "A Major Milestone",
    categoryPlaceholder: "Growing Together",
    bodyPlaceholder: "Record any other special milestone here: moving in together, getting a pet, starting a joint project, or simply a day that changed everything for both of you.",
    icon: <Camera className="w-5 h-5 text-primary" />,
  },
];

export function TimelineSection() {
  return (
    <section id="story" className="py-24 relative overflow-hidden bg-bg-primary/30">
      {/* Background glow node */}
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-text-primary">
            Our Love Story
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto">
            A chronological look back at the moments that shaped our journey together.
          </p>
        </div>

        {/* Timeline Path: a rail on the left (mobile) / centre (md+), with cards alternating sides in a 2-col grid */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-4 md:left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-primary/25 to-transparent dark:via-primary/15"
          />

          <div className="space-y-10 md:space-y-14">
          {PLACEHOLDER_MILESTONES.map((item, index) => {
            const isEven = index % 2 === 0;
            // Even cards sit in the left column (text-right), odd cards in the right column
            const alignmentClass = isEven ? "md:text-right" : "md:col-start-2 md:text-left";

            return (
              <div key={item.id} className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-x-16">
                {/* Timeline Node Icon Pin */}
                <div className="absolute top-5 left-4 md:left-1/2 -translate-x-1/2 bg-bg-secondary border border-border-custom shadow-md w-8 h-8 rounded-full flex items-center justify-center z-10">
                  {item.icon}
                </div>

                {/* Animated Cards */}
                <ScrollAnimate
                  preset={isEven ? "fade-right" : "fade-left"}
                  className={alignmentClass}
                >
                  <Card hoverEffect className="relative p-5 md:p-6">
                    {/* Date Badge */}
                    <div className="inline-block bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3">
                      {item.date}
                    </div>

                    <h3 className="text-base font-bold text-text-primary">
                      {item.titlePlaceholder}
                    </h3>
                    <h4 className="text-xs font-semibold text-text-secondary mt-1">
                      {item.categoryPlaceholder}
                    </h4>

                    <p className="text-[13px] md:text-sm text-text-secondary leading-relaxed mt-3 border-t border-border-custom/25 pt-3">
                      {item.bodyPlaceholder}
                    </p>
                  </Card>
                </ScrollAnimate>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
