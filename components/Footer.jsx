"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white border-t border-cyan-500/20 z-30 overflow-hidden font-mono">
      {/* Bioluminescent Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-[0.2em] text-white">
                SEMAPHORE <span className="text-cyan-400">2K26</span>
              </span>
            </div>
            <p className="text-cyan-100/60 text-xs leading-relaxed max-w-md pt-2">
              National Level IT & Cultural Fest organized by the Department of Master of Computer Applications (MCA), NMAM Institute of Technology (NMAMIT), Nitte.
            </p>
            <div className="pt-2 text-cyan-400 font-bold text-xs tracking-widest uppercase">
              9–10 OCTOBER 2026 • NMAMIT, NITTE
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">
              NAVIGATE
            </h4>
            <ul className="space-y-2.5 text-xs text-cyan-100/70">
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Surface Home</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Deep Ocean Journey</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Events & Competitions</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">About MCA Department</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">
              CONNECT
            </h4>
            <ul className="space-y-2.5 text-xs text-cyan-100/70">
              <li>NMAMIT, Nitte, Karkala Taluk</li>
              <li>Udupi District, Karnataka, India</li>
              <li><a href="mailto:semaphore@nitte.edu.in" className="hover:text-cyan-300 transition-colors">semaphore@nitte.edu.in</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-cyan-100/40 tracking-widest uppercase">
          <p>© 2026 SEMAPHORE 2K26. ALL RIGHTS RESERVED.</p>
          <p className="text-cyan-400/80">DEPARTMENT OF MCA • NMAMIT NITTE</p>
        </div>
      </div>
    </footer>
  );
}
