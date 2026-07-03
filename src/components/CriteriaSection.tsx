"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const criteria = [
  {
    title: "Go Solo or Build a Team",
    desc: "You can participate as a solo innovator or form a team of up to 5 members. All team members must be currently enrolled students from the same school, encouraging collaboration within your own learning environment.",
    imageUrl: "/criteria-images/icon-1.webp",
    color: "#72E5F8",
  },
  {
    title: "Your Idea",
    desc: "We welcome ideas that solve real-world problems through innovative, technology-driven solutions. From smart environments and green tech to digital education, healthcare, community well-being, or everyday life hacks—if it uses technology to make an impact, it belongs here.",
    imageUrl: "/criteria-images/icon-2.webp",
    color: "#18A0C0",
  },
  {
    title: "Start Your Journey",
    desc: "Participation is completely free, with no registration fee or complex prerequisites. All you need is your idea, your creativity, and your drive. Simply sign up and submit your initial innovation proposal, and let your creativity take center stage.",
    imageUrl: "/criteria-images/icon-3.webp",
    color: "#72E5F8",
  },
];

const CardDecorator = ({ 
  imageUrl, 
  accentColor,
  rotate
}: { 
  imageUrl: string; 
  accentColor: string;
  rotate: any;
}) => (
  <div aria-hidden className="relative mx-auto size-40 md:size-48 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
    {/* Grid lines */}
    <div 
      className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
      style={{
        backgroundImage: `linear-gradient(to right, ${accentColor}25 1px, transparent 1px), linear-gradient(to bottom, ${accentColor}25 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
    
    {/* Icon with scroll rotation and hover enlarge */}
    <motion.div 
      style={{ rotate }}
      className="absolute inset-0 m-auto flex size-28 md:size-36 items-center justify-center transition-transform duration-500 group-hover:scale-110"
    >
      <img
        src={imageUrl}
        alt="Icon"
        loading="lazy"
        decoding="async"
        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]"
      />
    </motion.div>
  </div>
);

export default function CriteriaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="criteria" ref={sectionRef} className="relative w-full bg-[#010E13] pt-6 pb-10 md:py-20 overflow-hidden z-10">
      
      {/* Background Ambient - Optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(114,229,248,0.08) 0%, rgba(114,229,248,0) 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold title-gradient mb-6 tracking-tight uppercase">
            Who Can Compete
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {criteria.map((item, idx) => {
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-[1px] rounded-3xl bg-white/[0.12] overflow-hidden group transition-all duration-300"
              >
                {/* Rotating Conic Shine Border (appears on hover) */}
                <div 
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-3xl pointer-events-none z-10"
                >
                  <div 
                    className="absolute w-[200%] h-[200%] aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_4.5s_linear_infinite] pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0 260deg, #0A5C72 290deg, #18A0C0 320deg, #72E5F8 345deg, #ffffff 355deg, transparent 360deg)`,
                    }}
                  />
                </div>

                {/* Inner Card Body */}
                <div className="relative p-6 sm:p-8 md:p-10 rounded-[23px] bg-[#010E13] h-full w-full flex flex-col items-center text-center group-hover:bg-[#052E3F] transition-colors duration-300 z-20">
                  {/* Visual Grid Decorator */}
                  <CardDecorator 
                    imageUrl={item.imageUrl}
                    accentColor={item.color}
                    rotate={useTransform(scrollYProgress, [0, 1], idx % 2 === 0 ? [-20, 20] : [20, -20])}
                  />

                  <h3 className="text-xl md:text-2xl font-bold text-white mt-6 mb-4">{item.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed text-sm text-center w-full">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>

      {/* Section bottom fade for visual separation */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, transparent, #010E13)" }} 
      />
    </section>
  );
}
