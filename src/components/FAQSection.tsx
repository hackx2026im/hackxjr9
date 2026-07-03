"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { 
    id: "01",
    category: "ELIGIBILITY", 
    title: "Who can register for hackX Jr. 9.0?", 
    answer: "hackX Jr. 9.0 is open to school students across Sri Lanka who are passionate about innovation, creativity, and solving real-world challenges." 
  },
  { 
    id: "02",
    category: "TEAMS", 
    title: "How many students can be in a team?", 
    answer: "Teams can consist of up to five students representing the same school." 
  },
  { 
    id: "03",
    category: "FEES", 
    title: "Is there a registration fee?", 
    answer: "No. Registration and participation in hackX Jr. 9.0 are completely free of charge." 
  },
  { 
    id: "04",
    category: "PROTOTYPE", 
    title: "Do we need a finished product to register?", 
    answer: "No. Participants can register with an innovative idea. Teams advancing to later stages may be required to develop and present a prototype or proof of concept." 
  },
  { 
    id: "05",
    category: "IDEAS", 
    title: "What type of ideas can be submitted?", 
    answer: "Any innovative solution that addresses a real-world problem is welcome. Ideas may focus on areas such as education, environment, healthcare, agriculture, sustainability, technology, community development, and social impact." 
  },
  { 
    id: "06",
    category: "BACKGROUND", 
    title: "Can students without coding experience participate?", 
    answer: "Absolutely. hackX Jr. welcomes students from all backgrounds. Creativity, critical thinking, teamwork, and problem-solving are just as important as technical skills." 
  },
  { 
    id: "07",
    category: "MENTORSHIP", 
    title: "Will participants receive mentorship?", 
    answer: "Yes. Participants will gain access to mentorship, workshops, and guidance sessions conducted by industry professionals and experienced innovators." 
  }
];

export default function FAQSection() {
  // Use a single state for both mobile and desktop since they are both accordions now
  const [activeIdx, setActiveIdx] = useState<number | null>(0); // Initialize first as open to show the connection effect

  return (
    <section id="faq" className="relative w-full bg-[#010E13] pt-10 pb-12 md:py-20 overflow-hidden z-10">
      {/* Background Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#72E5F8]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center w-full mb-12 relative z-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold title-gradient tracking-tight uppercase">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* ─── Desktop Layout (2-Column Accordion) ─── */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start min-h-[500px]">
          
          {/* LEFT COLUMN: Modern Accordion */}
          <div className="col-span-6 flex flex-col gap-4 relative z-20 py-8">
            {faqs.map((faq, idx) => {
              const isActive = activeIdx === idx;
              
              // Calculate dynamic cable bending
              const isPushedDown = activeIdx !== null && activeIdx < idx;
              const expansionHeight = 115; // Estimated pixel height of the expanded answer block
              const baseY = [270, 180, 90, 0, -90, -180, -270][idx];
              // If the item is pushed down by an item above it, we subtract the expansion height 
              // from the SVG's endpoint to perfectly counteract the physical downward movement, 
              // anchoring the right end to the exact same physical pixel on the screen!
              const targetY = isPushedDown ? baseY - expansionHeight : baseY;
              const pathD = `M0,0 C200,0 200,${targetY} 400,${targetY}`;

              return (
                <div key={idx} className="relative w-full">
                  {/* Curved SVG connection lines converging towards Diver's center */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="hidden lg:block absolute top-[45px] left-[98%] w-[400px] pointer-events-none z-0"
                  >
                    <svg width="400" height="2" className="overflow-visible absolute top-0 left-0">
                      {/* Faded persistent curve */}
                      <motion.path 
                        initial={false}
                        animate={{ d: pathD }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        fill="none" 
                        stroke="rgba(255,255,255,0.08)" 
                        strokeWidth="1.5" 
                      />
                      {/* Active glowing pulse curve */}
                      <motion.path 
                        initial={false}
                        animate={{ 
                          d: pathD,
                          strokeDashoffset: isActive ? 0 : 1000
                        }}
                        transition={{ 
                          d: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                          strokeDashoffset: { duration: 0.8, ease: "easeInOut" }
                        }}
                        fill="none" 
                        stroke="#72E5F8" 
                        strokeWidth="2.5"
                        strokeDasharray="1000"
                        style={{ filter: "drop-shadow(0 0 8px rgba(114,229,248,0.8))" }}
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 + (idx * 0.15) }}
                  >
                    <div 
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer backdrop-blur-md z-10 ${isActive ? 'bg-[#052E3F]/60 border-[#72E5F8]/40 shadow-[0_0_30px_rgba(114,229,248,0.1)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                      onClick={() => setActiveIdx(isActive ? null : idx)}
                    >
                      <div className="p-6 flex justify-between items-center relative">
                    <div>
                      <div className={`text-[10px] tracking-[0.2em] font-mono mb-2 transition-colors duration-300 ${isActive ? 'text-[#72E5F8]' : 'text-white/40'}`}>
                        {faq.id} {faq.category}
                      </div>
                      <h3 className={`text-base xl:text-lg font-bold tracking-wide transition-colors duration-300 uppercase ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-white/80'}`}>
                        {faq.title}
                      </h3>
                    </div>
                    
                    <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${isActive ? 'bg-[#72E5F8] text-[#010E13] rotate-180 shadow-[0_0_15px_rgba(114,229,248,0.5)]' : 'bg-white/5 text-white/50'}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 text-sm xl:text-base text-white/70 leading-relaxed font-light relative z-10">
                          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-5" />
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Diver */}
          <div className="col-span-6 relative flex justify-end items-center h-full z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[650px]"
            >
              <img
                src="/FAQ Image.webp"
                alt="Diver"
                loading="lazy"
                decoding="async"
                className="w-full h-auto drop-shadow-[0_0_50px_rgba(114,229,248,0.2)] animate-[float_6s_ease-in-out_infinite]"
              />
            </motion.div>
          </div>
        </div>

        {/* ─── Mobile Layout (Accordion) ─── */}
        <div className="lg:hidden flex flex-col gap-10 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-[300px] mx-auto pointer-events-none z-30"
          >
             <img
                src="/FAQ Image.webp"
                alt="Diver"
                loading="lazy"
                decoding="async"
                className="w-full h-auto drop-shadow-[0_0_20px_rgba(114,229,248,0.15)] animate-[float_6s_ease-in-out_infinite]"
              />
          </motion.div>
          
          <div className="flex flex-col gap-3 w-full">
            {faqs.map((faq, idx) => {
              const isActive = activeIdx === idx;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                >
                  <div 
                    className={`relative p-5 rounded-2xl border transition-colors duration-300 overflow-hidden ${isActive ? 'bg-[#052E3F]/40 border-[#72E5F8]/30' : 'bg-white/[0.02] border-white/5'}`}
                    onClick={() => setActiveIdx(isActive ? null : idx)}
                  >
                    <div className="flex justify-between items-start gap-4 cursor-pointer">
                    <div>
                      <div className={`text-[10px] tracking-[0.2em] font-mono mb-1 transition-colors duration-300 ${isActive ? 'text-[#72E5F8]' : 'text-white/40'}`}>
                        {faq.id} {faq.category}
                      </div>
                      <h3 className={`text-sm md:text-base font-bold leading-snug transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {faq.title}
                      </h3>
                    </div>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 mt-1 ${isActive ? 'bg-[#72E5F8] text-[#010E13] rotate-180' : 'bg-white/5 text-white/50'}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="h-px w-full bg-white/10 my-4" />
                        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
}
