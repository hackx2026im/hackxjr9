"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

/* Chronological event order: opening → networking → sessions → judging →
   showcase → awards → merch → group photo. The feature card is always
   index 0, so the day's opening moment leads the grid. */
const memories = [
  {
    src: "/Memories/Opening%20Ceremony.webp",
    title: "Opening Ceremony",
    description: "Kicking off a day of innovation"
  },
  {
    src: "/Memories/Team%20Awards.webp",
    title: "Celebrating Excellence",
    description: "Honouring dedication and excellence"
  },
  {
    src: "/Memories/Focused%20Audience.webp",
    title: "Focused Audience",
    description: "Engaged minds absorbing every presentation"
  },
  {
    src: "/Memories/Team%20Showcase.webp",
    title: "Team Showcase",
    description: "Confident innovators ready to make an impact"
  },
  {
    src: "/Memories/Expert%20Deliberation.webp",
    title: "Expert Deliberation",
    description: "Judges evaluating ideas with insight"
  },
  {
    src: "/Memories/Prize%20Presentation.webp",
    title: "Prize Presentation",
    description: "Celebrating innovation and outstanding achievement"
  },
  {
    src: "/Memories/Presenting%20Teams.webp",
    title: "Team Presentations",
    description: "Innovators pitching their solutions with confidence"
  },
  {
    src: "/Memories/The%20Team.webp",
    title: "The Team",
    description: "The team behind hackX National Hackathon Series 2025"
  }
];

type Memory = (typeof memories)[number];

/* Desktop (6 cols): index 0 is a large 2×2 feature, indices 1-4 fill the
   remaining 2×2 block, and indices 5-7 form a closing row — 18 cells,
   no gaps. Mobile shows a rotating 5-card window (feature + 2×2) instead
   of cramming all 8 in, cycling automatically. */
const desktopLayout = [
  "col-span-2 row-span-2", // feature
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-2",
];

const mobileLayout = ["col-span-2", "col-span-1", "col-span-1", "col-span-1", "col-span-1"];

const MemoryFace = ({ memory }: { memory: Memory }) => (
  <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={memory.src}
      alt={memory.title}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105"
    />

    {/* Bottom gradient for legibility — always on mobile, on hover for desktop */}
    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#010E13] via-[#010E13]/20 to-transparent opacity-90 md:via-transparent md:opacity-70 md:group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

    {/* Caption — always visible on mobile (no hover), reveal on hover for desktop */}
    <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-6 transition-all duration-300 opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0">
      <h3 className="text-base md:text-xl font-extrabold text-white mb-1 leading-tight">{memory.title}</h3>
      <p className="text-white/70 text-xs md:text-sm font-light leading-relaxed line-clamp-2">
        {memory.description}
      </p>
    </div>
  </>
);

const MemoryCard = ({
  memory,
  className,
  onClick,
  delay = 0
}: {
  memory: Memory;
  className: string;
  onClick: () => void;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    onClick={onClick}
    className={`group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-xl cursor-pointer ${className}`}
  >
    <MemoryFace memory={memory} />
  </motion.div>
);

/* Mobile rotator: the 5 slot elements are permanent (same className, same
   DOM position, never mount/unmount), so the grid itself never reflows.
   Only the image+caption inside each slot crossfades when the memory it's
   showing changes — a pure opacity swap with zero layout movement. */
const MemorySlot = ({
  memory,
  className,
  onClick
}: {
  memory: Memory;
  className: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`group relative rounded-2xl overflow-hidden border border-white/5 shadow-xl cursor-pointer ${className}`}
  >
    <AnimatePresence initial={false}>
      <motion.div
        key={memory.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <MemoryFace memory={memory} />
      </motion.div>
    </AnimatePresence>
  </div>
);

const MOBILE_WINDOW = 5;
const MOBILE_ROTATE_MS = 5000;

export default function MemoriesSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileStart, setMobileStart] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setMobileStart((prev) => (prev + MOBILE_WINDOW) % memories.length);
    }, MOBILE_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const mobileVisible = Array.from({ length: MOBILE_WINDOW }, (_, i) => memories[(mobileStart + i) % memories.length]);

  return (
    <section id="memories" className="relative w-full bg-[#010E13] pt-12 pb-10 md:py-20 overflow-hidden z-10">
      {/* Seamless top blend */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #010E13, transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10 mb-10 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight uppercase">
            Moments of Innovation
          </h2>
          <p className="text-lg text-white/60 font-light max-w-3xl mx-auto text-center">
            Experience the highlights, energy, and unforgettable moments that have defined hackX over the years.
          </p>
        </motion.div>
      </div>

      {/* Bento grid — rotating window on mobile, full grid on desktop */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-3 auto-rows-[160px] md:hidden"
        >
          {mobileVisible.map((memory, i) => (
            <MemorySlot
              key={`slot-${i}`}
              memory={memory}
              className={mobileLayout[i]}
              onClick={() => setSelectedImage(memory.src)}
            />
          ))}
        </motion.div>

        <div className="hidden md:grid grid-cols-6 gap-4 auto-rows-[210px]">
          {memories.map((memory, idx) => (
            <MemoryCard
              key={memory.title}
              memory={memory}
              className={desktopLayout[idx]}
              onClick={() => setSelectedImage(memory.src)}
              delay={(idx % 6) * 0.08}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-10 md:mt-12 text-center relative z-10">
        <p className="text-xl text-white font-medium mb-8">
          Every name on that list started with one idea. What is yours?
        </p>
        <a
          href={process.env.NEXT_PUBLIC_REGISTRATION_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Register Now
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* Lightbox Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer z-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Full size image */}
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={selectedImage}
                alt="Fullscreen Memory"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the image itself
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
