"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";

const SkipButton = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const [showSkip, setShowSkip] = useState(true);
  useEffect(() => {
    const checkScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isNearBottom = rect.bottom <= window.innerHeight + 800;
      setShowSkip(!isNearBottom);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, [containerRef]);

  return (
    <AnimatePresence>
      {showSkip && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              window.scrollBy({ top: rect.bottom, behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#052E3F]/80 hover:bg-[#052E3F] backdrop-blur-md border border-white/20 text-white shadow-[0_0_20px_rgba(5,46,63,0.8)] transition-all group cursor-pointer pointer-events-auto"
        >
          <span className="font-semibold whitespace-nowrap text-sm tracking-wide">Skip Timeline</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────
//  LAYOUT CONSTANTS  (desktop – untouched)
// ─────────────────────────────────────────────────────────

// Images: 2.png and 3.png
// Scale up to 80vh so they are much bigger and prominent.
const IMG_H = 80;   // vh

// During Phase 2, camera is at worldY = -90vh.
// This means worldY = 190vh maps exactly to screen 100vh (the bottom edge).
const IMG_TOP = 190 - IMG_H; // 110 vh

// The line is at exactly 140 world-vh (screen 50vh, center)
const LINE_Y = 140; // world-vh
const LINE_L = 50;  // vw start — the mountain's centre. Line sits BEHIND the mountain
// (zIndex 1 < mountain zIndex 20) and emerges from behind it as the
// camera pans right.
const LINE_W = 230; // vw width (50 → 280vw, the center of Image 3 / Grand Finals)

// 7 stages. Regular nodes keep the original 25vw interval; Grand Finals is pushed
// out by the same 65vw isolation gap as before to give it epic isolation and room
// for the end image.
const SX = [90, 118, 140, 165, 190, 215, 280]; // vw positions

// Camera pan stops so Grand Finals (280vw) is perfectly centered (280 - 50 = 230)
const CAM_END = -230; // vw

// Independent images to allow exact placement
const timelineImages = [
  { num: 2, left: 105, width: 60 },
  { num: 3, left: 210, width: 140 }, // Center of this image is 280vw (Exactly GF!), ends at 350vw
];

// ── Subtle previous-year backdrops ──
// Faint, blurred, radial-masked photos from past years placed low in the world
// canvas (zIndex 2 — behind the ground images, mountain and nodes) to fill the
// empty sky between the mountain and the final reveal. No hard edges: a radial
// mask feathers every side and the images are heavily dimmed/blurred.
// `focusX` is the horizontal object-position (%) used to re-centre the cover-cropped
// image on the people in frame, since the crop window is much narrower than these
// landscape photos and a plain 50% center cuts subjects off on some of them.
const timelineBgs = [
  { src: "/timeline-bgs/Registrations%20awareness%20session.webp", focusX: 40 },
  { src: "/timeline-bgs/Product%20Demo.webp", focusX: 60 },
  { src: "/timeline-bgs/Workshops.webp", focusX: 45 },
  { src: "/timeline-bgs/Semi%20Finals.webp", focusX: 48 },
  { src: "/timeline-bgs/Finals.webp", focusX: 50 },
];
const BG_CX_DESKTOP = [90, 138, 185, 233, 280]; // world-vw centres spread across the 7-stage span
const BG_CX_MOBILE = [160, 268, 375, 483, 590];

function TimelineBackdrops({ cx, width = 42 }: { cx: number[]; width?: number }) {
  return (
    <>
      {timelineBgs.map((bg, i) => (
        <div
          key={bg.src}
          className="absolute pointer-events-none"
          style={{
            left: `${cx[i] - width / 2}vw`,
            top: "92vh",
            width: `${width}vw`,
            height: "96vh", // spans ~92→188vh, centred on the line (140vh)
            zIndex: 2,
            opacity: 0.16,
            WebkitMaskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 26%, transparent 74%)",
            maskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 26%, transparent 74%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${bg.focusX}% center`,
              filter: "grayscale(0.35) brightness(0.62) contrast(1.02) blur(2px)",
              display: "block",
            }}
          />
        </div>
      ))}
    </>
  );
}

const BRAND = "#72E5F8";
const BRAND2 = "#18A0C0";

const STAGES = [
  {
    date: "July 4",
    title: "Registrations Open",
    desc: "Registration begins for schools and young innovators to embark on their journey in Sri Lanka's premier inter-school innovation competition.",
  },
  {
    date: "July 31",
    title: "Awareness Session",
    desc: "An introductory session for students and teachers covering the competition, timeline, and what it takes to succeed.",
  },
  {
    date: "Aug 1",
    title: "Proposal Submission",
    desc: "Teams submit their innovative ideas and proposed solutions before the proposal submission deadline.",
  },
  {
    date: "August 26",
    title: "Online Workshop Series 1",
    desc: "A series of expert-led workshops designed to strengthen innovation, ideation, and solution development.",
  },
  {
    date: "October 3",
    title: "InnoX (Semi-Finals)",
    desc: "Selected teams pitch their ideas to a panel of judges for the opportunity to advance to the Grand Finals.",
  },
  {
    date: "October 13",
    title: "Online Workshop Series 2",
    desc: "Advanced workshops focused on refining prototypes, presentations, and pitching skills ahead of the finals.",
  },
  {
    date: "November 11",
    title: "Grand Finals",
    titleGradient: "linear-gradient(135deg, #D4AF37 0%, #FFF3A0 60%)",
    desc: "The nation's top finalists present their innovations on the national stage and compete for the championship title.",
    isGF: true,
  },
];

// ─────────────────────────────────────────────────────────
//  DESKTOP COMPONENT  (100% original — do not modify)
// ─────────────────────────────────────────────────────────
function DesktopJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Phase 1: worldY drops 90vh. To keep text vertically fixed on screen, we move it down 90vh!
  const introY = useTransform(p, [0, 0.20], ["0vh", "90vh"]);
  const textOp = useTransform(p, [0.08, 0.15], [1, 0]); // Fade out exactly as camera movement finishes
  const lineScale = useTransform(p, [0.15, 0.84], [0, 1]);

  // We need a numeric pan value to drive the node fade-ins
  // Start X panning early at 0.08 while Y is still dropping until 0.20 for a smooth diagonal curve
  const panVal = useTransform(p, [0.08, 0.85], [0, CAM_END]);
  const worldX = useMotionTemplate`${panVal}vw`;
  const worldY = useTransform(p, [0, 0.20, 0.85, 1.0], ["0vh", "-90vh", "-90vh", "-100vh"]);

  // Phase 3: Reveal numbers
  const counterVal = useTransform(p, [0.72, 0.84], [1, 11]);
  const [date, setDate] = useState(1);
  useMotionValueEvent(counterVal, "change", (v) => setDate(Math.round(v)));
  const novOp = useTransform(p, [0.71, 0.77, 0.88, 0.96], [0, 0.45, 0.45, 0]); // Reduced opacity

  // Node Animations: Fade and slide up as they enter the screen (100vw to 60vw)
  const op0 = useTransform(panVal, [100 - SX[0], 60 - SX[0]], [0, 1]);
  const op1 = useTransform(panVal, [100 - SX[1], 60 - SX[1]], [0, 1]);
  const op2 = useTransform(panVal, [100 - SX[2], 60 - SX[2]], [0, 1]);
  const op3 = useTransform(panVal, [100 - SX[3], 60 - SX[3]], [0, 1]);
  const op4 = useTransform(panVal, [100 - SX[4], 60 - SX[4]], [0, 1]);
  const op5 = useTransform(panVal, [100 - SX[5], 60 - SX[5]], [0, 1]);
  const op6 = useTransform(panVal, [100 - SX[6], 60 - SX[6]], [0, 1]);
  const nodeOps = [op0, op1, op2, op3, op4, op5, op6];

  const y0 = useTransform(panVal, [100 - SX[0], 60 - SX[0]], [30, 0]);
  const y1 = useTransform(panVal, [100 - SX[1], 60 - SX[1]], [30, 0]);
  const y2 = useTransform(panVal, [100 - SX[2], 60 - SX[2]], [30, 0]);
  const y3 = useTransform(panVal, [100 - SX[3], 60 - SX[3]], [30, 0]);
  const y4 = useTransform(panVal, [100 - SX[4], 60 - SX[4]], [30, 0]);
  const y5 = useTransform(panVal, [100 - SX[5], 60 - SX[5]], [30, 0]);
  const y6 = useTransform(panVal, [100 - SX[6], 60 - SX[6]], [30, 0]);
  const nodeYs = [y0, y1, y2, y3, y4, y5, y6];

  // Exit fade from bottom (Phase 3)
  const exitFadeOp = useTransform(p, [0.85, 1.0], [0, 1]);

  // Idle prompt
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    let t: NodeJS.Timeout;
    const fn = () => {
      setShowPrompt(false); clearTimeout(t);
      t = setTimeout(() => {
        if (window.scrollY < document.body.scrollHeight - window.innerHeight * 2)
          setShowPrompt(true);
      }, 2000);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); clearTimeout(t); };
  }, []);

  return (
    <section id="timeline" className="bg-[#010E13] w-full relative">
      <div ref={containerRef} style={{ height: "1150vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Top screen feathering to guarantee no harsh lines against the previous section */}
          <div className="absolute top-0 left-0 w-full h-[15vh] z-[100] pointer-events-none" style={{ background: "linear-gradient(to bottom, #010E13 0%, transparent 100%)" }} />

          {/* ── ATMOSPHERE ── */}
          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 150% 100% at 50% 130%, #052E3F 0%, #010E13 60%)" }} />
          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: "linear-gradient(175deg, rgba(24,160,192,0.07) 0%, transparent 50%)" }} />

          {/* Bubbles */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="absolute rounded-full" style={{
                width: `${3 + (i % 5) * 2}px`, height: `${3 + (i % 5) * 2}px`,
                left: `${3 + i * 7}%`, bottom: "-5%",
                background: "rgba(114,229,248,0.07)", border: "1px solid rgba(114,229,248,0.09)",
                animation: `rise ${5 + (i % 6)}s ease-in infinite`,
                animationDelay: `${i * 0.6}s`,
              }} />
            ))}
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 160% 140% at 50% 50%, transparent 12%, #010E13 100%)" }} />

          {/* ═══════════════════════════════════════════════════
              WORLD CANVAS
          ═══════════════════════════════════════════════════ */}
          <motion.div
            className="absolute top-0 left-0"
            style={{ width: "420vw", height: "200vh", x: worldX, y: worldY }}
          >
            {/* ── NOV 11 WATERMARK (Anchored to GF/Image 3, BEHIND IMAGES) ── */}
            <motion.div
              className="absolute pointer-events-none select-none flex justify-center items-center"
              style={{
                left: "280vw", // Center of Image 3 and GF
                top: "115vh", // Shifted down 40vh to match new world scale
                transform: "translate(-50%, -50%)",
                opacity: novOp,
                zIndex: 0,
              }}
            >
              <div className="font-extrabold tracking-tight" style={{
                fontSize: "clamp(6rem, 18vw, 16rem)",
                background: "linear-gradient(to bottom, #ffffff, #052E3F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}>
                NOV {date}
              </div>
            </motion.div>

            {/* ── INTRO TEXT ── */}
            <motion.div
              className="absolute w-[100vw] flex flex-col items-center text-center px-10"
              style={{ left: 0, top: "12vh", y: introY, opacity: textOp, zIndex: 10 }}
            >
              <h2 className="whitespace-nowrap text-[clamp(1.1rem,4.8vw,2.5rem)] md:text-5xl font-extrabold tracking-tight title-gradient uppercase" style={{
                lineHeight: 1.1,
              }}>
                Your Journey
              </h2>
              <p className="font-light" style={{
                marginTop: "1.5rem",
                fontFamily: "'TT Hoves Pro', sans-serif",
                color: "rgba(255,255,255,0.6)",
                fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
              }}>
                Every great venture starts somewhere.<br />Yours starts here.
              </p>
            </motion.div>

            {/* ── Subtle previous-year backdrops (fill the empty sky) ── */}
            <TimelineBackdrops cx={BG_CX_DESKTOP} width={42} />

            {/* ── MOUNTAIN ──
                Bottom fade (black 80% → transparent 90%) keeps the monolith solid down to
                ~the viewport bottom (so its base shares a ground line with the ruins), while
                dissolving its pointed floating tip into the dark plain before it's revealed. */}
            <div className="absolute pointer-events-none" style={{ left: "-10vw", top: 0, width: "120vw", height: "230vh", zIndex: 20 }}>
              <img
                src="/timeline mountain.webp"
                alt="Mountain"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)"
                }}
              />
            </div>

            {/* ── IMAGES (2.png, 3.png) ──
                Placed independently with objectFit: cover to prevent insane width while keeping 80vh height.
                Uses mask-image to perfectly blend the backgrounds and eliminate the hard rectangle bleed! */}
            {timelineImages.map((img, idx) => (
              <motion.div
                key={img.num}
                className="absolute pointer-events-none"
                style={{
                  left: `${img.left}vw`,
                  // Shared ground line: both image bottoms land at world 196vh (just below the
                  // fold at worldY=-90). They ride the world canvas, so they move together with
                  // the mountain as the camera pans. The gradient floor covers their bases.
                  top: img.num === 3 ? "88vh" : "116vh",
                  height: img.num === 3 ? "118vh" : "80vh",
                  width: `${img.width}vw`,
                  zIndex: 3,
                }}
              >
                {img.num === 3 ? (
                  <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)" }}>
                    <img
                      src={`/horizontal timeline/${img.num}.webp`}
                      alt={`Ruins ${img.num}`}
                      style={{
                        height: "100%", width: "100%",
                        objectFit: "contain",
                        objectPosition: "center bottom", // Grounded to the floor without cropping!
                        filter: "brightness(0.7) contrast(1.15)",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)" }}>
                    <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}>
                      <img
                        src={`/horizontal timeline/${img.num}.webp`}
                        alt={`Ruins ${img.num}`}
                        style={{
                          height: "100%", width: "100%",
                          objectFit: "cover",
                          objectPosition: "center bottom", // Keeps ruins perfectly in view!
                          filter: "brightness(0.7) contrast(1.15)",
                          display: "block",
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* ── GRADIENT FLOOR (the shared ground) ──
                Fades from transparent (screen ~88vh) into solid #010E13 at the ground line,
                so every terrain image dissolves into the same bottom plain. zIndex 4 sits
                above the images (3) but below the mountain (20) and the text nodes (30).
                It rides the world canvas, so the ground moves with the camera. */}
            <div className="absolute" style={{
              left: 0,
              top: `178vh`,
              width: `500vw`,
              height: "62vh",
              background: "linear-gradient(to bottom, transparent 0%, #010E13 28%, #010E13 100%)",
              zIndex: 4,
            }} />

            {/* ── TIMELINE LINE at world-Y=100vh → screen center 50vh ── */}
            <div className="absolute" style={{
              left: `${LINE_L}vw`, top: `${LINE_Y}vh`,
              width: `${LINE_W}vw`, height: "3px",
              background: "rgba(114,229,248,0.15)", zIndex: 1, // Behind images!
            }}>
              <motion.div className="absolute left-0 top-0 h-full" style={{
                width: "100%", scaleX: lineScale, transformOrigin: "left center",
                background: `linear-gradient(90deg, transparent, ${BRAND2} 50%, #ffffff)`,
                boxShadow: `0 0 20px 5px rgba(114,229,248,0.6), 0 0 40px 10px rgba(114,229,248,0.2)`,
              }} />
            </div>

            {/* ── STAGE NODES (ALTERNATING ABOVE/BELOW LINE) ── */}
            {STAGES.map((stage, i) => {
              const isGF = !!stage.isGF;
              const isBelow = i % 2 === 1; // Alternate placement
              const x = SX[i];

              return (
                <motion.div key={i} style={{ display: "contents" }} >
                  {/* Card Container */}
                  <motion.div
                    className="absolute z-30 flex flex-col"
                    style={{
                      left: `${x}vw`,
                      x: isGF ? "-50%" : "0%", // Center GF exactly over the coordinate
                      alignItems: isGF ? "center" : "flex-start",
                      textAlign: isGF ? "center" : ("left" as any),
                      ...(isGF
                        ? { top: "140vh", marginTop: "-55px" }
                        : isBelow
                          ? { top: "140vh", paddingTop: "16px" }
                          : { bottom: "60vh", paddingBottom: "16px" }),
                      width: isGF ? "260px" : "210px",
                      maxWidth: isGF ? "320px" : "260px",
                      opacity: nodeOps[i],
                      y: nodeYs[i],
                    }}
                  >
                    {isGF && (
                      <div className="absolute pointer-events-none" style={{
                        left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                        width: "180%", height: "180%",
                        background: "radial-gradient(ellipse at center, rgba(1,14,19,0.9) 0%, rgba(1,14,19,0.6) 40%, transparent 70%)",
                        zIndex: -1,
                      }} />
                    )}
                    <div className="font-bold uppercase tracking-wide" style={{
                      color: BRAND,
                      fontSize: isGF ? "1rem" : "0.75rem", letterSpacing: "0.15em",
                      marginBottom: "0.3rem",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}>
                      {stage.date}
                    </div>
                    <div className="font-extrabold tracking-tight text-white" style={{
                      fontSize: isGF ? "clamp(1.5rem, 2vw, 2rem)" : "clamp(1.1rem, 1.4vw, 1.5rem)",
                      lineHeight: 1.15, marginBottom: "0.4rem",
                      ...(isGF ? {
                        background: "linear-gradient(135deg, #D4AF37 0%, #FFF3A0 50%, #AA8825 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                      } : {
                        textShadow: `0 4px 15px rgba(0,0,0,0.9)`,
                      }),
                    }}>
                      {stage.title}
                    </div>
                    <div className="font-light" style={{
                      color: "rgba(240,250,255,0.85)",
                      fontSize: isGF ? "0.95rem" : "0.8rem", lineHeight: 1.55,
                      textShadow: "0 2px 15px rgba(0,0,0,0.9)",
                    }}>
                      {stage.desc}
                    </div>

                    {/* Stem - absolutely positioned touching the line */}
                    {!isGF && (
                      <div className="absolute" style={{
                        left: "10px",
                        width: "2px",
                        height: "16px",
                        ...(isBelow
                          ? { top: 0, background: `linear-gradient(to top, rgba(114,229,248,0.5), transparent)` }
                          : { bottom: 0, background: `linear-gradient(to bottom, rgba(114,229,248,0.5), transparent)` }),
                      }} />
                    )}
                  </motion.div>

                  {/* Dot - mathematically locked to LINE_Y (100vh) */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      left: isGF ? `${x}vw` : `calc(${x}vw + 11px)`,
                      top: `${LINE_Y}vh`,
                      transform: "translate(-50%, -50%)",
                      width: isGF ? "16px" : "12px",
                      height: isGF ? "16px" : "12px",
                      background: "#ffffff",
                      boxShadow: isGF
                        ? `0 0 25px 8px rgba(114,229,248,0.9), inset 0 0 8px rgba(114,229,248,1)`
                        : `0 0 15px 5px rgba(114,229,248,0.7), inset 0 0 4px rgba(114,229,248,1)`,
                      zIndex: 2,
                      opacity: nodeOps[i],
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── IDLE PROMPT ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showPrompt ? 1 : 0, y: showPrompt ? 0 : 8 }}
            transition={{ duration: 0.7 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
          >
            <span style={{ color: "rgba(114,229,248,0.38)", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 500, marginBottom: "0.75rem" }}>
              Scroll to explore
            </span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(114,229,248,0.38), transparent)" }}
              className="animate-pulse" />
          </motion.div>

          {/* ── EXIT FADE FROM BOTTOM (Phase 3) ── */}
          <motion.div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{
              height: "45vh",
              background: "linear-gradient(to top, #010E13 20%, rgba(1,14,19,0.85) 50%, transparent 100%)",
              opacity: exitFadeOp,
              zIndex: 100
            }}
          />

          <SkipButton containerRef={containerRef} />
        </div>
      </div>

      <style>{`
        @keyframes rise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          8%   { opacity: 0.5; }
          88%  { opacity: 0.13; }
          100% { transform: translateY(-110vh) scale(1.4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  MOBILE CONSTANTS
//  65vw spacing between nodes → cards (40vw wide) have a
//  25vw gap, so no overlap even on the narrowest phones.
//  First node pushed out to 170vw so there's clear EMPTY GROUND after the
//  mountain exits (~panVal -66) before the first text arrives.
// ─────────────────────────────────────────────────────────
const SX_M = [160, 230, 290, 355, 420, 485, 590];  // vw positions; regular nodes keep the 65vw interval, GF pushed out by the same 105vw isolation gap
const CAM_END_M = -540;                         // -(590 - 50)
const LINE_W_M = 540;  // 50 → 590vw (Grand Finals). Begins behind the mountain centre.
// node0 at 160vw slides in from the right just as the mountain
// exits (~panVal -76) — timeline starts with minimal empty ground.

// ─────────────────────────────────────────────────────────
//  MOBILE COMPONENT
// ─────────────────────────────────────────────────────────
function MobileJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  const introY = useTransform(p, [0, 0.20], ["0vh", "90vh"]);
  // Fade out text completely BEFORE the mountain starts fading
  const textOp = useTransform(p, [0.02, 0.08], [1, 0]);
  // Pan starts at p=0.05 (≈ ¼ through the mountain drop phase 0→0.20)
  // so the horizontal timeline begins appearing while the mountain is still visible.
  // Line fill starts at 0.16 (as the mountain exits at 0.22) so it visibly emerges from
  // behind the mountain, and completes at 0.80 so it isn't still filling at the very end.
  const lineScale = useTransform(p, [0.16, 0.80], [0, 1]);
  const panVal = useTransform(p, [0.05, 0.87], [0, CAM_END_M]);
  const worldX = useMotionTemplate`${panVal}vw`;
  const worldY = useTransform(p, [0, 0.20, 0.87, 1.0], ["0vh", "-90vh", "-90vh", "-100vh"]);

  // Keep the text horizontally centered on screen by counter-panning it against the world
  const introXNum = useTransform(panVal, (v) => -v);
  const introX = useMotionTemplate`${introXNum}vw`;

  // Mountain exit animation:
  // Combines counter-pan (keeps mountain screen-fixed) + leftward slide (p=0.05→0.22).
  // Net effect: mountain is stable on screen until scroll starts, then sweeps left and vanishes.
  const mountainXNum = useTransform(p, (pVal) => {
    // Current world pan (same mapping as panVal but computed here for use in functional form)
    const pan = pVal < 0.05 ? 0 : pVal > 0.87 ? CAM_END_M
      : ((pVal - 0.05) / 0.82) * CAM_END_M;
    // Counter-pan (-pan) keeps it screen-fixed. 
    // Slide is completely removed so the cropped container edges NEVER enter the viewport.
    return -pan;
  });
  const mountainXStr = useMotionTemplate`${mountainXNum}vw`;
  // Start fading mountain ONLY AFTER the text has completely faded out (0.08)
  const mountainOp = useTransform(p, [0.08, 0.22], [1, 0]);
  // Blur ramps up as mountain exits — softens the edge before it fully disappears
  const mountainBlurN = useTransform(p, [0.07, 0.21], [0, 16]);
  const mountainFilter = useMotionTemplate`blur(${mountainBlurN}px)`;

  // Cloud flash: a bright radial bloom centred on-screen that bursts
  // as the mountain exits, then dissolves to reveal the dark timeline.
  // Counter-panned so it stays at screen centre regardless of world pan.
  const cloudCounterXN = useTransform(panVal, (v) => -v);
  const cloudX = useMotionTemplate`${cloudCounterXN}vw`;
  const cloudOp = useTransform(p, [0.09, 0.14, 0.19, 0.27], [0, 1, 1, 0]);
  const cloudScaleVal = useTransform(p, [0.09, 0.27], [0.2, 2.2]);

  // 2D side-scroller: terrain images are STATIC (no scale / no fade). They simply slide
  // through the viewport as the world pans, like a parallax sidescroller. Their soft edge
  // masks blend them in as they enter, so no zoom or opacity animation is needed.

  // NOV 11 counter anchored to GF position (590vw)
  const counterVal = useTransform(p, [0.69, 0.86], [1, 11]);
  const [date, setDate] = useState(1);
  useMotionValueEvent(counterVal, "change", (v) => setDate(Math.round(v)));
  const novOp = useTransform(p, [0.68, 0.74, 0.87, 0.96], [0, 0.45, 0.45, 0]);

  // Node fade/slide — same logic as desktop but using mobile SX positions
  const op0 = useTransform(panVal, [100 - SX_M[0], 60 - SX_M[0]], [0, 1]);
  const op1 = useTransform(panVal, [100 - SX_M[1], 60 - SX_M[1]], [0, 1]);
  const op2 = useTransform(panVal, [100 - SX_M[2], 60 - SX_M[2]], [0, 1]);
  const op3 = useTransform(panVal, [100 - SX_M[3], 60 - SX_M[3]], [0, 1]);
  const op4 = useTransform(panVal, [100 - SX_M[4], 60 - SX_M[4]], [0, 1]);
  const op5 = useTransform(panVal, [100 - SX_M[5], 60 - SX_M[5]], [0, 1]);
  const op6 = useTransform(panVal, [100 - SX_M[6], 60 - SX_M[6]], [0, 1]);
  const nodeOps = [op0, op1, op2, op3, op4, op5, op6];

  const y0 = useTransform(panVal, [100 - SX_M[0], 60 - SX_M[0]], [30, 0]);
  const y1 = useTransform(panVal, [100 - SX_M[1], 60 - SX_M[1]], [30, 0]);
  const y2 = useTransform(panVal, [100 - SX_M[2], 60 - SX_M[2]], [30, 0]);
  const y3 = useTransform(panVal, [100 - SX_M[3], 60 - SX_M[3]], [30, 0]);
  const y4 = useTransform(panVal, [100 - SX_M[4], 60 - SX_M[4]], [30, 0]);
  const y5 = useTransform(panVal, [100 - SX_M[5], 60 - SX_M[5]], [30, 0]);
  const y6 = useTransform(panVal, [100 - SX_M[6], 60 - SX_M[6]], [30, 0]);
  const nodeYs = [y0, y1, y2, y3, y4, y5, y6];

  const exitFadeOp = useTransform(p, [0.87, 1.0], [0, 1]);

  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    let t: NodeJS.Timeout;
    const fn = () => {
      setShowPrompt(false); clearTimeout(t);
      t = setTimeout(() => {
        if (window.scrollY < document.body.scrollHeight - window.innerHeight * 2)
          setShowPrompt(true);
      }, 2000);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); clearTimeout(t); };
  }, []);

  return (
    <section id="timeline" className="bg-[#010E13] w-full relative">
      {/* 660vh — scaled from 500vh to match the longer 7-stage pan, keeping the same pan speed */}
      <div ref={containerRef} style={{ height: "660vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[15vh] z-[100] pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #010E13 0%, transparent 100%)" }} />

          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 150% 100% at 50% 130%, #052E3F 0%, #010E13 60%)" }} />
          <div className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: "linear-gradient(175deg, rgba(24,160,192,0.07) 0%, transparent 50%)" }} />

          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="absolute rounded-full" style={{
                width: `${3 + (i % 5) * 2}px`, height: `${3 + (i % 5) * 2}px`,
                left: `${3 + i * 7}%`, bottom: "-5%",
                background: "rgba(114,229,248,0.07)", border: "1px solid rgba(114,229,248,0.09)",
                animation: `rise ${5 + (i % 6)}s ease-in infinite`,
                animationDelay: `${i * 0.6}s`,
              }} />
            ))}
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 160% 140% at 50% 50%, transparent 12%, #010E13 100%)" }} />

          {/* World canvas — wider to fit mobile node spacing (490vw) */}
          <motion.div
            className="absolute top-0 left-0"
            style={{ width: `${LINE_L + LINE_W_M + 120}vw`, height: "200vh", x: worldX, y: worldY }}
          >
            {/* NOV watermark anchored to GF (final stage) */}
            <motion.div
              className="absolute pointer-events-none select-none flex justify-center items-center"
              style={{
                left: `${SX_M[6]}vw`,
                top: "115vh",
                transform: "translate(-50%, -50%)",
                opacity: novOp,
                zIndex: 0,
              }}
            >
              <div className="font-extrabold tracking-tight" style={{
                fontSize: "clamp(4rem, 28vw, 10rem)",
                background: "linear-gradient(to bottom, #ffffff, #052E3F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}>
                NOV {date}
              </div>
            </motion.div>

            {/* Intro text */}
            <motion.div
              className="absolute w-[100vw] flex flex-col items-center text-center px-8"
              style={{ left: 0, top: "12vh", x: introX, y: introY, opacity: textOp, zIndex: 10 }}
            >
              <h2 className="whitespace-nowrap text-[clamp(1.1rem,4.8vw,2.5rem)] md:text-5xl font-extrabold tracking-tight title-gradient uppercase" style={{ lineHeight: 1.1 }}>
                Your Journey
              </h2>
              <p className="font-light" style={{
                marginTop: "1.2rem",
                fontFamily: "'TT Hoves Pro', sans-serif",
                color: "rgba(255,255,255,0.6)",
                fontSize: "clamp(0.75rem, 3vw, 1.1rem)",
              }}>
                Every great venture starts somewhere.<br />Yours starts here.
              </p>
            </motion.div>

            {/* Cloud flash bloom — centred on-screen, bursts as mountain exits */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: "50vw", top: "40vh",
                width: "160vw", height: "160vw",
                marginLeft: "-80vw", marginTop: "-80vw",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(180,220,255,0.85) 20%, rgba(114,229,248,0.5) 50%, transparent 72%)",
                filter: "blur(28px)",
                x: cloudX,
                opacity: cloudOp,
                scale: cloudScaleVal,
                zIndex: 25,
              }}
            />

            {/* Mountain — slides left + blurs out, cloud bloom covers the exit.
                Tall (300vh) container so the camera descent only reveals the upper ~63% of
                the monolith — it never reaches the floating lower peak. The fade (black 58%
                → transparent 66%) sits in the visible bottom, dissolving it into the ground. */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: "-10vw", top: 0, width: "120vw", height: "300vh", zIndex: 20, x: mountainXStr, opacity: mountainOp, filter: mountainFilter }}
            >
              <img
                src="/timeline mountain.webp"
                alt="Mountain"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 65%, transparent 80%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 65%, transparent 80%)",
                }}
              />
            </motion.div>

            {/* ── Subtle previous-year backdrops (fill the empty sky) ── */}
            <TimelineBackdrops cx={BG_CX_MOBILE} width={90} />

            {/* img2 (ruins) — static ground backdrop on the shared ground (bottom at world
                196vh), around node 0–1. Slides through the viewport as the world pans. */}
            {timelineImages.filter(img => img.num === 2).map((img) => (
              <div key={img.num} className="absolute pointer-events-none" style={{
                left: "175vw",
                top: "116vh",
                height: "80vh",
                width: "90vw",
                zIndex: 3,
              }}>
                <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)" }}>
                  <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}>
                    <img src="/horizontal timeline/2.webp" alt="Ruins 2"
                      style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center bottom", filter: "brightness(0.7) contrast(1.15)", display: "block" }} />
                  </div>
                </div>
              </div>
            ))}

            {/* img3 (Grand Finals) — STATIC, centered on the GF node at 590vw.
                left=515vw, width=150vw → center=590vw. Slides in from the right like a
                sidescroller; objectFit=cover fills the narrow mobile viewport. */}
            <div className="absolute pointer-events-none" style={{
              left: "515vw",
              top: "96vh",        // pushed down ~10vh; rides the world on the shared ground
              height: "110vh",
              width: "150vw",
              zIndex: 3,
            }}>
              <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)" }}>
                <div style={{ width: "100%", height: "100%", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)" }}>
                  <img src="/horizontal timeline/3.webp" alt="Grand Finals"
                    style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center bottom", filter: "brightness(0.85) contrast(1.15)", display: "block" }} />
                </div>
              </div>
            </div>

            {/* Gradient floor — the shared ground; images dissolve into the bottom plain */}
            <div className="absolute" style={{ left: 0, top: "178vh", width: "700vw", height: "62vh", background: "linear-gradient(to bottom, transparent 0%, #010E13 28%, #010E13 100%)", zIndex: 4 }} />

            {/* Timeline line */}
            <div className="absolute" style={{
              left: `${LINE_L}vw`, top: `${LINE_Y}vh`,
              width: `${LINE_W_M}vw`, height: "2px",
              background: "rgba(114,229,248,0.15)", zIndex: 1,
            }}>
              <motion.div className="absolute left-0 top-0 h-full" style={{
                width: "100%", scaleX: lineScale, transformOrigin: "left center",
                background: `linear-gradient(90deg, transparent, ${BRAND2} 50%, #ffffff)`,
                boxShadow: "0 0 20px 5px rgba(114,229,248,0.6), 0 0 40px 10px rgba(114,229,248,0.2)",
              }} />
            </div>

            {/* Stage nodes */}
            {STAGES.map((stage, i) => {
              const isGF = !!stage.isGF;
              const isBelow = i % 2 === 1;
              const x = SX_M[i];

              return (
                <motion.div key={i} style={{ display: "contents" }}>
                  <motion.div
                    className="absolute z-30 flex flex-col"
                    style={{
                      left: `${x}vw`,
                      x: isGF ? "-50%" : "0%",
                      alignItems: isGF ? "center" : "flex-start",
                      textAlign: isGF ? "center" : ("left" as any),
                      ...(isGF
                        ? { top: "140vh", marginTop: "-55px" } // Centered vertically on the line
                        : isBelow
                          ? { top: "140vh", paddingTop: "16px" }
                          : { bottom: "60vh", paddingBottom: "16px" }),
                      // vw-based width: scales with screen, no fixed pixel minWidth to avoid overflow
                      width: isGF ? "44vw" : "40vw",
                      opacity: nodeOps[i],
                      y: nodeYs[i],
                    }}
                  >
                    {isGF && (
                      <div className="absolute pointer-events-none" style={{
                        left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                        width: "180%", height: "180%",
                        background: "radial-gradient(ellipse at center, rgba(1,14,19,0.9) 0%, rgba(1,14,19,0.6) 40%, transparent 70%)",
                        zIndex: -1,
                      }} />
                    )}
                    <div className="font-bold uppercase" style={{
                      color: BRAND,
                      fontSize: isGF ? "clamp(0.65rem, 3vw, 0.9rem)" : "clamp(0.55rem, 2.5vw, 0.75rem)",
                      letterSpacing: "0.12em", marginBottom: "0.25rem",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}>
                      {stage.date}
                    </div>
                    <div className="font-extrabold tracking-tight text-white" style={{
                      fontSize: isGF ? "clamp(1rem, 4.5vw, 1.4rem)" : "clamp(0.85rem, 3.8vw, 1.2rem)",
                      lineHeight: 1.15, marginBottom: "0.35rem",
                      ...(isGF ? {
                        background: "linear-gradient(135deg, #D4AF37 0%, #FFF3A0 50%, #AA8825 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textShadow: "none",
                        filter: "drop-shadow(0 0 15px rgba(212,175,55,0.4)) drop-shadow(0 4px 10px rgba(0,0,0,0.9))"
                      } : {
                        textShadow: `0 4px 15px rgba(0,0,0,0.9)`,
                      }),
                    }}>
                      {stage.title}
                    </div>
                    <div className="font-light" style={{
                      color: "rgba(240,250,255,0.85)",
                      fontSize: isGF ? "clamp(0.65rem, 2.8vw, 0.85rem)" : "clamp(0.6rem, 2.5vw, 0.78rem)",
                      lineHeight: 1.5, textShadow: "0 2px 15px rgba(0,0,0,0.9)",
                    }}>
                      {stage.desc}
                    </div>

                    {!isGF && (
                      <div className="absolute" style={{
                        left: "10px", width: "2px", height: "16px",
                        ...(isBelow
                          ? { top: 0, background: "linear-gradient(to top, rgba(114,229,248,0.5), transparent)" }
                          : { bottom: 0, background: "linear-gradient(to bottom, rgba(114,229,248,0.5), transparent)" }),
                      }} />
                    )}
                  </motion.div>

                  <motion.div className="absolute rounded-full" style={{
                    left: isGF ? `${x}vw` : `calc(${x}vw + 11px)`,
                    top: `${LINE_Y}vh`,
                    transform: "translate(-50%, -50%)",
                    width: isGF ? "16px" : "12px",
                    height: isGF ? "16px" : "12px",
                    background: "#ffffff",
                    boxShadow: isGF
                      ? "0 0 25px 8px rgba(114,229,248,0.9), inset 0 0 8px rgba(114,229,248,1)"
                      : "0 0 15px 5px rgba(114,229,248,0.7), inset 0 0 4px rgba(114,229,248,1)",
                    zIndex: 2,
                    opacity: nodeOps[i],
                  }} />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showPrompt ? 1 : 0, y: showPrompt ? 0 : 8 }}
            transition={{ duration: 0.7 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
          >
            <span style={{ color: "rgba(114,229,248,0.38)", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 500, marginBottom: "0.75rem" }}>
              Scroll to explore
            </span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(114,229,248,0.38), transparent)" }}
              className="animate-pulse" />
          </motion.div>

          <motion.div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{
            height: "45vh",
            background: "linear-gradient(to top, #010E13 20%, rgba(1,14,19,0.85) 50%, transparent 100%)",
            opacity: exitFadeOp, zIndex: 100,
          }} />

          <SkipButton containerRef={containerRef} />
        </div>
      </div>

      <style>{`
        @keyframes rise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          8%   { opacity: 0.5; }
          88%  { opacity: 0.13; }
          100% { transform: translateY(-110vh) scale(1.4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  EXPORT — picks desktop or mobile component.
//  Resize listener ensures correct component is used if
//  the viewport changes (e.g. DevTools device toggle).
// ─────────────────────────────────────────────────────────
export default function JourneySection() {
  // < 1024px (phones AND tablets) use the vw-scaled mobile layout; the desktop layout's
  // tight vw spacing only reads correctly on wide screens.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1280 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileJourneySection /> : <DesktopJourneySection />;
}
