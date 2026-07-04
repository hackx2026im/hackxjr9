"use client";

import { useEffect, useState } from "react";

const MIN_DISPLAY_MS = 1000;
const FADE_MS = 500;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + (100 / (MIN_DISPLAY_MS / 50));
      });
    }, 50);

    const finish = () => {
      const wait = Math.max(MIN_DISPLAY_MS - (Date.now() - start), 0);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), FADE_MS);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      return () => {
        window.removeEventListener("load", finish);
        clearInterval(interval);
      };
    }

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className={`preloader ${fadeOut ? "preloader--hidden" : ""}`} aria-hidden="true">
      <div className="preloader__logo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hackX%20Jr%209.0%20logo.webp" alt="" className="preloader__logo" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hackX%20Jr%209.0%20logo.webp" alt="" aria-hidden="true" className="preloader__sheen" />
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-white/30 text-[10px] font-semibold tracking-[0.25em] font-mono">
          {Math.min(100, Math.round(progress))}%
        </span>
        <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#1A6FD4] to-[#5BB8FF] transition-all duration-75 ease-linear" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
