"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      // Smart Nav Logic: Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
        setMobileMenuOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
      
      // "ambassadors" temporarily hidden
      const sectionIds = ["about", "timeline", "rewards", "memories", "faq"];
      let bestSection = "";
      const centerY = window.innerHeight / 2;
      let closestDistance = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          // If the section crosses the center of the screen, it's the active one
          if (top <= centerY && bottom >= centerY) {
            bestSection = id;
            break;
          }
          
          // Fallback: if no section strictly crosses the center, find the closest one
          const sectionCenter = (top + bottom) / 2;
          const distance = Math.abs(centerY - sectionCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            bestSection = id;
          }
        }
      }

      if (bestSection) {
        setActiveSection(bestSection);
      } else if (window.scrollY < 100) {
        setActiveSection("");
      }
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // "Ambassadors" temporarily hidden
  const navLinks = ["About", "Timeline", "Rewards", "Memories", "FAQ"];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ 
        paddingTop: scrolled ? "12px" : "20px", 
        paddingBottom: scrolled ? "12px" : "20px", 
        transition: "padding 0.5s ease" 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Liquid Glass Panel */}
        <div
          className="flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-500 relative z-50"
          style={{
            background: scrolled || mobileMenuOpen
              ? "rgba(1, 14, 19, 0.35)"
              : "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(28px) saturate(1.8) brightness(1.15)",
            WebkitBackdropFilter: "blur(28px) saturate(1.8) brightness(1.15)",
            border: scrolled || mobileMenuOpen
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,255,255,0.07)",
            boxShadow: scrolled || mobileMenuOpen
              ? "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.04)"
              : "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-50">
            <div className="relative w-[130px] sm:w-[155px] h-[42px] sm:h-[50px]">
              <Image
                src="/hackX Jr 9.0 logo.webp"
                alt="hackX Jr. Logo"
                fill
                sizes="(max-width: 640px) 100px, 120px"
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-2 relative">
            {navLinks.map((item) => {
              const hrefId = item.toLowerCase().replace(/\s+/g, "-");
              const isActive = activeSection === hrefId;
              
              return (
                <Link
                  key={item}
                  href={`#${hrefId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(hrefId)?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(hrefId);
                  }}
                  className={`relative px-3 lg:px-4 py-1.5 lg:py-2 text-[13px] lg:text-sm xl:text-[15px] font-medium transition-colors duration-300 rounded-full tracking-wide ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-white/[0.09] border border-white/[0.14] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_0_4px_12px_rgba(0,0,0,0.2)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-3 relative z-50">
            <a
              href="#oc"
              className="hidden md:flex items-center justify-center px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-[13px] lg:text-sm xl:text-[15px] font-medium text-white/70 hover:text-white transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(8px)",
              }}
            >
              Contact
            </a>
            <a
              href={process.env.NEXT_PUBLIC_REGISTRATION_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-[13px] lg:text-sm xl:text-[15px] font-bold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #18A0C0 0%, #72E5F8 100%)",
                boxShadow: "0 0 20px rgba(114,229,248,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(114,229,248,0.5), inset 0 1px 0 rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(114,229,248,0.25), inset 0 1px 0 rgba(255,255,255,0.2)")}
            >
              Register Now
            </a>
            
            {/* Mobile Hamburger Icon */}
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-4 right-4 mt-2 p-4 rounded-3xl bg-[#010E13]/40 backdrop-blur-2xl border border-white/10 shadow-2xl lg:hidden z-40"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((item) => {
                  const hrefId = item.toLowerCase().replace(/\s+/g, "-");
                  const isActive = activeSection === hrefId;
                  
                  return (
                    <Link
                      key={item}
                      href={`#${hrefId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById(hrefId)?.scrollIntoView({ behavior: "smooth" });
                        }, 200);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors border ${
                        isActive
                          ? "text-white bg-[#18A0C0]/20 border-[#72E5F8]/20"
                          : "text-white/80 border-transparent hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}
                <div className="h-px w-full bg-white/10 my-2" />
                <a
                  href={process.env.NEXT_PUBLIC_REGISTRATION_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex sm:hidden items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #18A0C0 0%, #72E5F8 100%)",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Now
                </a>
                <a
                  href="#oc"
                  className="w-full md:hidden flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
