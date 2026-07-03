"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useState, useRef, useEffect } from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import AnimatedDownloadIcon from "@/components/ui/AnimatedDownloadIcon";
import VimeoPlayer from "@/components/ui/VimeoPlayer";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const StatCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    {...fade(delay)}
    className={`relative overflow-hidden rounded-3xl bg-[#052E3F]/20 backdrop-blur-[40px] border border-white/5 shadow-sm transition-all duration-500 hover:bg-[#052E3F]/35 hover:border-white/10 group ${className}`}
  >
    <PixelCanvas
      gap={10}
      speed={20}
      colors={["#18A0C0", "#72E5F8", "#0A5C72"]}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.03] group-hover:to-transparent transition-colors duration-500 pointer-events-none" />

    {/* Mobile-only subtle animated glow border since we removed the 3D artifacts from mobile */}
    <div className="absolute inset-0 rounded-3xl border border-white/0 lg:border-none pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(114,229,248,0.1)' }} />
    <motion.div
      className="absolute inset-0 rounded-3xl pointer-events-none lg:hidden"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ boxShadow: 'inset 0 0 1px 1px rgba(114,229,248,0.2)' }}
    />

    <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-8 text-center">{children}</div>
  </motion.div>
);

export default function NewSection2() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("https://vimeo.com/api/oembed.json?url=https://vimeo.com/1203805610")
      .then((res) => res.json())
      .then((data) => {
        if (data.thumbnail_url) {
          setThumbnailUrl(data.thumbnail_url);
        }
      })
      .catch((err) => console.error("Error fetching Vimeo thumbnail:", err));
  }, []);

  // Mouse tracking hooks
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100 };
  const smx = useSpring(mouseX, springConfig);
  const smy = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) * 2 - 1);
    mouseY.set((clientY / innerHeight) * 2 - 1);
  };

  // Scroll tracking hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll Parallax Transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [10, -20]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [-10, 30]);

  // Mouse Parallax Transforms
  const mx1 = useTransform(smx, [-1, 1], [-25, 25]);
  const my1 = useTransform(smy, [-1, 1], [-25, 25]);
  const mx2 = useTransform(smx, [-1, 1], [30, -30]);
  const my2 = useTransform(smy, [-1, 1], [30, -30]);
  const mx3 = useTransform(smx, [-1, 1], [-40, 40]);
  const my3 = useTransform(smy, [-1, 1], [-40, 40]);

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#010E13] pt-12 md:pt-28 pb-0 overflow-hidden z-10"
    >
      {/* Seamless top blend to hide clipped blobs */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-40"
        style={{ background: "linear-gradient(to bottom, #010E13 0%, transparent 100%)" }}
      />

      {/* Ambient blobs - Optimized without CSS blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,160,192,0.15) 0%, rgba(24,160,192,0) 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(114,229,248,0.1) 0%, rgba(114,229,248,0) 70%)" }}
        />
      </div>



      {/* Floating 3D Artifact Images — Desktop Only (Free floating) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-[60] hidden lg:block">
        {/* Top Left (Cylinder) */}
        <motion.div
          style={{ y: y1, rotate: rotate1 }}
          className="absolute lg:left-[48%] lg:top-[-6%] w-[180px] lg:w-[200px] xl:w-[280px] opacity-100"
        >
          <motion.img
            src="/section 2/Top left.webp"
            alt="Artifact"
            style={{ x: mx1, y: my1 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Top Right (Pillar) */}
        <motion.div
          style={{ y: y2, rotate: rotate2 }}
          className="absolute lg:top-[-4%] lg:-right-[2%] xl:-right-[5%] w-[150px] lg:w-[180px] xl:w-[250px] opacity-90"
        >
          <motion.img
            src="/section 2/Top Right.webp"
            alt="Artifact"
            style={{ x: mx2, y: my2 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Bottom Center (Brick) */}
        <motion.div
          style={{ y: y3, rotate: rotate3 }}
          className="absolute lg:top-[22%] lg:left-[60%] lg:translate-x-0 w-[200px] lg:w-[220px] xl:w-[320px] opacity-90"
        >
          <motion.img
            src="/section 2/Bottom Center.webp"
            alt="Artifact"
            style={{ x: mx3, y: my3 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-50">


        {/* ── Two-Column Layout: Left = Narrative, Right = Bento Stats ──
            Stacks on tablet (md) so the stat cards keep full width; the
            side-by-side split only kicks in at lg where there's room. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* LEFT — Narrative */}
          <div className="lg:col-span-6 flex flex-col space-y-8 lg:pt-4">
            <div className="flex flex-col space-y-3 md:space-y-4">
              <motion.h2
                {...fade(0.05)}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold title-gradient tracking-tight leading-[1.05] text-center md:text-left whitespace-nowrap"
              >
                WHAT IS hackX Jr.
              </motion.h2>
            </div>

            <motion.div 
              {...fade(0.15)} 
              lang="en"
              className="space-y-6 text-[1.05rem] md:text-[1.15rem] text-white/55 font-light leading-relaxed relative z-30 text-justify hyphens-auto"
              style={{ textJustify: "inter-word" }}
            >
              <p>
                hackX Jr. 9.0 is Sri Lanka&apos;s premier inter-school innovation competition, organized by the Industrial
                Management Science Students&apos; Association (IMSSA) at the Department of Industrial Management,
                University of Kelaniya.
              </p>
              <p>
                hackX Jr. provides a platform for school students to work in teams and transform real-world problems into
                innovative solutions. Whether it is a prototype, product, service, or technology-driven concept,
                participants receive guidance, mentorship, and hands-on learning opportunities throughout the competition
                to develop their creativity, strengthen their problem-solving skills, and bring their ideas to life while
                fostering an entrepreneurial mindset from an early stage.
              </p>
            </motion.div>

            <motion.div {...fade(0.25)} className="relative z-30 flex justify-center md:justify-start">
              <a
                href="/hackX-Jr. 9.0-Delegate-Booklet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group"
              >
                Delegate Booklet
                <AnimatedDownloadIcon size={17} />
              </a>
            </motion.div>
          </div>

          {/* RIGHT — Bento Stats Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-5 relative z-30">
            {/* ── MOBILE ARTIFACTS (Anchored to the grid) ── */}
            <div className="absolute inset-0 pointer-events-none z-[60] lg:hidden">
              {/* Cylinder: Top Left Card's Top Left */}
              <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute -top-[30px] -left-[20px] w-[150px] md:w-[180px]">
                <motion.img src="/section 2/Top left.webp" style={{ x: mx1, y: my1 }} className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
              </motion.div>
              
              {/* Pillar: Top Right Card's Top Right */}
              <motion.div style={{ y: y2, rotate: rotate2 }} className="absolute -top-[30px] -right-[15px] w-[130px] md:w-[150px]">
                <motion.img src="/section 2/Top Right.webp" style={{ x: mx2, y: my2 }} className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
              </motion.div>
              
              {/* Brick: Bottom Center Card's Bottom Center */}
              <motion.div style={{ y: y3, rotate: rotate3 }} className="absolute -bottom-[60px] left-[50%] -translate-x-1/2 w-[180px] md:w-[220px]">
                <motion.img src="/section 2/Bottom Center.webp" style={{ x: mx3, y: my3 }} className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
              </motion.div>
            </div>
            {/* Stat: 9 Editions */}
            <StatCard className="col-span-1 min-h-[200px]" delay={0.1}>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">9</div>
              <p className="text-white/75 font-medium tracking-wide text-sm">Editions</p>
              <p className="text-[10px] text-white/35 mt-1 uppercase tracking-widest">Growing Legacy of Innovation</p>
            </StatCard>

            {/* Stat: 100+ Schools */}
            <StatCard className="col-span-1 min-h-[200px]" delay={0.18}>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">100+</div>
              <p className="text-white/75 font-medium tracking-wide text-sm">Schools</p>
              <p className="text-[10px] text-white/35 mt-1 uppercase tracking-widest">Represented Nationwide</p>
            </StatCard>

            {/* Stat: 380+ Teams — spans full width */}
            <StatCard className="col-span-2 min-h-[220px]" delay={0.26}>
              <div
                className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #72E5F8 0%, #ffffff 60%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(114,229,248,0.35))",
                }}
              >
                380+
              </div>
              <p className="text-white/75 font-medium text-lg tracking-wide">Teams Participating</p>
              <p className="text-xs text-white/35 mt-1 uppercase tracking-widest">Registered in 2025</p>
            </StatCard>
          </div>
        </div>

        {/* ── Video Player ── */}
        <motion.div
          {...fade(0.2)}
          className="w-full mt-16 md:mt-24 relative z-50"
        >
          {/* Label */}
          <motion.p {...fade(0.1)} className="text-xs font-bold tracking-[0.2em] text-white/40 mb-6 text-center">
            Recap of hackX National Hackathon Series 2025
          </motion.p>

          <div className="relative w-full rounded-[2rem] p-[1px] group">
            {/* Animated shimmer border */}
            <div
              className="absolute inset-0 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, rgba(114,229,248,0) 0%, rgba(114,229,248,0.7) 50%, rgba(114,229,248,0) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmerBorder 3s linear infinite",
              }}
            />
            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-[#72E5F8] opacity-[0.06] blur-2xl pointer-events-none group-hover:opacity-[0.12] transition-opacity duration-700" />

            {/* Frame */}
            <div className="relative rounded-[2rem] bg-[#010E13]/90 p-3 md:p-5 border border-white/5">
              <VimeoPlayer videoId={1203805610} poster={thumbnailUrl} />
            </div>

            <style>{`
              @keyframes shimmerBorder {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </div>
        </motion.div>
      </div>

      {/* Seamless bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 md:h-48 pointer-events-none z-40"
        style={{ background: "linear-gradient(to bottom, transparent, #010E13)" }}
      />
    </section>
  );
}
