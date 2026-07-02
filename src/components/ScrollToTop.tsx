"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Show after scrolling down 500px (roughly past the hero), but hide again
      // near the very bottom so the button doesn't cover the footer social icons
      // (notably the last/TikTok one) on mobile.
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      setIsVisible(scrollTop > 500 && distanceFromBottom > 160);

      // Calculate scroll progress percentage
      // Ensure we don't divide by zero
      if (documentHeight > windowHeight) {
        const progress = scrollTop / (documentHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG parameters for the progress circle
  const size = 48; // width/height of the button
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center rounded-full bg-[#010814]/80 backdrop-blur-md shadow-2xl shadow-[#72E5F8]/20 group border border-white/10 hover:bg-[#18A0C0]/20 transition-colors"
          style={{ width: size, height: size }}
          aria-label="Scroll to top"
        >
          {/* SVG Progress Circle */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background Track */}
            <circle
              className="text-white/10"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            {/* Progress Stroke */}
            <circle
              className="text-[#72E5F8] transition-all duration-150 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
          </svg>

          {/* Up Arrow Icon */}
          <svg
            className="w-5 h-5 text-white/80 group-hover:text-white transition-colors relative z-10 group-hover:-translate-y-0.5 duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
