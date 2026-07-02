"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function UnderwaterEffect() {
  const [bubbles, setBubbles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number; wobble: number; opacity: number }>>([]);
  const [rays, setRays] = useState<Array<{ id: number; width: number; height: number; left: number; rotation: number; delay: number; duration: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate organic bubbles with wobble and blur for depth
    const newBubbles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 8 + 2, // 2px to 10px
      duration: Math.random() * 12 + 12, // 12s to 24s
      delay: Math.random() * -20, // Start some mid-animation
      wobble: Math.random() * 40 - 20, // Wobble range
      opacity: Math.random() > 0.5 ? 0.4 : 0.8, // Depth of field via opacity instead of blur
    }));
    setBubbles(newBubbles);

    // Generate organic God Rays (light beams)
    const newRays = Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      width: Math.random() * 150 + 100, // Wide beams
      height: 150, // Stretch across viewport height
      left: Math.random() * 120 - 10, // Spread across screen (even outside edges)
      rotation: Math.random() * 30 - 15, // Tilt angle
      delay: Math.random() * -10,
      duration: Math.random() * 8 + 10,
      opacity: Math.random() * 0.15 + 0.1, // Soft opacity
    }));
    setRays(newRays);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* ── Background Deep Water Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010E13]/10 via-[#0A5C72]/10 to-[#010E13]/80 z-10 mix-blend-multiply" />

      {/* Removed heavy SVG feTurbulence caustic effect to massively improve scroll performance */}

      {/* ── Dynamic God Rays ── */}
      <div className="absolute inset-0 z-20 overflow-hidden mix-blend-screen" style={{ perspective: "1000px" }}>
        {rays.map((ray) => (
          <motion.div
            key={`ray-${ray.id}`}
            className="absolute top-[-20%] origin-top"
            style={{
              left: `${ray.left}%`,
              width: `${ray.width}px`,
              height: `${ray.height}vh`,
              background: "linear-gradient(180deg, rgba(114,229,248,0.15) 0%, rgba(114,229,248,0.02) 60%, transparent 100%)",
              rotate: ray.rotation,
              willChange: "transform, opacity",
            }}
            animate={{
              rotate: [ray.rotation, ray.rotation + 8, ray.rotation - 5, ray.rotation],
              opacity: [ray.opacity, ray.opacity * 1.5, ray.opacity * 0.6, ray.opacity],
            }}
            transition={{
              duration: ray.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ray.delay,
            }}
          />
        ))}
      </div>

      {/* ── Floating Bubbles ── */}
      <div className="absolute inset-0 z-30 overflow-hidden">
        {bubbles.map((bubble) => (
          <motion.div
            key={`bubble-${bubble.id}`}
            className="absolute bottom-[-20px] rounded-full bg-white/40"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              willChange: "transform, opacity",
            }}
            animate={{
              y: ["0vh", "-120vh"],
              x: ["0px", `${bubble.wobble}px`, `-${bubble.wobble}px`, "0px"],
              opacity: [0, bubble.opacity, bubble.opacity, 0],
            }}
            transition={{
              y: { duration: bubble.duration, repeat: Infinity, ease: "linear", delay: bubble.delay },
              x: { duration: bubble.duration / 3, repeat: Infinity, ease: "easeInOut", delay: bubble.delay },
              opacity: { duration: bubble.duration, repeat: Infinity, ease: "linear", delay: bubble.delay },
            }}
          />
        ))}
      </div>
    </div>
  );
}
