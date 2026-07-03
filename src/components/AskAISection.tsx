"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import SiriOrb from "@/components/ui/SiriOrb";

type Message = {
  sender: "user" | "ai";
  text: string;
  showMenu?: boolean;
  tier?: number;
  source?: string;
};

const tierLabels: Record<number, string> = {
  0: "GREETING",
  1: "GUARD",
  2: "CACHE",
  4: "FAQ",
  5: "VECTOR",
  6: "LLM",
};

// Only allow safe URL schemes for links rendered from chatbot responses.
// Neutralizes javascript:/data: etc. while leaving all legitimate links unchanged.
function safeHref(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) || /^[/#]/.test(trimmed)) {
    return trimmed;
  }
  return "#";
}

// Safe client-side markdown formatter for React to render bold text and external links
function formatMessageText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const tokenRegex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let key = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        elements.push(<span key={key++}>{line.substring(lastIndex, matchIndex)}</span>);
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        const boldText = token.slice(2, -2);
        elements.push(<strong key={key++} className="font-semibold text-white">{boldText}</strong>);
      } else {
        const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(token);
        if (linkMatch) {
          const textVal = linkMatch[1];
          const urlVal = linkMatch[2];
          elements.push(
            <a
              key={key++}
              href={safeHref(urlVal)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#72E5F8] hover:underline font-medium"
            >
              {textVal}
            </a>
          );
        } else {
          elements.push(<span key={key++}>{token}</span>);
        }
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(<span key={key++}>{line.substring(lastIndex)}</span>);
    }

    return (
      <span key={lineIdx} className="block min-h-[1em]">
        {elements.length > 0 ? elements : line}
      </span>
    );
  });
}

export default function AskAISection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "user",
      text: "Do we need a working prototype when we register?",
    },
    {
      sender: "ai",
      text: "No. At the registration stage, you only need to submit your idea and the required application details. A working prototype is not mandatory initially, but teams progressing to later stages may be expected to showcase a prototype or proof of concept.",
      showMenu: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [debugActive, setDebugActive] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mount logic to prepare session id and debug state
  useEffect(() => {
    // Generate unique session ID matching widget.js
    const newSessionId = "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    setSessionId(newSessionId);

    // Check debug mode params or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.has("debug") || (localStorage.getItem("hackx_debug") === "true");
    setDebugActive(isDebug);
  }, []);

  // Scroll inside the chat container instead of scrolling the page viewport.
  // Skip the very first run so the opening greeting stays visible at the top
  // on load (auto-scrolling on mount previously hid it).
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Append user message to state and hide previous menus
    setMessages((prev) => {
      const clearedPrev = prev.map(m => ({ ...m, showMenu: false }));
      return [...clearedPrev, { sender: "user", text }];
    });
    setIsLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment.");
        }
        throw new Error("API call failed");
      }

      const data = await response.json();
      const aiReply = data.answer || data.reply || data.response || "I didn't receive a response.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          tier: data.tier,
          source: data.source,
          showMenu: true
        }
      ]);
    } catch (error: any) {
      console.error("Error calling chatbot API:", error);

      // Smart local fallback to keep the user engaged when API is offline
      let fallbackReply = "I'm having trouble connecting to the hackX Jr. chatbot service right now. Please try again later or reach out to our coordinators directly.";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("team") || lowerText.includes("member") || lowerText.includes("group") || lowerText.includes("size")) {
        fallbackReply = "Teams can consist of **up to 5 students**, and all team members must be currently enrolled at the same school.";
      } else if (lowerText.includes("fee") || lowerText.includes("cost") || lowerText.includes("free") || lowerText.includes("pay")) {
        fallbackReply = "hackX Jr. 9.0 is **completely free** to enter! There are no registration fees or hidden prerequisites.";
      } else if (lowerText.includes("date") || lowerText.includes("timeline") || lowerText.includes("deadline") || lowerText.includes("when")) {
        fallbackReply = "Here is the key timeline for **hackX Jr. 9.0**:\n\n• **July 3**: Registrations Open\n• **July 31**: Awareness Session\n• **August 1**: Proposal Submission\n• **August 26**: Online Workshop Series 1\n• **October 3**: InnoX (Semi-Finals)\n• **October 13**: Online Workshop Series 2\n• **November 11**: Grand Finals";
      } else if (lowerText.includes("register") || lowerText.includes("sign up") || lowerText.includes("apply")) {
        fallbackReply = "You can register for hackX Jr. 9.0 by clicking any of the **Register Now** buttons on this website. Registration and participation are completely free.";
      } else if (lowerText.includes("criteria") || lowerText.includes("compete") || lowerText.includes("eligible")) {
        fallbackReply = "hackX Jr. 9.0 is open to **school students across Sri Lanka**. Innovation from all backgrounds is welcome as long as there is a technology-driven solution behind it.";
      } else if (lowerText.includes("workshop") || lowerText.includes("mentor") || lowerText.includes("series")) {
        fallbackReply = "hackX Jr. features two **Online Workshop Series** (open to all), offering foundational training and advanced mentoring to help you build and refine your innovation.";
      } else if (lowerText.includes("contact") || lowerText.includes("coordinators") || lowerText.includes("email") || lowerText.includes("phone")) {
        fallbackReply = "For official queries, you can reach out directly:\n\n• **Harshana Praveen** (Chief Coordinator): harshana.hackjr@gmail.com | +94 77 208 6681\n• **Lawindi Tharunya** (Chief Coordinator): lawindi.hackjr@gmail.com | +94 71 543 5636\n• **Osanda Senevirathna** (Media Coordinator): osanda.hackjr@gmail.com | +94 77 220 3475";
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ai", text: fallbackReply, showMenu: true }]);
        setIsLoading(false);
      }, 750);
      return;
    }

    setIsLoading(false);
  };

  const handleMenuClick = (item: string) => {
    handleSendMessage(item);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue("");
    handleSendMessage(text);
  };

  return (
    <section id="ask-ai" className="relative w-full bg-[#010E13] py-16 md:py-20 overflow-hidden z-10">
      {/* Background Orbs — radial-gradients instead of blur() filters so the
          continuous motion stays GPU-composited (no per-frame blur repaint). */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, -60, 0], y: [0, 60, -60, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,160,192,0.12) 0%, rgba(24,160,192,0) 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -40, 40, 0], y: [0, -40, 40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(114,229,248,0.10) 0%, rgba(114,229,248,0) 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight uppercase">ASK AI ANYTHING</h2>
          <p className="text-lg text-white/60 font-light max-w-2xl mx-auto text-center">
            Chat with our AI Assistant to get instant answers about hackX Jr. 9.0
          </p>
        </motion.div>

        {/* AI Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl mx-auto rounded-3xl p-[1px] group"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-50" />

          <div className="relative rounded-[23px] bg-[#010E13]/80 backdrop-blur-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[560px] md:h-[660px]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <SiriOrb size={34} />
                <span className="text-sm font-semibold text-white tracking-wide">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Chat Body - Prevent Lenis Scroll Hijack and Bind Custom Scroll Ref */}
            <div
              ref={chatContainerRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-5 py-4 rounded-2xl ${isUser
                        ? "rounded-tr-none bg-white/10 backdrop-blur-md text-white border border-white/5"
                        : "rounded-tl-none bg-[#18A0C0]/10 backdrop-blur-md border border-[#72E5F8]/20 text-white/90 shadow-[0_0_20px_rgba(24,160,192,0.15)]"
                        } text-sm font-light leading-relaxed`}
                    >
                      {formatMessageText(msg.text)}

                      {/* Initial Quick Menu Options */}
                      {msg.showMenu && (
                        <div className="mt-3 flex flex-row flex-wrap gap-2">
                          {[
                            "Registration",
                            "Eligibility",
                            "Timeline",
                            "Rules & Guidelines",
                            "About hackX Jr",
                            "Prizes",
                            "Contact",
                          ].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => handleMenuClick(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-[#18A0C0]/20 hover:border-[#72E5F8]/30 text-white/70 hover:text-white text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap"
                            >
                              <span>{item}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Debug badge indicator */}
                      {debugActive && msg.tier !== undefined && (
                        <div className="mt-2.5 flex items-center">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#72E5F8] font-bold text-[9px] tracking-wider uppercase">
                            ⚡ {msg.tier === 6 && msg.source === "retrieved_chunks" ? "FALLBACK" : (tierLabels[msg.tier] || "SYSTEM")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-none bg-[#18A0C0]/10 backdrop-blur-md border border-[#72E5F8]/20 text-white/90 text-sm font-light leading-relaxed shadow-[0_0_20px_rgba(24,160,192,0.1)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72E5F8] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72E5F8] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72E5F8] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>



            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 focus-within:border-[#72E5F8]/50 focus-within:bg-[#052E3F]/40 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about hackX Jr…"
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2 py-2 placeholder:text-white/30"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#18A0C0] to-[#72E5F8] flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-center mt-3 text-[10px] text-white/30 uppercase tracking-widest">
                Powered by AI. For official inquiries, please contact the organizing committee.
              </p>
            </form>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
