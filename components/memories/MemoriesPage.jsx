"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Waves,
  ArrowRight,
  Eye
} from "lucide-react";
import { memoriesData, memoryCategories } from "@/data/memoriesData";
import Footer from "@/components/Footer";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MemoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgesRef = useRef(null);
  const horizontalReelRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const gridContainerRef = useRef(null);
  const statsRef = useRef(null);

  // Filter memories
  const filteredMemories =
    selectedCategory === "All"
      ? memoriesData
      : memoriesData.filter((item) => item.category === selectedCategory);

  const featuredMemories = memoriesData.filter((item) => item.featured);

  // Lightbox handlers
  const openLightbox = (index) => {
    setActiveLightboxIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    setIsZoomed(false);
  }, []);

  const nextLightbox = useCallback(() => {
    setActiveLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredMemories.length;
    });
    setIsZoomed(false);
  }, [filteredMemories.length]);

  const prevLightbox = useCallback(() => {
    setActiveLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredMemories.length) % filteredMemories.length;
    });
    setIsZoomed(false);
  }, [filteredMemories.length]);

  // Lock body scroll via effect when Lightbox is open
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeLightboxIndex]);

  // Initial Hero & ScrollTrigger Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgesRef.current,
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 35, letterSpacing: "0.4em" },
          { opacity: 1, y: 0, letterSpacing: "0.2em", duration: 1 },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        );

      // 2. Horizontal Featured Reel ScrollTrigger (Desktop & Tablet)
      if (horizontalReelRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const totalScrollWidth = track.scrollWidth - window.innerWidth + 120;

        if (totalScrollWidth > 0 && window.innerWidth > 768) {
          gsap.to(track, {
            x: () => -totalScrollWidth,
            ease: "none",
            scrollTrigger: {
              trigger: horizontalReelRef.current,
              pin: true,
              scrub: 1,
              start: "top top+=70",
              end: () => `+=${totalScrollWidth + 300}`,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // 3. CTA Section Entrance Animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Animate grid cards whenever filtered category changes
  useEffect(() => {
    if (!gridContainerRef.current) return;
    const cards = gridContainerRef.current.querySelectorAll(".memory-card");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: "auto",
      }
    );

    // Refresh ScrollTrigger so layout dimensions recalculate correctly
    ScrollTrigger.refresh();
  }, [selectedCategory]);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextLightbox();
      } else if (e.key === "ArrowLeft") {
        prevLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, nextLightbox, prevLightbox]);

  const currentLightboxItem =
    activeLightboxIndex !== null ? filteredMemories[activeLightboxIndex] : null;

  return (
    <div
      ref={heroRef}
      className="min-h-screen bg-[#010810] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Background Ambient Glow & Underwater Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 left-1/3 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[160px]" />

        {/* Ocean Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #00dbe9 1px, transparent 1px), linear-gradient(to bottom, #00dbe9 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Decorative HUD Lateral Indicators */}
      <aside className="hidden 2xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col space-y-4 text-[9px] font-mono text-cyan-400/40 tracking-[0.3em] pointer-events-none z-20">
        <span>[ ARCHIVE: VOYAGE_2026 ]</span>
        <span>[ DEPTH: CHRONICLES ]</span>
        <span className="w-px h-12 bg-cyan-500/30 my-1 mx-auto" />
        <span>[ STATUS: DECRYPTED ]</span>
        <span>[ LAT: 13.18° N ]</span>
      </aside>

      <aside className="hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col space-y-4 text-[9px] font-mono text-cyan-400/40 tracking-[0.3em] text-right pointer-events-none z-20">
        <span>[ VISUAL_VAULT: ONLINE ]</span>
        <span>[ SENSORS: BIOLUMINESCENT ]</span>
        <span className="w-px h-12 bg-cyan-500/30 my-1 mx-auto" />
        <span>[ PROTOCOL: AQUASAGA ]</span>
        <span>[ COUNT: {memoriesData.length} ARTIFACTS ]</span>
      </aside>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Top Animated Dot Badge */}
        <div
          ref={badgesRef}
          className="flex items-center justify-center space-x-2 text-cyan-300 text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
          <span>VOYAGE ARCHIVES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
        </div>

        {/* Main Title Styled Like Screenshot */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)] mb-5"
        >
          SEMAPHORE MEMORIES
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-slate-300/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans mb-4"
        >
          Submerge into the visual tapestry of Semaphore 2026. Explore our
          bioluminescent realms, flagship emblems, digital oceanic creatures,
          and historic fest moments captured across the deep voyage.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 2. PINNED PARALLAX HIGHLIGHT REEL (HORIZONTAL SCROLL) */}
      {/* ========================================================================= */}
      <section
        ref={horizontalReelRef}
        className="relative z-10 py-12 md:py-20 overflow-hidden bg-gradient-to-b from-transparent via-[#021020]/50 to-transparent border-y border-cyan-500/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
              <span>CURATED REEL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              FEATURED HIGHLIGHTS
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-md">
            Scroll smoothly or swipe to navigate the signature visual artifacts of
            the AquaSaga odyssey.
          </p>
        </div>

        {/* Horizontal Track */}
        <div className="w-full overflow-x-auto md:overflow-hidden no-scrollbar">
          <div
            ref={horizontalTrackRef}
            className="flex gap-6 px-4 sm:px-8 md:px-12 w-max items-center py-4"
          >
            {featuredMemories.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const targetIndex = filteredMemories.findIndex(
                    (m) => m.id === item.id
                  );
                  if (targetIndex !== -1) openLightbox(targetIndex);
                }}
                className="group relative w-[280px] sm:w-[360px] md:w-[440px] h-[340px] sm:h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-[#021329] border border-cyan-500/20 hover:border-cyan-400/80 transition-all duration-500 hover:shadow-[0_0_35px_rgba(0,219,233,0.25)] flex-shrink-0"
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a16] via-[#010a16]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Depth Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] tracking-widest uppercase backdrop-blur-md shadow-md">
                    {item.depth}
                  </span>
                </div>

                {/* Quick Expand Icon Button */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Info Content at bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                  <span className="text-cyan-400 text-[11px] font-mono tracking-widest uppercase mb-1">
                    {item.category} • {item.year}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors drop-shadow-md leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-300/80 text-xs line-clamp-2 mt-1 font-sans">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider font-semibold">
                    <span>EXPLORE ARTIFACT</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FILTERABLE MEMORIES GALLERY & MASONRY GRID */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
              <span>THE ARCHIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              ALL ARTIFACTS
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#021020]/90 border border-cyan-500/20 backdrop-blur-md">
            {memoryCategories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-[0_0_15px_rgba(0,219,233,0.4)] scale-105"
                      : "text-slate-300 hover:text-cyan-300 hover:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Count indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400/60 pb-6 border-b border-cyan-500/10 mb-8">
          <span>
            SHOWING: <strong className="text-cyan-300">{filteredMemories.length}</strong> ENTRIES
          </span>
          <span>CATEGORY: [{selectedCategory.toUpperCase()}]</span>
        </div>

        {/* Gallery Grid */}
        <div
          ref={gridContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredMemories.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="memory-card group relative bg-[#020e1c]/80 border border-cyan-500/20 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-400/80 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,219,233,0.18)] hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Top Image Frame */}
              <div
                className={`relative w-full overflow-hidden bg-black/40 ${
                  item.aspect === "square" ? "aspect-square" : "aspect-video"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020e1c] via-transparent to-transparent opacity-80" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-black/70 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] tracking-wider uppercase backdrop-blur-sm">
                    {item.depth}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/30 text-cyan-200 font-mono text-[9px]">
                    {item.year}
                  </span>
                </div>

                {/* Hover Quick View overlay */}
                <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="px-4 py-2 rounded-full bg-cyan-400 text-black font-mono text-xs font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-[0_0_15px_rgba(0,219,233,0.6)]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW ARTIFACT</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-sm font-sans mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-300/70 text-xs leading-relaxed font-sans line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Tags Footer */}
                <div className="pt-3 border-t border-cyan-500/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300/80 border border-cyan-500/15 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1 group-hover:text-cyan-300">
                    DETAILS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEST LEGACY & MEMORY CALL TO ACTION */}
      {/* ========================================================================= */}
      <section
        ref={statsRef}
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center"
      >
        <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#02152e]/90 to-[#010915]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,219,233,0.15)] overflow-hidden">
          {/* Subtle Ambient Radial */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
              <span>SEMAPHORE 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              CREATE YOUR MEMORY
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Become a part of the AquaSaga history. Compete in 10+ premier IT &
              management events, take home glorious prizes, and carve your name in
              the Semaphore legacy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/events/register"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold font-mono text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(0,219,233,0.6)] hover:scale-105 transition-all duration-300"
              >
                REGISTER FOR EVENTS →
              </Link>
              <Link
                href="/info"
                className="px-8 py-3.5 rounded-xl bg-white/5 border border-cyan-400/30 text-cyan-300 font-bold font-mono text-sm tracking-wider uppercase hover:bg-white/10 hover:border-cyan-300 transition-all duration-300"
              >
                VIEW EVENT INFO
              </Link>
            </div>
          </div>
        </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {currentLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-200 select-none"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto z-20">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-mono text-xs tracking-wider uppercase">
                {currentLightboxItem.depth}
              </span>
              <span className="text-slate-400 text-xs font-mono hidden sm:inline-block">
                [{activeLightboxIndex + 1} of {filteredMemories.length}]
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? "Reset Zoom" : "Zoom Image"}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                {isZoomed ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={closeLightbox}
                title="Close (Esc)"
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,219,233,0.5)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Visual Arena */}
          <div className="relative flex-grow flex items-center justify-center w-full max-w-6xl mx-auto my-2 overflow-hidden">
            {/* Left Nav Button */}
            <button
              onClick={prevLightbox}
              title="Previous (Left Arrow)"
              className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/30 flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Button */}
            <button
              onClick={nextLightbox}
              title="Next (Right Arrow)"
              className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/30 flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Box */}
            <div
              className={`relative w-full h-[65vh] max-w-4xl transition-transform duration-300 flex items-center justify-center ${
                isZoomed ? "scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={currentLightboxItem.image}
                alt={currentLightboxItem.title}
                fill
                sizes="(max-width: 1200px) 90vw, 1000px"
                className="object-contain rounded-xl drop-shadow-[0_0_35px_rgba(0,219,233,0.3)]"
                priority
              />
            </div>
          </div>

          {/* Footer Metadata Card */}
          <div className="w-full max-w-4xl mx-auto bg-[#021326]/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl z-20 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold">
                  {currentLightboxItem.category}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-200/80 text-xs font-mono">
                  {currentLightboxItem.subtitle}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-300/60">
                YEAR: {currentLightboxItem.year}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-mono mb-2">
              {currentLightboxItem.title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
              {currentLightboxItem.description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {currentLightboxItem.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SITE FOOTER */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
}
