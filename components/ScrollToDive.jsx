"use client";

import { MoveDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToDive() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide when scrolled down a bit
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Mouse Icon */}
      <div className="w-[28px] h-[46px] rounded-full border-2 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex justify-center pt-2 relative bg-black/20 backdrop-blur-sm">
        {/* Scroll Wheel */}
        <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
      </div>

      {/* Text */}
      <div className="flex items-center gap-2 text-cyan-400 font-mono tracking-[0.2em] text-sm font-semibold drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
        SCROLL TO DIVE 
        <MoveDown size={14} className="animate-pulse" />
      </div>
    </div>
  );
}
