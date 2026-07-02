"use client";

import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import NewSection2 from "@/components/NewSection2";
import JourneySection from "@/components/JourneySection";
import CriteriaSection from "@/components/CriteriaSection";
import MemoriesSection from "@/components/MemoriesSection";
import PrizesSection from "@/components/PrizesSection";
import TeamSection from "@/components/TeamSection";
import FAQSection from "@/components/FAQSection";
import AskAISection from "@/components/AskAISection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <NavBar />
      <main style={{ background: "#010E13", width: "100%", overflowX: "clip" }}>
        <Hero />
        <NewSection2 />
        <CriteriaSection />
        <JourneySection />
        <PrizesSection />
        <MemoriesSection />
        <TeamSection />
        <FAQSection />
        <AskAISection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
