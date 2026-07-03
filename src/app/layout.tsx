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
    "hackX Jr. 9.0",
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
  icons: {
    icon: "/Xlogo-favicon.png",
    shortcut: "/Xlogo-favicon.png",
    apple: "/Xlogo-favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "hackX Jr. 9.0",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/hackX Jr 9.0 logo.webp",
        width: 1200,
        height: 630,
        alt: "hackX Jr. 9.0 Logo",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-black text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
