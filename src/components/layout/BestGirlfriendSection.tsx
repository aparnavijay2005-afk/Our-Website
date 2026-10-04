"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { Heart, PartyPopper, Sparkles } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  ✏️  Make it yours — change any of the text below!                          */
/* -------------------------------------------------------------------------- */

const HER_NAME = "Appu";
const FROM = "Your favorite person";

const STATS = [
  { emoji: "🌸", label: "Cuteness", value: "off the charts" },
  { emoji: "🧸", label: "Hug Quality", value: "100%" },
  { emoji: "💖", label: "Kindness", value: "∞" },
  { emoji: "😊", label: "Making Me Smile", value: "1000%" },
  { emoji: "🎀", label: "Being My Favorite", value: "undefeated" },
];

const REASONS = [
  "You make ordinary days feel like tiny adventures.",
  "Your smile fixes my worst day in about two seconds.",
  "You're cute even when you're grumpy. Especially then.",
  "You're my favorite person to do absolutely nothing with.",
  "Your hugs are the best place in the whole world.",
  "You make me want to be a better person.",
  "You're the first person I want to tell everything to.",
  "Loving you is the easiest thing I've ever done.",
  "You're the best part of every single day.",
];

/* -------------------------------------------------------------------------- */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2025-02-02" -> "February 2, 2025" (manual formatting avoids timezone/locale drift)
function formatStartDate(startDate: string): string {
  const [y, m, d] = startDate.split("-").map((p) => parseInt(p, 10));
  if (!y || !m || !d || m < 1 || m > 12) return "";
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/* ----------------------------- Little SVG bits ----------------------------- */

function Bow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <path
        d="M32 20 C 20 2, 3 3, 5 20 C 3 37, 20 38, 32 20 Z"
        className="fill-primary"
      />
      <path
        d="M32 20 C 44 2, 61 3, 59 20 C 61 37, 44 38, 32 20 Z"
        className="fill-primary"
      />
      {/* soft highlights on the loops */}
      <path
        d="M10 17 C 14 9, 21 8, 26 15"
        fill="none"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M54 17 C 50 9, 43 8, 38 15"
        fill="none"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* knot */}
      <rect x="26" y="13" width="12" height="14" rx="5" className="fill-primary-hover" />
    </svg>
  );
}

function Medal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bgf-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="bgf-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* ribbon tails */}
      <path d="M36 78 L20 142 L41 129 L53 148 L70 86 Z" fill="url(#bgf-ribbon)" />
      <path d="M84 78 L100 142 L79 129 L67 148 L50 86 Z" fill="url(#bgf-ribbon)" opacity="0.92" />

      {/* medal */}
      <circle cx="60" cy="52" r="46" fill="url(#bgf-gold)" />
      <circle
        cx="60"
        cy="52"
        r="38"
        fill="none"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="52" r="32" fill="#fff1f5" />

      {/* heart */}
      <g transform="translate(60 54) scale(0.78) translate(-60 -52)">
        <path
          d="M60 80 C 18 54, 30 22, 50 26 C 56 27, 60 32, 60 36 C 60 32, 64 27, 70 26 C 90 22, 102 54, 60 80 Z"
          fill="#ec4899"
        />
        <path
          d="M44 36 C 40 36, 36 40, 36 46"
          fill="none"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* tiny shine */}
      <path
        d="M88 28 l2.2 5.8 5.8 2.2 -5.8 2.2 -2.2 5.8 -2.2 -5.8 -5.8 -2.2 5.8 -2.2 z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

function Twinkle({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`motion-safe:animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <path
        d="M12 1 l2.6 8.4 L23 12 l-8.4 2.6 L12 23 l-2.6 -8.4 L1 12 l8.4 -2.6 z"
        fill="currentColor"
      />
    </svg>
  );
}

/* --------------------------------- Confetti -------------------------------- */

const CONFETTI_EMOJI = ["💖", "💗", "🎀", "✨", "⭐", "🌸", "💕"];

interface Piece {
  id: number;
  emoji: string;
  x: number;
  yPeak: number;
  yEnd: number;
  rotate: number;
  delay: number;
  duration: number;
}

interface Burst {
  id: number;
  pieces: Piece[];
}

// Random values live here (called from an event handler, never during render)
function makeBurst(id: number): Burst {
  const pieces: Piece[] = Array.from({ length: 30 }, (_, i) => {
    // fan the pieces upward, then let them drift back down
    const angle = (-165 + Math.random() * 150) * (Math.PI / 180);
    const dist = 90 + Math.random() * 150;
    const yPeak = Math.sin(angle) * dist;
    return {
      id: i,
      emoji: CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)],
      x: Math.cos(angle) * dist,
      yPeak,
      yEnd: yPeak + 150 + Math.random() * 90,
      rotate: (Math.random() - 0.5) * 480,
      delay: Math.random() * 0.15,
      duration: 1.7 + Math.random() * 0.9,
    };
  });
  return { id, pieces };
}

function ConfettiBurst({ burst }: { burst: Burst }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30"
      aria-hidden="true"
    >
      {burst.pieces.map((p) => (
        <motion.span
          key={`${burst.id}-${p.id}`}
          className="absolute -ml-3 -mt-3 block select-none text-xl md:text-2xl"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
          animate={{
            x: [0, p.x * 0.75, p.x],
            y: [0, p.yPeak, p.yEnd],
            opacity: [1, 1, 0],
            scale: [0.3, 1.2, 1],
            rotate: [0, p.rotate / 2, p.rotate],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            times: [0, 0.45, 1],
            ease: "easeOut",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ------------------------------- Section parts ----------------------------- */

function StatBar({
  stat,
  index,
  reduceMotion,
}: {
  stat: (typeof STATS)[number];
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span className="text-text-primary">
          <span className="mr-1.5" aria-hidden="true">
            {stat.emoji}
          </span>
          {stat.label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
          {stat.value}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-pink-300 via-primary to-rose-400"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            delay: reduceMotion ? 0 : index * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </li>
  );
}

function ReasonNote({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [pops, setPops] = useState(0);

  const next = () => {
    setIndex((i) => (i + 1) % REASONS.length);
    setPops((p) => p + 1);
  };

  return (
    <Card className="flex h-full flex-col p-6 md:p-8">
      <h3 className="mb-1 text-center font-cute text-2xl text-primary">
        Why you&apos;re the best
      </h3>
      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
        Reason {index + 1} of {REASONS.length}
      </p>

      {/* Sticky-note */}
      <div className="relative flex min-h-[10rem] flex-1 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
            exit={{ opacity: 0, y: -14, rotate: 3 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 20 }
            }
            className="relative w-full rounded-2xl border border-primary/20 bg-primary/[0.07] px-6 py-7 text-center shadow-md"
            aria-live="polite"
          >
            {/* tape */}
            <span
              className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-primary/25"
              aria-hidden="true"
            />
            <p className="font-serif text-lg font-semibold leading-snug text-text-primary md:text-xl">
              {REASONS[index]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress hearts */}
      <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
        {REASONS.map((_, i) => (
          <Heart
            key={i}
            className={`h-3 w-3 transition-all duration-300 ${
              i <= index
                ? "fill-primary text-primary"
                : "fill-transparent text-primary/30"
            }`}
          />
        ))}
      </div>

      <Button
        variant="secondary"
        size="md"
        className="mt-5 w-full"
        onClick={next}
      >
        <motion.span
          key={pops}
          initial={pops === 0 ? false : { scale: 1.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="mr-2 inline-block"
          aria-hidden="true"
        >
          💌
        </motion.span>
        Tell me another reason
      </Button>
    </Card>
  );
}

/* ---------------------------------- Section -------------------------------- */

interface BestGirlfriendSectionProps {
  /** Date you got together. Format: YYYY-MM-DD */
  startDate?: string;
}

export function BestGirlfriendSection({
  startDate = "2025-02-02",
}: BestGirlfriendSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const medalControls = useAnimationControls();

  const [claimed, setClaimed] = useState(false);
  const [burst, setBurst] = useState<Burst | null>(null);

  // Let the confetti clean itself up
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => setBurst(null), 3400);
    return () => clearTimeout(timer);
  }, [burst]);

  const celebrate = useCallback(() => {
    setClaimed(true);
    if (reduceMotion) return;
    setBurst((prev) => makeBurst((prev?.id ?? 0) + 1));
    medalControls.start({
      rotate: [0, -14, 14, -8, 8, 0],
      scale: [1, 1.18, 1],
      transition: { duration: 0.9, ease: "easeInOut" },
    });
  }, [medalControls, reduceMotion]);

  const since = formatStartDate(startDate);

  return (
    <section
      id="best-girlfriend"
      className="relative overflow-hidden bg-bg-primary/30 py-24"
    >
      {/* Soft background glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[60vw] max-h-[34rem] w-[60vw] max-w-[34rem] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[110px]" />
      <div className="pointer-events-none absolute bottom-10 right-0 -z-10 h-72 w-72 rounded-full bg-accent/[0.06] blur-[100px]" />

      <div className="mx-auto max-w-6xl px-6">
        {/* ------------------------------ Header ------------------------------ */}
        <ScrollAnimate preset="fade-up">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Announcement</span>
            </div>
            <h2 className="mt-5 font-cute text-4xl leading-tight text-primary md:text-6xl">
              World&apos;s Best Girlfriend
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-text-secondary">
              Voted by one very biased judge, who happens to be completely
              correct. <span aria-hidden="true">🎀</span>
            </p>
          </div>
        </ScrollAnimate>

        {/* ---------------------------- Certificate --------------------------- */}
        <ScrollAnimate preset="zoom-in" duration={0.9}>
          <div className="relative mx-auto max-w-3xl">
            {/* Corner bows */}
            <Bow className="absolute -left-4 -top-5 z-20 h-12 w-[4.5rem] -rotate-12 drop-shadow-md md:-left-6 md:h-14 md:w-[5.25rem]" />
            <Bow className="absolute -right-4 -top-5 z-20 h-12 w-[4.5rem] rotate-12 -scale-x-100 drop-shadow-md md:-right-6 md:h-14 md:w-[5.25rem]" />

            <div className="relative rounded-[2rem] border-2 border-primary/30 bg-bg-secondary/70 p-3 shadow-2xl shadow-primary/10 backdrop-blur-md">
              <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-dashed border-primary/40 bg-linear-to-b from-primary/[0.07] via-transparent to-accent/[0.07] px-5 pb-4 pt-10 text-center md:px-14 md:pb-5 md:pt-12">
                {/* Sparkles — a few, not crowded */}
                <Twinkle className="absolute left-[8%] top-[14%] h-4 w-4 text-accent" delay={0} />
                <Twinkle className="absolute right-[9%] top-[22%] h-5 w-5 text-primary/70" delay={0.9} />
                <Twinkle className="absolute bottom-[26%] left-[6%] h-3.5 w-3.5 text-primary/60" delay={1.6} />
                <Twinkle className="absolute bottom-[34%] right-[7%] h-4 w-4 text-accent" delay={0.4} />

                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-text-secondary">
                  Certificate of Extra Special Love
                </p>

                {/* Medal (tap it, too!) */}
                <div className="mx-auto mt-6 w-28 motion-safe:animate-float md:w-32">
                  <motion.button
                    type="button"
                    animate={medalControls}
                    onClick={celebrate}
                    className="block w-full cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    style={{ filter: "drop-shadow(0 10px 14px rgb(219 39 119 / 0.28))" }}
                    aria-label="Celebrate the best girlfriend award"
                  >
                    <Medal className="h-auto w-full" />
                  </motion.button>
                </div>

                <h3 className="mt-5 font-cute text-3xl leading-tight text-primary md:text-5xl">
                  Best Girlfriend
                </h3>
                <p className="mt-2.5 font-serif text-sm italic text-text-secondary md:text-base">
                  in the whole wide world
                </p>

                {/* Divider */}
                <div
                  className="mx-auto my-6 flex max-w-xs items-center gap-3 text-primary/50"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-current" />
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                  <span className="h-px flex-1 bg-current" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  This is to certify that
                </p>

                <div className="relative mx-auto mt-3 inline-block">
                  <span className="font-serif text-4xl font-extrabold tracking-tight text-text-primary md:text-6xl">
                    {HER_NAME}
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full text-primary/35"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,5 Q25,0 50,5 T100,5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-text-primary/85 md:text-base">
                  is hereby awarded the title of{" "}
                  <strong className="font-bold text-primary">
                    Best Girlfriend Ever
                  </strong>{" "}
                  for being the cutest, kindest, funniest, most wonderful person
                  I know, and for making every ordinary day feel like a tiny
                  celebration.
                </p>

                {/* Footer: date / seal / signature */}
                <div className="mt-9 grid grid-cols-3 items-end gap-2 text-center">
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                      Together since
                    </p>
                    <p className="mt-1 border-t border-primary/30 pt-1 font-serif text-xs font-semibold text-text-primary md:text-sm">
                      {since}
                    </p>
                  </div>

                  {/* Wax seal */}
                  <div className="flex justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20 md:h-16 md:w-16">
                      <div className="absolute inset-1.5 rounded-full border border-dashed border-white/50" />
                      <Heart className="h-6 w-6 fill-white text-white md:h-7 md:w-7" />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                      With all my love
                    </p>
                    <p className="mt-1 border-t border-primary/30 pt-1 font-cute text-xs text-primary md:text-sm">
                      {FROM}
                    </p>
                  </div>
                </div>

                <p className="mt-7 text-[10px] uppercase tracking-widest text-text-secondary/80">
                  Valid forever · No refunds · No returns · Non-transferable
                </p>

                {/* Reserved slot for the "Approved" stamp (no layout shift when it lands) */}
                <div className="mt-3 flex h-12 items-center justify-center">
                  <AnimatePresence>
                    {claimed && (
                      <motion.div
                        initial={
                          reduceMotion
                            ? { opacity: 0, rotate: -6 }
                            : { scale: 2.4, opacity: 0, rotate: -24 }
                        }
                        animate={{ scale: 1, opacity: 1, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 260, damping: 14 }}
                        className="rounded-xl border-4 border-primary px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-primary md:text-base"
                      >
                        100% Approved ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Claim button + confetti origin */}
          <div className="relative mt-9 flex justify-center">
            {burst && <ConfettiBurst burst={burst} />}
            <Button variant="primary" size="lg" onClick={celebrate} className="shadow-lg">
              <PartyPopper className="mr-2 h-5 w-5" />
              {claimed ? "Celebrate again!" : "Claim your award"}
            </Button>
          </div>
          <p className="mt-3 h-5 text-center text-xs text-text-secondary">
            {claimed ? (
              <>
                Congratulations, {HER_NAME}! You&apos;ve officially been the best
                this whole time. <span aria-hidden="true">💖</span>
              </>
            ) : (
              <>
                (tap the medal too <span aria-hidden="true">🥇</span>)
              </>
            )}
          </p>
        </ScrollAnimate>

        {/* ------------------------ Report card + Reasons ----------------------- */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <ScrollAnimate preset="fade-right" className="h-full">
            <Card className="h-full p-6 md:p-8">
              <h3 className="mb-1 text-center font-cute text-2xl text-primary">
                {HER_NAME}&apos;s Official Stats
              </h3>
              <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
                Scientifically measured
              </p>
              <ul className="space-y-5">
                {STATS.map((stat, i) => (
                  <StatBar
                    key={stat.label}
                    stat={stat}
                    index={i}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </ul>
              <p className="mt-6 text-center text-[11px] italic text-text-secondary">
                * results may vary, but never downward.
              </p>
            </Card>
          </ScrollAnimate>

          <ScrollAnimate preset="fade-left" className="h-full">
            <ReasonNote reduceMotion={reduceMotion} />
          </ScrollAnimate>
        </div>

        {/* ------------------------------ Love note ----------------------------- */}
        <ScrollAnimate preset="fade-up">
          <div className="mx-auto mt-20 max-w-xl text-center">
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="inline-block"
            >
              <Heart className="h-9 w-9 fill-primary text-primary" />
            </motion.div>
            <p className="mt-4 font-cute text-2xl leading-snug text-primary md:text-3xl">
              Thank you for being you, {HER_NAME}.
            </p>
            <p className="mt-3 text-sm italic text-text-secondary">
              P.S. I love you more than yesterday, and less than tomorrow.{" "}
              <span aria-hidden="true">💌</span>
            </p>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
