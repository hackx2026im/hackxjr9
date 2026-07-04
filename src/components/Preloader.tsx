"use client";

import { useEffect, useState } from "react";

const MIN_DISPLAY_MS = 5000;
const FADE_MS = 500;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const start = Date.now();

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
      return () => window.removeEventListener("load", finish);
    }
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
    </div>
  );
}
