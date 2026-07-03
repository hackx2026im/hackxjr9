"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShaderBackground from './ShaderBackground';
import UnderwaterEffect from './UnderwaterEffect';
import HeroForeground from './HeroForeground';

export default function Hero() {
  // Drive everything off the ABSOLUTE page scroll (monotonic) instead of a
  // section-relative progress. Framer's target progress (with Lenis smooth
  // scroll) resets back toward 0 once the hero scrolls out of view, which made
  // the title/subtitle fade back IN as the hero's last sliver left the screen.
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const f = () => setVh(window.innerHeight);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  // Fade out title and buttons over the first ~half viewport of scrolling
  const titleOp = useTransform(scrollY, [0, vh * 0.55], [1, 0], { clamp: true });
  const titleY  = useTransform(scrollY, [0, vh * 0.55], [0, -40], { clamp: true });

  const botOp   = useTransform(scrollY, [0, vh * 0.45], [1, 0], { clamp: true });
  const botY    = useTransform(scrollY, [0, vh * 0.45], [0, -20], { clamp: true });

  // Zoom in the background and foreground layers (scale 1.0 -> 1.3) over the scroll
  const zoomScale = useTransform(scrollY, [0, vh], [1.0, 1.3], { clamp: true });

  // BG scroll parallax (makes the background scroll slower)
  const bgY = useTransform(scrollY, [0, vh], [0, 150], { clamp: true });

  // 0 → 1 progress across the first viewport, handed to the foreground layer.
  const heroProg = useTransform(scrollY, [0, vh], [0, 1], { clamp: true });

  return (
    <motion.section
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >

      {/* ── z-2: WebGL Shader (atmospheric tint across full hero) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}>
        <ShaderBackground />
      </div>

      {/* ── z-3: BG Image + Underwater Effects ── */}
      {/* Outer: scroll parallax (y + scale) | Inner: entry zoom-IN animation */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 3,
        y: bgY, scale: zoomScale, transformOrigin: "center center",
        overflow: "hidden",
      }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0, x: "-50%" }}
          animate={{ scale: 1,   opacity: 1, x: "-50%" }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-1/2 w-[140vw] md:w-full"
          style={{ transformOrigin: "center center" }}
        >
          <Image
            src="/Hero - BG Img.webp"
            alt=""
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", objectPosition: "center center" }}
            quality={95}
          />
          {/* Water caustics + bubble particles — only over the BG image */}
          <UnderwaterEffect />
        </motion.div>
      </motion.div>

      {/* ── z-4: Dark atmosphere overlay (between BG and title) ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        background: [
          "radial-gradient(ellipse 60% 60% at 50% 44%, rgba(1,14,19,0.1) 0%, rgba(1,14,19,0.65) 100%)",
          "linear-gradient(to bottom, rgba(1,14,19,0.35) 0%, rgba(5,46,63,0.3) 50%, rgba(1,14,19,0.88) 100%)",
        ].join(", "),
      }} />

      {/* ── z-5: Hero Title (seen through the cave-opening window) ── */}
      <motion.div
        className="absolute inset-0 z-5 flex flex-col items-center justify-start pt-[19vh] pb-0 md:pt-[clamp(90px,18vh,200px)]"
        style={{
          y: titleY,
          opacity: titleOp,
        }}
      >
        <h1 style={{
          fontFamily: "'TT Hoves Pro Expanded', 'TT Hoves Pro', sans-serif",
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.07,
          letterSpacing: "-0.025em",
          textTransform: "uppercase",
          margin: 0, padding: "0 20px",
        }}>
          {/* Line 1 */}
          <motion.span
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              fontSize: "clamp(1.9rem, 7.5vw, 3.75rem)",
              color: "#ffffff",
              // NO text shadow per user request
            }}
          >
            Sri Lanka&apos;s Premier
          </motion.span>

          {/* Line 2 — sky-blue gradient */}
          <motion.span
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              fontSize: "clamp(1.9rem, 7.5vw, 3.75rem)",
              background: "linear-gradient(100deg, #72E5F8 0%, #d6f9ff 50%, #72E5F8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Inter-School Innovation
          </motion.span>

          {/* Line 3 */}
          <motion.span
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              fontSize: "clamp(1.9rem, 7.5vw, 3.75rem)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Competition.
          </motion.span>
        </h1>
      </motion.div>

      {/* ── z-50: Hero Foreground ── */}
      <HeroForeground scrollProgress={heroProg} />

      {/* ── Bottom fade overlay to fade the Hero Foreground into the dark background ── */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "-2px",
        height: "clamp(180px, 35vh, 380px)",
        zIndex: 51,
        background: "linear-gradient(to bottom, transparent 0%, rgba(1, 14, 19, 0.15) 20%, rgba(1, 14, 19, 0.6) 60%, rgba(1, 14, 19, 0.9) 85%, #010E13 100%)",
        pointerEvents: "none",
      }} />

      {/* ── z-60: Subtitle + Buttons (above the foreground) ── */}
      <motion.div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 60,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingBottom: "clamp(28px, 5.5vh, 60px)",
        y: botY, opacity: botOp,
      }}>

        {/* Atmospheric bottom fade — no visible box */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "300px", pointerEvents: "none", zIndex: -1,
          background: "linear-gradient(to bottom, transparent 0%, rgba(1,14,19,0.45) 40%, rgba(1,14,19,0.78) 100%)",
        }} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'TT Hoves Pro', sans-serif",
            fontSize: "clamp(0.88rem, 1.5vw, 1.1rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.62)",
            textAlign: "center",
            maxWidth: "440px",
            lineHeight: 1.8,
            letterSpacing: "0.01em",
            marginBottom: "16px",
            padding: "0 24px",
          }}
        >
          Where school students transform bold ideas into opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-3.5 items-center justify-center w-full px-6 md:px-0"
        >
          <a
            href={process.env.NEXT_PUBLIC_REGISTRATION_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full max-w-[280px] md:w-auto"
          >
            Register Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href="#about"
            className="btn-secondary w-full max-w-[280px] md:w-auto"
          >
            Learn More
          </a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "7px", marginTop: "16px",
          }}
        >
          <span style={{
            fontFamily: "'TT Hoves Pro', sans-serif",
            fontSize: "0.6rem", letterSpacing: "0.24em",
            color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
          }}>Scroll to explore</span>

          {/* Scroll wheel — flexbox for reliable dot centering */}
          <div style={{
            width: "22px", height: "36px",
            border: "1.5px solid rgba(114,229,248,0.22)",
            borderRadius: "11px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "5px",
            boxSizing: "border-box",
          }}>
            <div className="scroll-dot" style={{
              width: "4px", height: "4px",
              borderRadius: "50%",
              background: "#72E5F8",
              flexShrink: 0,
            }} />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
