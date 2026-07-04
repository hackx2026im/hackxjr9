"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

interface HeroForegroundProps {
  scrollProgress: MotionValue<number>;
}

export default function HeroForeground({ scrollProgress }: HeroForegroundProps) {
  // On scroll: zoom the foreground layer (scale 1.0 -> 1.55)
  const zoomScale = useTransform(scrollProgress, [0, 0.5], [1.0, 1.55]);
  const fgY = useTransform(scrollProgress, [0, 0.5], [0, 65]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Entry: fade in + zoom OUT (1.08 → 1.0) for cinematic reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08, x: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%" }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-1/2 w-[140vw] md:w-full"
        style={{
          transformOrigin: "center center",
        }}
      >
        {/* Scroll-based motion wraps the image separately */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: zoomScale,
            y: fgY,
            transformOrigin: "center center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero Front Layer New.webp"
            alt=""
            fetchPriority="high"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
