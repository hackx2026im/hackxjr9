import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hackxjr.lk";
const TITLE = "hackX Jr.9.0 — Sri Lanka's Premier Inter-School Innovation Competition";
const DESCRIPTION =
  "Where we empower young innovators to give shapes to ideas. Backed by passion. Driven by innovation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "hackX Jr",
    "hackX Jr.9.0",
    "innovation competition",
    "Sri Lanka",
    "inter-school",
    "University of Kelaniya",
    "school students",
    "young innovators",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "hackX Jr.9.0",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/hackX Jr 9.0 logo.webp",
        alt: "hackX Jr.9.0",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/hackX Jr 9.0 logo.webp"],
  },
};

import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-black text-white">
        <Preloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
