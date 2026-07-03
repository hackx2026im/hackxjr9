"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    /*
      The footer is intentionally tall (min-height 680px) and uses overflow:hidden.
      All decorative images sit INSIDE these bounds — no overflow tricks needed.
      The statue is centered and sized to show its full height within the footer.
      Layer order (z-index):
        0 → Rotating glow circle  (deepest background)
        1 → Side pillars
        2 → Single gradient veil  (left/right fade + top blend)
        3 → Text content
        4 → Center statue         (topmost)
    */
    <footer
      className="w-full relative overflow-hidden"
      style={{ background: "#010E13", minHeight: "680px" }}
    >
      {/* Top blend — merges seamlessly with the section above */}
      <div
        className="absolute top-0 inset-x-0 h-48 pointer-events-none"
        style={{
          zIndex: 6,
          background: "linear-gradient(to bottom, #010E13 0%, transparent 100%)"
        }}
      />

      {/* ── LAYER 0: Rotating glow circle ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] translate-y-1/2"
          style={{ opacity: 0.3 }}
        >
          <div className="footer-circle-spin relative w-full h-full">
            <Image
              src="/footer circle.png"
              alt=""
              fill
              style={{
                objectFit: "contain",
                filter:
                  "brightness(0) saturate(100%) invert(30%) sepia(90%) saturate(1500%) hue-rotate(200deg) brightness(1.6) drop-shadow(0 0 40px #18A0C0) drop-shadow(0 0 80px rgba(24,160,192,0.4))"
              }}
            />
          </div>
        </div>
      </div>

      {/* ── LAYER 1: Side pillars ── */}
      {/* Left */}
      <div
        className="hidden lg:block absolute bottom-0 left-0 w-[400px] h-[420px] pointer-events-none overflow-hidden"
        style={{ zIndex: 1, opacity: 0.95 }}
      >
        <div className="relative w-full h-full translate-y-16">
          <Image
            src="/footer-side.webp"
            alt=""
            fill
            sizes="400px"
            style={{ objectFit: "contain", objectPosition: "bottom left" }}
          />
        </div>
      </div>

      {/* Right */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 w-[400px] h-[420px] pointer-events-none overflow-hidden"
        style={{ zIndex: 1, opacity: 0.95 }}
      >
        <div className="relative w-full h-full translate-y-16">
          <Image
            src="/footer-side.webp"
            alt=""
            fill
            sizes="400px"
            style={{ objectFit: "contain", objectPosition: "bottom right", transform: "scaleX(-1)" }}
          />
        </div>
      </div>

      {/* ── LAYER 2: Horizontal gradient veil (Desktop only) ── */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to right, #010E13 5%, transparent 28%, transparent 72%, #010E13 95%)"
        }}
      />

      {/* ── LAYER 3: Center statue ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[520px] h-[610px] md:w-[560px] md:h-[660px]"
        style={{ zIndex: 3 }}
      >
        <Image
          src="/footer-center.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 520px, 560px"
          className="object-contain object-bottom"
        />
        {/* Subtle bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-12"
          style={{ background: "linear-gradient(to top, #010E13, transparent)" }}
        />
      </div>

      {/* ── LAYER 4: Mobile Vertical Gradient Veil (Ensures readability of text over statue) ── */}
      <div
        className="block md:hidden absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background: "radial-gradient(circle at bottom, rgba(1, 14, 19, 0.95) 0%, rgba(1, 14, 19, 0.8) 45%, rgba(1, 14, 19, 0.3) 70%, transparent 100%)"
        }}
      />

      {/* ── LAYER 5: Text & logos ── */}
      <div
        className="absolute bottom-0 inset-x-0 pb-8 px-6 md:px-8 lg:px-12"
        style={{ zIndex: 5 }}
      >
        {/* Responsive layout: stacked on mobile, 2 columns on desktop */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mb-8 text-center md:text-left">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="w-fit">
              <div className="relative" style={{ width: "130px", height: "40px" }}>
                <Image
                  src="/hackX Jr 9.0 logo.webp"
                  alt="hackX Jr. Logo"
                  fill
                  sizes="130px"
                  className="object-contain object-center md:object-left"
                />
              </div>
            </Link>
            <p className="text-white/55 text-sm font-light max-w-[320px] md:max-w-[240px] leading-relaxed text-center md:text-left">
              Sri Lanka&apos;s premier school innovation challenge empowering the next generation of innovators and problem-solvers.
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-white/55 text-sm font-light max-w-[320px] md:max-w-[280px] leading-relaxed text-center md:text-right">
              Organized by the Industrial Management Science Students’ Association (IMSSA), University of Kelaniya, hackX Jr. provides a national platform for school students to develop innovative ideas, receive expert mentorship, and showcase their solutions on a national stage.
            </p>
            {/* Organizers logo strip */}
            <div
              className="relative overflow-hidden w-[280px] sm:w-[320px] h-[40px]"
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 w-[280px] sm:w-[320px] h-[140px]">
                <Image
                  src="/allorganizerslogo.webp"
                  alt="Organizers"
                  fill
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-contain object-center md:object-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 text-center md:text-left">&copy; {new Date().getFullYear()} hackX Jr. 9.0. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/company/imssauok/" className="social-glass" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="https://facebook.com/imhackx" className="social-glass" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://instagram.com/hackx_uok" className="social-glass" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="https://youtube.com/@hackX_UoK" className="social-glass" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
            </a>
            <a href="https://tiktok.com" className="social-glass" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
