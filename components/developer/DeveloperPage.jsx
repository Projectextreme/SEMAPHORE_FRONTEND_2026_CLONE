"use client";

import React, { useState } from "react";
import Link from "next/link";
import { developers } from "./developersData";

export default function DeveloperPage() {
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#020714] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col justify-between pt-8 sm:pt-12">
      
      {/* ================================================== */}
      {/* AQUASAGA ATMOSPHERIC DEEP OCEAN BACKGROUND */}
      {/* ================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* AQUASAGA Electric Blue Radial Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[900px] bg-cyan-400/20 rounded-full blur-[240px]" />
        <div className="absolute bottom-0 right-1/4 w-[1300px] h-[1300px] bg-blue-600/20 rounded-full blur-[220px]" />
        <div className="absolute top-1/2 left-0 w-[900px] h-[900px] bg-sky-500/15 rounded-full blur-[200px]" />
        
        {/* Fine Water Mesh Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 219, 233, 0.7) 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Concentric HUD Radar Rings around Hero */}
        <svg className="absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] opacity-25 pointer-events-none" viewBox="0 0 1000 1000" fill="none">
          <circle cx="500" cy="500" r="460" stroke="#00dbe9" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="500" cy="500" r="380" stroke="#00dbe9" strokeWidth="0.75" />
          <circle cx="500" cy="500" r="280" stroke="#00dbe9" strokeWidth="1" strokeDasharray="12 6" />
          <circle cx="500" cy="500" r="180" stroke="#00dbe9" strokeWidth="0.5" />
          <path d="M500 0 V1000 M0 500 H1000" stroke="#00dbe9" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>

        {/* Left Side PCB Circuit Trace Lines */}
        <svg className="hidden lg:block absolute left-0 top-40 w-96 h-[800px] opacity-30 text-cyan-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 100 H140 L220 180 V360 L280 420 H400" />
          <circle cx="220" cy="180" r="4" fill="#00dbe9" />
          <circle cx="280" cy="420" r="4" fill="#00dbe9" />
          <path d="M0 300 H100 L180 380 V600 L240 660 H400" />
          <circle cx="180" cy="380" r="4" fill="#00dbe9" />
        </svg>

        {/* Right Side PCB Circuit Trace Lines */}
        <svg className="hidden lg:block absolute right-0 top-40 w-96 h-[800px] opacity-30 text-cyan-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M400 100 H260 L180 180 V360 L120 420 H0" />
          <circle cx="120" cy="110" r="4" fill="#00dbe9" />
          <circle cx="80" cy="290" r="4" fill="#00dbe9" />
          <path d="M400 300 H300 L220 380 V600 L160 660 H0" />
          <circle cx="220" cy="380" r="4" fill="#00dbe9" />
        </svg>

        {/* Top Aqua Light Beam */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-400/15 via-cyan-500/5 to-transparent" />
      </div>

      {/* Decorative HUD Side Depth Indicators */}
      <aside className="hidden 2xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col space-y-6 text-[10px] font-mono text-cyan-400/50 tracking-[0.3em] pointer-events-none z-20">
        <span>[ LAT: 12.91° N ]</span>
        <span>[ LON: 74.85° E ]</span>
        <span className="w-px h-16 bg-cyan-500/30 my-2 mx-auto" />
        <span>[ DEPTH: 026M ]</span>
        <span>[ UNIT: DEV_LAB ]</span>
      </aside>

      <aside className="hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col space-y-6 text-[10px] font-mono text-cyan-400/50 tracking-[0.3em] text-right pointer-events-none z-20">
        <span>[ SYSTEM: ONLINE ]</span>
        <span>[ NODE: AQUASAGA ]</span>
        <span className="w-px h-16 bg-cyan-500/30 my-2 mx-auto" />
        <span>[ STATUS: ACTIVE ]</span>
        <span>[ VER: 2026.1.0 ]</span>
      </aside>

      {/* Bottom Right Decorative Starburst HUD Crosshair */}
      <div className="fixed bottom-12 right-12 hidden lg:flex items-center justify-center text-cyan-400/40 pointer-events-none z-20">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
        </svg>
      </div>

      {/* ================================================== */}
      {/* FLOATING ACTION BUTTON: BACK TO SURFACE */}
      {/* ================================================== */}
      <div className="fixed top-6 right-6 sm:right-10 z-50">
        <Link
          href="/"
          className="inline-flex items-center space-x-2.5 text-xs font-mono font-bold tracking-widest text-cyan-300 hover:text-white px-5 py-2.5 rounded-xl border border-cyan-500/40 hover:border-cyan-400 bg-[#020714]/85 hover:bg-cyan-500/25 backdrop-blur-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,219,233,0.25)] hover:shadow-[0_0_25px_rgba(0,219,233,0.55)] focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
        >
          <span>BACK TO SURFACE</span>
          <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </Link>
      </div>

      {/* ================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ================================================== */}
      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-8 py-10 md:py-16 space-y-20 flex-grow">

        {/* ================================================== */}
        {/* HERO SECTION */}
        {/* ================================================== */}
        <section className="text-center space-y-6 pt-2 pb-2 max-w-5xl mx-auto relative">
          
          {/* AQUASAGA Winged Emblem Icon Motif */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_15px_rgba(0,219,233,0.8)]">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.5L12 17L19.5 20.5L12 2ZM12 6.5L16.2 17L12 15L7.8 17L12 6.5Z" />
              </svg>
            </div>
          </div>

          {/* Futuristic Label Badge */}
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(0,219,233,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#00dbe9]" />
            <span>AQUASAGA 2026 // DEVELOPMENT UNIT</span>
          </div>

          {/* AQUASAGA Styled Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-600 filter drop-shadow-[0_0_40px_rgba(0,219,233,0.65)]">
            DEVELOPERS
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl font-mono tracking-[0.35em] uppercase text-cyan-300 font-semibold drop-shadow-[0_0_12px_rgba(0,219,233,0.4)]">
            THE TEAM BEHIND THE EXPERIENCE
          </p>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light pt-1">
            Meet the team behind the design, engineering and immersive technology powering AQUASAGA 2026.
          </p>

          {/* HUD Tech Lines Decorator */}
          <div className="flex items-center justify-center space-x-4 pt-4 text-cyan-500/50 text-xs font-mono tracking-widest">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <span>LOC // AQUASAGA_NODE</span>
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </section>

        {/* ================================================== */}
        {/* HEADQUARTERS SECTION */}
        {/* ================================================== */}
        <section className="space-y-8 w-full max-w-full mx-auto">
          
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>DEVELOPERS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-[0.12em] text-white uppercase drop-shadow-[0_0_25px_rgba(0,219,233,0.5)]">
              HEADQUARTERS
            </h2>

            <a
              href="https://maps.google.com/?q=NMAMIT+Nitte+Karkala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-mono text-cyan-300 hover:text-cyan-100 tracking-widest uppercase transition-colors"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-bold border-b border-cyan-400/50 pb-0.5">NMAMIT NITTE, KARKALA</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Sci-Fi Map Frame Container */}
          <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl border-2 border-cyan-500/40 bg-[#020a1a] overflow-hidden shadow-[0_0_50px_rgba(0,219,233,0.15)] group">
            
            {/* Dark Satellite Iframe Map Embed */}
            <iframe
              title="NMAMIT Nitte Location Map"
              src="https://maps.google.com/maps?q=NMAMIT+Nitte+Karkala+Karnataka&t=k&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter brightness-[0.75] contrast-[1.25] saturate-[0.8] mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 pointer-events-auto"
              loading="lazy"
              allowFullScreen
            />

            {/* Subtle Dark Vignette & Cyber Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020714] via-transparent to-[#020714]/80 opacity-70" />
            <div className="absolute inset-0 pointer-events-none border border-cyan-400/20 rounded-3xl" />

            {/* Top-Left Institute Info Overlay Card */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-sm sm:max-w-md bg-[#030d22]/90 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-5 sm:p-6 text-left shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-10 pointer-events-auto">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-extrabold text-slate-100 text-sm sm:text-base leading-snug tracking-wide">
                  Nitte Mahalinga Adyantaya Memorial Institute of Technology - NMAMIT
                </h3>
                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href="https://maps.google.com/?q=NMAMIT+Nitte+Karkala"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Google Maps"
                    className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 transition-all flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://maps.google.com/maps/dir//NMAMIT+Nitte"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Get Directions"
                    className="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all flex items-center justify-center font-bold"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-2.5 leading-relaxed font-light">
                Nitte, SH1, Karkala, Nitte Parapady, Karnataka 574110
              </p>

              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-cyan-500/20 text-xs font-mono">
                <span className="font-bold text-amber-400 text-sm">4.4</span>
                <div className="flex text-amber-400">
                  {'★'.repeat(4)}{'☆'.repeat(1)}
                </div>
                <span className="text-slate-400">(1,625)</span>
              </div>
            </div>

            {/* Top-Right Telemetry Overlay Box */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#030d22]/90 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-4 sm:p-5 text-left font-mono text-xs space-y-2 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-10 pointer-events-auto min-w-[200px]">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold tracking-widest pb-1 border-b border-cyan-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span>LOCATION_ACTIVE</span>
              </div>
              <div className="text-cyan-300 font-medium space-y-1 pt-1">
                <p><span className="text-slate-400">LAT :</span> 13.2088°N</p>
                <p><span className="text-slate-400">LON :</span> 74.9320°E</p>
                <p className="text-slate-200 font-bold pt-1">NMAMIT NITTE</p>
              </div>
            </div>

            {/* Bottom-Center Badge: NEURAL HQ */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
              <div className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-full bg-[#030d22]/90 backdrop-blur-xl border border-cyan-400/60 text-cyan-300 font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(0,219,233,0.3)]">
                <span className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_0_10px_#f43f5e]">
                  <span className="w-1 h-1 rounded-full bg-white" />
                </span>
                <span>NEURAL HQ</span>
              </div>
            </div>

            {/* Bottom-Left Controls Icon Box */}
            <div className="absolute bottom-6 left-6 hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[#030d22]/90 backdrop-blur-xl border border-cyan-400/40 text-cyan-300 z-10 shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>

            {/* Bottom-Right Crosshair Control Button */}
            <div className="absolute bottom-6 right-6 hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[#030d22]/90 backdrop-blur-xl border border-cyan-400/40 text-cyan-300 z-10 shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* OUR DEVELOPMENT TEAM SECTION */}
        {/* ================================================== */}
        <section className="space-y-10 w-full max-w-full mx-auto">
          
          {/* Section Header */}
          <div className="flex items-center space-x-4 pb-4 border-b border-cyan-500/20">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-mono text-cyan-400 uppercase tracking-[0.25em]">
              OUR DEVELOPMENT TEAM
            </h2>
            <div className="flex-grow h-px bg-gradient-to-r from-cyan-500/40 via-cyan-400/20 to-transparent" />
          </div>

          {/* Team Cards Grid - Extra Wide AQUASAGA Cyber Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 w-full">
            {developers.map((dev) => (
              <div key={dev.id} className="relative group w-full">
                
                {/* Outer Glow Halo on Hover */}
                <div className="absolute -inset-1 bg-cyan-400/35 group-hover:bg-cyan-400/65 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl" />

                {/* Extra Wide Chamfered Sci-Fi Cyber Panel Card */}
                <div 
                  className="relative flex flex-col items-center px-10 py-14 sm:px-12 sm:py-16 bg-gradient-to-b from-[#061a38]/95 via-[#031128]/95 to-[#020b1e]/98 border-2 border-cyan-400/45 group-hover:border-cyan-300 shadow-[0_20px_55px_rgba(0,0,0,0.92)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 w-full min-h-[500px] sm:min-h-[540px] justify-between overflow-hidden"
                  style={{
                    clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'
                  }}
                >
                  {/* Top & Bottom Metallic Bezel Lines */}
                  <div className="absolute top-0 inset-x-8 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent group-hover:via-cyan-300" />
                  <div className="absolute bottom-0 inset-x-8 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent group-hover:via-cyan-300" />

                  {/* Corner Metallic Tech Brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70" />

                  {/* Top-Right ONLINE Badge (Turns GREEN on Hover) */}
                  <div className="absolute top-5 right-5 flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#030b18]/90 border border-cyan-500/40 group-hover:border-emerald-500/70 group-hover:bg-emerald-950/90 transition-all duration-300 shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 group-hover:bg-emerald-400 group-hover:shadow-[0_0_12px_#10b981] transition-all duration-300 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-emerald-400 tracking-wider transition-colors duration-300">
                      ONLINE
                    </span>
                  </div>

                  <div className="flex flex-col items-center w-full space-y-7 pt-4">
                    
                    {/* Extra Large Circular Profile Avatar Frame with Intense Cyber Glow */}
                    <div className="w-60 h-60 sm:w-68 sm:h-68 md:w-64 md:h-64 lg:w-64 lg:h-64 xl:w-68 xl:h-68 rounded-full border-3 border-cyan-400/60 group-hover:border-cyan-300 p-2.5 relative overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(0,219,233,0.4)] group-hover:shadow-[0_0_70px_rgba(0,219,233,0.75)] shrink-0">
                      {!imageErrorMap[dev.id] ? (
                        <img
                          src={dev.image}
                          alt={dev.name}
                          onError={() => handleImageError(dev.id)}
                          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 flex items-center justify-center text-cyan-300 font-mono font-bold text-4xl sm:text-5xl shadow-inner">
                          {dev.initials}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full ring-inset ring-2 ring-cyan-400/40 pointer-events-none" />
                    </div>

                    {/* Member Name */}
                    <h3 className="font-black text-2xl sm:text-3xl text-slate-100 text-center tracking-wide group-hover:text-cyan-300 transition-colors pt-2">
                      {dev.name}
                    </h3>

                    {/* Role Badge - Dark Inset Pill with Cyan Border */}
                    <span className="font-mono text-xs sm:text-sm text-cyan-300 font-bold tracking-widest uppercase bg-[#071936] px-6 py-2 rounded-full border border-cyan-500/40 shadow-inner">
                      {dev.role}
                    </span>
                  </div>

                  {/* Contact Action Icons (Phone, Mail, GitHub, LinkedIn) */}
                  <div className="flex items-center justify-center space-x-4 mt-10 pt-6 border-t border-cyan-500/25 w-full">
                    
                    {/* Phone / Call */}
                    <a
                      href={dev.phone}
                      title="Call"
                      className="w-12 h-12 rounded-full border border-cyan-500/40 bg-[#061836] hover:bg-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-slate-950 transition-all duration-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,219,233,0.25)] hover:shadow-[0_0_20px_rgba(0,219,233,0.55)] focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>

                    {/* Email */}
                    <a
                      href={dev.email}
                      title="Email"
                      className="w-12 h-12 rounded-full border border-cyan-500/40 bg-[#061836] hover:bg-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-slate-950 transition-all duration-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,219,233,0.25)] hover:shadow-[0_0_20px_rgba(0,219,233,0.55)] focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>

                    {/* GitHub */}
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      className="w-12 h-12 rounded-full border border-cyan-500/40 bg-[#061836] hover:bg-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-slate-950 transition-all duration-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,219,233,0.25)] hover:shadow-[0_0_20px_rgba(0,219,233,0.55)] focus:outline-none"
                    >
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="w-12 h-12 rounded-full border border-cyan-500/40 bg-[#061836] hover:bg-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-slate-950 transition-all duration-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,219,233,0.25)] hover:shadow-[0_0_20px_rgba(0,219,233,0.55)] focus:outline-none"
                    >
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ================================================== */}
      {/* FOOTER - MATCHING AQUASAGA OCEAN COLORS & SLEEK DESIGN */}
      {/* ================================================== */}
      <footer className="border-t border-cyan-500/30 bg-gradient-to-b from-[#020714] via-[#01050f] to-[#00030a] py-14 relative z-10 text-center space-y-8">
        
        {/* Matching AQUASAGA Social Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Instagram SAMCA */}
          <a
            href="https://www.instagram.com/samca_nitte_mca?igsh=MXVmYzcwOTloNm9nZw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 hover:bg-cyan-500/25 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,219,233,0.2)] hover:shadow-[0_0_25px_rgba(0,219,233,0.5)] group"
          >
            <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>SAMCA</span>
          </a>

          {/* Instagram SEMAPHORE.26 */}
          <a
            href="https://www.instagram.com/samca_nitte_mca?igsh=MXVmYzcwOTloNm9nZw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 hover:bg-cyan-500/25 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,219,233,0.2)] hover:shadow-[0_0_25px_rgba(0,219,233,0.5)] group"
          >
            <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>SEMAPHORE.26</span>
          </a>

          {/* YouTube SAMCA */}
          <a
            href="https://www.youtube.com/@SAMCANMAMIT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 hover:bg-cyan-500/25 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,219,233,0.2)] hover:shadow-[0_0_25px_rgba(0,219,233,0.5)] group"
          >
            <svg className="w-4 h-4 fill-currentColor text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>SAMCA</span>
          </a>
        </div>

        {/* Thin Accent Line Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Cyber Interface Telemetry Badge Bar */}
        <div className="space-y-2.5 pt-2">
          <div className="inline-flex items-center space-x-2.5 px-6 py-2 rounded-full bg-[#041228]/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-sm">
            <span>CYBERPUNK_DEVELOPMENT_INTERFACE_v2K26.47</span>
            <span className="text-cyan-500/60">|</span>
            <span className="text-emerald-400">NEURAL_LINK_ESTABLISHED</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider pt-1">
            Built with dedication by the Semaphore 2K26 Development Team
          </p>
        </div>

      </footer>

    </div>
  );
}
