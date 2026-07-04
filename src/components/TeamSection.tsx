"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import BorderGlow from "@/components/ui/BorderGlow";

const coordinators = [
  {
    name: "Harshana Praveen",
    role: "Chief Coordinator",
    email: "harshana.hackjr@gmail.com",
    phone: "+94 77 208 6681",
    avatar: "/OC/Harshana.webp",
  },
  {
    name: "Lawindi Tharunya",
    role: "Chief Coordinator",
    email: "lawindi.hackjr@gmail.com",
    phone: "+94 71 543 5636",
    avatar: "/OC/Lawindi.webp",
  },
  {
    name: "Osanda Senevirathna",
    role: "Media Coordinator",
    email: "osanda.hackjr@gmail.com",
    avatar: "/OC/Osanda.webp",
  },
  {
    name: "Kaveendya Jayalath",
    role: "Secretary",
    email: "kaveendya.hackjr@gmail.com",
    avatar: "/OC/Kaveendya.webp",
  },
  {
    name: "Thaveesha Weerasinghe",
    role: "Financial Coordinator",
    email: "thaveesha.hackjr@gmail.com",
    avatar: "/OC/Thaveesha.webp",
  },
  {
    name: "Hashmi Nethmindi",
    role: "Financial Coordinator",
    email: "hashmi.hackjr@gmail.com",
    avatar: "/OC/Hashmi.webp",
  },
  {
    name: "Aadila Anees",
    role: "Partnership Coordinator",
    email: "aadila.hackjr@gmail.com",
    avatar: "/OC/Adila.webp",
  },
  {
    name: "Hiruni De Joedth",
    role: "Partnership Coordinator",
    email: "hiruni.hackjr@gmail.com",
    avatar: "/OC/Hiruni.webp",
  },
  {
    name: "Tharushan Dasanayake",
    role: "Marketing Coordinator",
    email: "tharushan.hackjr@gmail.com",
    avatar: "/OC/Tharushan.webp",
  },
  {
    name: "Wasana Senarath",
    role: "Marketing Coordinator",
    email: "wasana.hackjr@gmail.com",
    avatar: "/OC/Wasana.webp",
  },
  {
    name: "Araliya Paranawithana",
    role: "Session Coordinator",
    email: "araliya.hackjr@gmail.com",
    avatar: "/OC/Araliya.webp",
  },
  {
    name: "Pasindu Maduranga",
    role: "Session Coordinator",
    email: "pasindu.hackjr@gmail.com",
    avatar: "/OC/Pasindu.webp",
  },
];


function CoordCard({ coord, index }: { coord: typeof coordinators[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 150, mass: 0.5 });

  // Move image inversely to mouse (max 15px shift). 
  // Image will be scaled to 1.15 so it has plenty of bleed room to avoid clipping edges.
  const imgX = useTransform(smoothX, [-1, 1], [15, -15]);
  const imgY = useTransform(smoothY, [-1, 1], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Normalize -1 to 1
    mouseX.set((e.clientX - rect.left - centerX) / centerX);
    mouseY.set((e.clientY - rect.top - centerY) / centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  // Generate 3 deterministic "random" dots for this specific card
  const dots = [0, 1, 2].map((i) => {
    const seed = index * 3 + i;
    const isHorizontal = seed % 2 === 0;
    const delay = (seed * 0.7) % 3;
    const duration = 3 + ((seed * 1.3) % 4); // 3 to 7 seconds
    // Map seed to grid positions (16px grid intervals)
    const position = 16 * ((seed % 10) + 2);

    return {
      isHorizontal,
      delay,
      duration,
      position
    };
  });

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="189 90 71" // Brand Cyan HSL
      backgroundColor="rgba(3, 17, 38, 0.4)"
      borderRadius={24}
      glowRadius={32}
      glowIntensity={1.1}
      coneSpread={25}
      animated={false}
      colors={['#18A0C0', '#72E5F8', '#0A5C72']}
      fillOpacity={0}
      className="w-full h-full group"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full flex flex-col justify-end p-5 md:p-6 rounded-[24px] overflow-hidden bg-[#010E13]"
      >

        {/* Radar Ripple Background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex items-center justify-center">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-[1.5px] border-[#72E5F8]/20"
              initial={{ width: 0, height: 0, opacity: 0.6 }}
              animate={{ width: "250%", height: "250%", opacity: 0 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2,
              }}
              style={{ aspectRatio: "1/1" }}
            />
          ))}
          {/* Subtle glowing core */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#18A0C0]/30 to-[#72E5F8]/10 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        {/* Background Image Container */}
        <div className="absolute inset-0 z-[1] overflow-hidden">
          {/* Parallax Image */}
          <motion.img
            src={coord.avatar}
            alt={coord.name}
            style={{ x: imgX, y: imgY, scale: 1.1 }}
            className="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out"
          />
        </div>

        {/* Light Sweep Effect (Over the image) */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none rounded-[24px]">
          {/* duration-0 ensures it instantly snaps back on un-hover without playing a reverse sweep, while group-hover:duration-1000 plays the smooth sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-none group-hover:transition-transform group-hover:duration-1000 ease-in-out"></div>
        </div>

        {/* Blurred fade overlay from the bottom up behind the text details */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] z-[3] bg-gradient-to-t from-[#010E13] via-[#010E13]/80 to-transparent backdrop-blur-md pointer-events-none transition-all duration-500 group-hover:h-[65%]"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
          }}
        />

        {/* Info overlay */}
        <div className="relative z-[4] flex flex-col w-full transform group-hover:-translate-y-1 transition-transform duration-500">
          <p className="text-white font-extrabold text-lg md:text-xl tracking-tight leading-tight mb-1 text-center">
            {coord.name}
          </p>
          <p className="text-[#72E5F8] text-xs md:text-sm font-semibold tracking-wide mb-4 text-center">
            {coord.role}
          </p>

          {/* Always show contact details as glass buttons */}
          <div className="flex gap-2 w-full">
            <a
              href={`mailto:${coord.email}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#18A0C0]/20 hover:border-[#72E5F8]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">Email</span>
            </a>
            {coord.phone && (
                <a
                  href={`https://wa.me/${coord.phone.replace(/[+\s-]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#18A0C0]/20 hover:border-[#72E5F8]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
                  onClick={e => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.04-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.088 1.45 4.547 1.45 5.508 0 9.99-4.482 9.994-9.99.002-2.668-1.03-5.176-2.906-7.054C16.407 1.686 13.9 1.656 12.006 1.656c-5.51 0-9.993 4.483-9.997 9.993-.001 1.79.499 3.498 1.447 5.031L2.43 21.147l4.217-1.107zm14.072-8.547c-.015-.024-.056-.039-.118-.07-.061-.03-.361-.178-.417-.198-.056-.02-.097-.03-.139.03-.042.062-.162.204-.199.245-.037.042-.074.047-.136.015-.312-.156-.67-.272-.947-.517-.215-.19-.36-.425-.403-.497-.042-.072-.004-.111.026-.142.027-.028.061-.072.091-.108.03-.036.041-.062.061-.103.021-.041.01-.077-.005-.108-.015-.312-.139-.333-.19-.459-.05-.122-.102-.105-.139-.107-.036-.002-.077-.002-.118-.002-.041 0-.107.015-.163.072-.056.056-.214.21-.214.512s.22.593.25.635c.03.042 4.3 6.562 10.426 9.213.673.291 1.2.464 1.611.595.676.215 1.291.185 1.777.113.541-.08 1.611-.66 1.838-1.266.226-.606.226-1.127.159-1.237z" />
                  </svg>
                  <span className="truncate">WhatsApp</span>
                </a>
              )}
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

export default function TeamSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const getMetrics = () => {
    const isMob = typeof window !== "undefined" && window.innerWidth < 768;
    const gap = isMob ? 12 : 16; // gap-3 is 12px, gap-4 is 16px
    const cardWidth = isMob ? 220 : 280;
    const totalItemWidth = cardWidth + gap;
    const cycleWidth = coordinators.length * totalItemWidth;
    return { totalItemWidth, cycleWidth };
  };

  // Initialize scroll position to start of the second cycle
  useEffect(() => {
    if (scrollRef.current) {
      const { cycleWidth } = getMetrics();
      scrollRef.current.scrollLeft = cycleWidth;
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.dataset.animating === "true") return; // Do not interfere during button animation

    const { cycleWidth } = getMetrics();
    // Seamless loop: when past 2 cycles jump back 1 cycle, when before 1 cycle jump forward 1 cycle
    if (el.scrollLeft >= cycleWidth * 2) {
      el.scrollLeft -= cycleWidth;
    } else if (el.scrollLeft < cycleWidth * 0.5) {
      el.scrollLeft += cycleWidth;
    }
  };

  // Auto-advance scroll natively using requestAnimationFrame for maximum smoothness
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();
    let accumulatedScroll = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50); // cap delta time
      lastTime = now;

      const el = scrollRef.current;
      if (el && !isInteracting.current && el.dataset.animating !== "true") {
        const { cycleWidth } = getMetrics();
        if (el.scrollLeft >= cycleWidth * 2) {
          el.scrollLeft -= cycleWidth;
        } else {
          // Accumulate fractional pixels for smooth slow-speed crawling
          accumulatedScroll += 0.08 * dt; // slightly faster scroll
          if (accumulatedScroll >= 1) {
            el.scrollLeft += Math.floor(accumulatedScroll);
            accumulatedScroll -= Math.floor(accumulatedScroll);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const smoothScroll = (delta: number) => {
    const el = scrollRef.current;
    if (!el || el.dataset.animating === "true") return;

    el.dataset.animating = "true";
    isInteracting.current = true;

    let start = el.scrollLeft;
    let target = start + delta;
    const duration = 600; // subtle, smooth duration
    const startTime = performance.now();
    // Ease Out Quint for a very smooth, subtle deceleration
    const ease = (t: number) => 1 - Math.pow(1 - t, 5);

    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      let currentPos = start + (target - start) * ease(t);

      const { cycleWidth } = getMetrics();
      // Handle wrapping safely during animation without visual jumps
      if (currentPos >= cycleWidth * 2) {
        currentPos -= cycleWidth;
        start -= cycleWidth;
        target -= cycleWidth;
      } else if (currentPos < cycleWidth * 0.5) {
        currentPos += cycleWidth;
        start += cycleWidth;
        target += cycleWidth;
      }

      el.scrollLeft = currentPos;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        el.dataset.animating = "false";
        // Brief delay before resuming auto-scroll
        setTimeout(() => { isInteracting.current = false; }, 50);
      }
    };
    requestAnimationFrame(animate);
  };

  const next = () => {
    const { totalItemWidth } = getMetrics();
    smoothScroll(totalItemWidth);
  };

  const prev = () => {
    const { totalItemWidth } = getMetrics();
    smoothScroll(-totalItemWidth);
  };

  return (
    <section
      id="oc"
      className="relative w-full bg-[#010E13] pt-10 pb-10 md:py-20 overflow-hidden z-10"
    >
      {/* Ambient background blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(114,229,248,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07 }}
              className="text-4xl md:text-5xl font-extrabold title-gradient tracking-tight text-center md:text-left uppercase"
            >
              Contact Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="text-white/55 mt-4 text-sm md:text-base font-light leading-relaxed max-w-lg text-center md:text-left mx-auto md:mx-0"
            >
              Have questions about hackX Jr. 9.0? Our organizing committee is ready to assist students, teachers, and schools with registrations, event details, and participation. Reach out to us—we&apos;re here to support your innovation journey.
            </motion.p>
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-advancing infinite native scroll container */}
      <div className="relative w-full overflow-hidden bg-[#010E13] mt-8 md:mt-12">
        {/* Shadow overlays for smooth fade on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#010E13] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#010E13] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 px-6 md:px-12 py-4 overflow-x-auto hide-scrollbar items-center h-[360px] md:h-[460px] cursor-grab active:cursor-grabbing"
          onMouseEnter={() => { isInteracting.current = true; }}
          onMouseLeave={() => { isInteracting.current = false; }}
          onTouchStart={() => { isInteracting.current = true; }}
          onTouchEnd={() => { isInteracting.current = false; }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 3 cycles: start in cycle 1 (scrollLeft=cycleWidth), reset when past cycle 2 or before cycle 0.5 */}
          {[...coordinators, ...coordinators, ...coordinators].map((coord, idx) => (
            <div key={idx} className="relative w-[220px] h-[320px] md:w-[280px] md:h-[420px] shrink-0">
              <CoordCard coord={coord} index={idx} />
            </div>
          ))}

        </div>
      </div>

      {/* Seamless blend into the next dark section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #010E13)" }}
      />
    </section>
  );
}
