"use client";

import React, { useState } from "react";
import Link from "next/link";
import WaterWave from "../WaterWaveWrapper";
import { developmentTeam, staffCoordinators, studentCoordinators } from "./developersData";


const DeveloperCard = ({ dev, imageErrorMap, handleImageError, hideAllContacts, hideSocials }) => (
  <div key={dev.id} className="relative group w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(25%-1.125rem)] min-w-[260px] max-w-[350px] flex-shrink-0 [perspective:1000px]">

    {/* 3D Glass Card */}
    <div
      className={`relative flex flex-col items-center px-4 py-5 sm:px-5 sm:py-6 bg-white/5 border border-white/10 border-t-white/20 border-l-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_0_32px_rgba(255,255,255,0.02)] backdrop-blur-xl rounded-3xl transition-all duration-500 group-hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-8px)] group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.5),inset_0_0_32px_rgba(255,255,255,0.05)] group-hover:border-cyan-300/30 group-hover:bg-white/10 w-full ${hideAllContacts ? "min-h-[220px] sm:min-h-[240px] justify-center" : "min-h-[320px] sm:min-h-[340px] justify-between"} [transform-style:preserve-3d]`}
    >
      {/* Inner Glass Highlights & Refractions */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/50 rounded-3xl pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-400/20 rounded-full blur-[40px] group-hover:bg-cyan-400/40 transition-colors duration-500 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px] group-hover:bg-blue-500/40 transition-colors duration-500 pointer-events-none" />

      {/* Top-Right Status Badge (Glass Pill) */}
      {/* <div className="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/30 border border-white/10 group-hover:border-emerald-500/40 backdrop-blur-md transition-all duration-300 shadow-sm z-10 [transform:translateZ(20px)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300 animate-pulse" />
                    <span className="font-mono text-[9px] font-bold text-white/70 group-hover:text-emerald-400 tracking-wider transition-colors duration-300">
                      ONLINE
                    </span>
                  </div> */}

      <div className="flex flex-col items-center w-full space-y-3 pt-2 relative z-10 [transform:translateZ(30px)] transition-transform duration-500">

        {/* Profile Avatar Frame - Floating Orb effect */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white/5 border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,219,233,0.4)] group-hover:border-cyan-300/60 shrink-0">
          {!imageErrorMap[dev.id] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={dev.image}
              alt={dev.name}
              onError={() => handleImageError(dev.id)}
              className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-900/50 to-slate-900/50 flex items-center justify-center text-cyan-300 font-mono font-bold text-2xl shadow-inner">
              {dev.initials}
            </div>
          )}
        </div>

        {/* Member Name */}
        <h3 className="font-bold text-lg sm:text-xl text-white text-center tracking-wide group-hover:text-cyan-300 transition-colors pt-2 drop-shadow-md">
          {dev.name}
        </h3>

        {/* Role Badge - Glass Pill */}
        <span className="font-mono text-[10px] sm:text-xs text-cyan-200 font-semibold tracking-widest uppercase bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          {dev.role}
        </span>
      </div>

      {/* Contact Action Icons */}
      {!hideAllContacts && (
        <div className="flex items-center justify-center space-x-3 mt-6 w-full relative z-10 [transform:translateZ(20px)] transition-transform duration-500">

          {/* Phone / Call */}
          <a
            href={dev.phone}
            title="Call"
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-cyan-400 hover:border-cyan-300 hover:text-slate-950 text-cyan-100 backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,219,233,0.5)] hover:-translate-y-1 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>

          {/* Email */}
          <a
            href={dev.email}
            title="Email"
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-cyan-400 hover:border-cyan-300 hover:text-slate-950 text-cyan-100 backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,219,233,0.5)] hover:-translate-y-1 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>

          {/* GitHub */}
          {!hideSocials && (
            <a
              href={dev.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-cyan-400 hover:border-cyan-300 hover:text-slate-950 text-cyan-100 backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,219,233,0.5)] hover:-translate-y-1 focus:outline-none"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}

          {/* LinkedIn */}
          {!hideSocials && (
            <a
              href={dev.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-cyan-400 hover:border-cyan-300 hover:text-slate-950 text-cyan-100 backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,219,233,0.5)] hover:-translate-y-1 focus:outline-none"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

export default function DeveloperPage() {
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#020714] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col justify-between pt-6 sm:pt-8">

      {/* ================================================== */}
      {/* TECHY UNDERWATER BACKGROUND IMAGE WITH RIPPLES */}
      {/* ================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <WaterWave
          imageUrl="/techy_underwater_bg.png"
          dropRadius={25}
          perturbance={0.03}
          resolution={512}
          className="absolute inset-0 w-full h-full opacity-60"
        >
          {() => <div className="w-full h-full" />}
        </WaterWave>

        {/* Deep ocean gradient overlay to ensure text readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020714]/80 via-transparent to-[#020714]/95" />
      </div>

      {/* Decorative HUD Side Depth Indicators */}
      <aside className="hidden 2xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col space-y-4 text-[9px] font-mono text-cyan-400/50 tracking-[0.3em] pointer-events-none z-20">
        <span>[ LAT: 12.91° N ]</span>
        <span>[ LON: 74.85° E ]</span>
        <span className="w-px h-10 bg-cyan-500/30 my-1 mx-auto" />
        <span>[ DEPTH: 026M ]</span>
        <span>[ UNIT: DEV_LAB ]</span>
      </aside>

      <aside className="hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col space-y-4 text-[9px] font-mono text-cyan-400/50 tracking-[0.3em] text-right pointer-events-none z-20">
        <span>[ SYSTEM: ONLINE ]</span>
        <span>[ NODE: AQUASAGA ]</span>
        <span className="w-px h-10 bg-cyan-500/30 my-1 mx-auto" />
        <span>[ STATUS: ACTIVE ]</span>
        <span>[ VER: 2026.1.0 ]</span>
      </aside>

      {/* Bottom Right Decorative Starburst HUD Crosshair */}
      <div className="fixed bottom-8 right-8 hidden lg:flex items-center justify-center text-cyan-400/40 pointer-events-none z-20">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
        </svg>
      </div>

      {/* ================================================== */}
      {/* FLOATING ACTION BUTTON: BACK TO SURFACE */}
      {/* ================================================== */}
      <div className="fixed top-4 right-4 sm:right-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-cyan-300 hover:text-white px-4 py-2 rounded-full border border-white/10 border-t-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(0,219,233,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
        >
          <span>BACK TO SURFACE</span>
          <svg className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </Link>
      </div>

      {/* ================================================== */}
      {/* MAIN CONTENT AREA - ULTRA COMPACT MAX-W-5XL */}
      {/* ================================================== */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 flex-grow">

        {/* ================================================== */}
        {/* HERO SECTION */}
        {/* ================================================== */}
        {false && (
          <section className="text-center space-y-4 max-w-4xl mx-auto relative z-10">

            {/* Glassmorphic Hero Plate */}
            <div className="relative p-8 sm:p-12 rounded-[2rem] bg-white/5 border border-white/10 border-t-white/20 border-l-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,255,255,0.02)] overflow-hidden">
              {/* Glowing Orbs behind the plate */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />


              <div className="relative z-10 space-y-5 flex flex-col items-center">
                {/* AQUASAGA Winged Emblem Icon Motif */}
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 flex items-center justify-center text-cyan-300 drop-shadow-[0_0_15px_rgba(0,219,233,0.8)]">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4.5 20.5L12 17L19.5 20.5L12 2ZM12 6.5L16.2 17L12 15L7.8 17L12 6.5Z" />
                    </svg>
                  </div>
                </div>

                {/* Futuristic Label Badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(0,219,233,0.2)] backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_6px_#00dbe9]" />
                  <span>AQUASAGA 2026 // DEVELOPMENT UNIT</span>
                </div>

                {/* AQUASAGA Styled Main Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-blue-500 filter drop-shadow-[0_0_20px_rgba(0,219,233,0.4)]">
                  DEVELOPERS
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.28em] uppercase text-cyan-200 font-semibold drop-shadow-[0_0_10px_rgba(0,219,233,0.5)]">
                  THE TEAM BEHIND THE EXPERIENCE
                </p>

                {/* Description */}
                <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed font-light mt-2 drop-shadow-md">
                  Meet the engineering and design minds powering AQUASAGA 2026. A collective of developers forging immersive realities and deep-sea cyber experiences.
                </p>
              </div>
            </div>

            {/* HUD Tech Lines Decorator */}
            {/* <div className="flex items-center justify-center space-x-3 pt-6 text-cyan-400/60 text-[10px] font-mono tracking-widest">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500/50" />
              <span>LOC // AQUASAGA_CORE_NODE</span>
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div> */}
          </section>
        )}



        {/* ================================================== */}
        {/* CORE TEAM SECTION (Staff & Student Coordinators) */}
        {/* ================================================== */}
        <section className="space-y-8 w-full pt-2">

          <div className="text-center space-y-2 mt-4 mb-8 relative z-10">
            <div className="flex items-center justify-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9]" />
              <span>LEADERSHIP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              CORE TEAM
            </h2>
          </div>

          <div className="flex items-center space-x-3 pb-3 border-b border-white/10 mt-4">
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/20 text-cyan-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black font-mono text-white uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              STAFF COORDINATOR
            </h2>
            <div className="flex-grow h-px bg-gradient-to-r from-cyan-400/50 via-cyan-400/10 to-transparent" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6 w-full">
            {staffCoordinators.map((dev) => (
              <DeveloperCard key={dev.id} dev={dev} imageErrorMap={imageErrorMap} handleImageError={handleImageError} hideSocials={true} />
            ))}
          </div>

          <div className="flex items-center space-x-3 pb-3 pt-8 border-b border-white/10 mt-12">
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/20 text-cyan-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black font-mono text-white uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              STUDENT COORDINATORS
            </h2>
            <div className="flex-grow h-px bg-gradient-to-r from-cyan-400/50 via-cyan-400/10 to-transparent" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6 w-full">
            {studentCoordinators.map((dev) => (
              <DeveloperCard key={dev.id} dev={dev} imageErrorMap={imageErrorMap} handleImageError={handleImageError} hideSocials={true} />
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* HEADQUARTERS SECTION */}
        {/* ================================================== */}
        <section className="space-y-6 w-full pt-4">

          {/* Header Section */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9]" />
              <span>COMMAND CENTER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9]" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              HEADQUARTERS
            </h2>

            <a
              href="https://maps.google.com/?q=NMAMIT+Nitte+Karkala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-mono text-cyan-200 hover:text-white hover:bg-white/10 tracking-widest uppercase transition-all shadow-sm mt-2"
            >
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-bold">NMAMIT NITTE, KARKALA</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* 3D Glass Sci-Fi Map Frame Container */}
          <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-[2rem] border border-white/10 border-t-white/20 border-l-white/20 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(255,255,255,0.03)] group [perspective:1000px]">

            <div className="w-full h-full [transform-style:preserve-3d] transition-transform duration-1000 group-hover:[transform:rotateX(2deg)_rotateY(-1deg)_scale(1.02)]">
              {/* Dark Satellite Iframe Map Embed */}
              <iframe
                title="NMAMIT Nitte Location Map"
                src="https://maps.google.com/maps?q=NMAMIT+Nitte+Karkala+Karnataka&t=k&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter brightness-[0.5] contrast-[1.4] saturate-[0.8] hue-rotate-[15deg] mix-blend-luminosity group-hover:mix-blend-normal group-hover:brightness-[0.8] transition-all duration-1000 pointer-events-auto"
                loading="lazy"
                allowFullScreen
              />

              {/* Subtle Dark Vignette & Cyber Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020714] via-transparent to-[#020714]/80 opacity-80" />
              <div className="absolute inset-0 pointer-events-none bg-cyan-900/10 mix-blend-overlay" />

              {/* Top-Left Institute Info Glass Overlay */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-[220px] sm:max-w-[260px] bg-white/10 backdrop-blur-xl border border-white/10 border-t-white/20 border-l-white/20 rounded-2xl p-3 sm:p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-10 pointer-events-auto [transform:translateZ(30px)] transition-transform duration-700">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-white text-[11px] sm:text-xs leading-tight tracking-wide drop-shadow-md">
                    NMAMIT - Nitte Institute of Technology
                  </h3>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <a
                      href="https://maps.google.com/?q=NMAMIT+Nitte+Karkala"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Google Maps"
                      className="w-6 h-6 rounded-full bg-white/10 border border-white/20 hover:bg-cyan-400 hover:border-cyan-300 text-cyan-200 hover:text-slate-900 transition-all flex items-center justify-center backdrop-blur-md shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <p className="text-[10px] text-cyan-100/80 font-sans mt-1.5 leading-snug font-light">
                  Nitte, SH1, Karkala, Karnataka 574110
                </p>

                <div className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                  <span className="font-bold text-amber-300 text-[11px]">4.4</span>
                  <div className="flex text-amber-400 text-[9px] drop-shadow-[0_0_2px_rgba(251,191,36,0.8)]">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                  <span className="text-white/50 text-[9px]">(1,625)</span>
                </div>
              </div>

              {/* Top-Right Telemetry Glass Pill */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 backdrop-blur-xl border border-white/10 border-t-white/20 border-l-white/20 rounded-2xl p-2.5 sm:p-3 text-left font-mono text-[9px] space-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-10 pointer-events-auto min-w-[140px] sm:min-w-[155px] [transform:translateZ(20px)] transition-transform duration-700">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold tracking-widest pb-1 border-b border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span>LOCATION_SYNCED</span>
                </div>
                <div className="text-cyan-200 font-medium space-y-0.5 pt-1">
                  <p><span className="text-white/50">LAT :</span> 13.2088°N</p>
                  <p><span className="text-white/50">LON :</span> 74.9320°E</p>
                  <p className="text-white font-bold pt-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">NMAMIT NITTE</p>
                </div>
              </div>

              {/* Bottom-Center Glass Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto [transform:translateZ(40px)] transition-transform duration-700">
                <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 border-t-white/30 text-cyan-200 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_10px_#00dbe9]">
                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                  </span>
                  <span>AQUASAGA NEURAL HQ</span>
                </div>
              </div>

            </div>
          </div>
        </section>



        {/* ================================================== */}
        {/* DEVELOPMENT TEAM SECTION */}
        {/* ================================================== */}
        <section className="space-y-8 w-full pt-16">
          <div className="text-center space-y-2 mb-10 relative z-10">
            <div className="flex items-center justify-center space-x-2 text-cyan-300 text-[11px] font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,219,233,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
              <span>ENGINEERING</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00dbe9] animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase drop-shadow-[0_0_20px_rgba(0,219,233,0.5)]">
              DEVELOPMENT TEAM
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6 w-full">
            {developmentTeam.map((dev) => (
              <DeveloperCard key={dev.id} dev={dev} imageErrorMap={imageErrorMap} handleImageError={handleImageError} hideAllContacts={true} />
            ))}
          </div>
        </section>

      </main>

      {/* ================================================== */}
      {/* FOOTER - MATCHING AQUASAGA OCEAN COLORS & SLEEK DESIGN */}
      {/* ================================================== */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-white/5 to-[#00030a] py-12 relative z-10 text-center space-y-6 backdrop-blur-lg">

        {/* Matching AQUASAGA Social Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Instagram SAMCA */}
          <a
            href="https://www.instagram.com/samca_nitte_mca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 border-t-white/20 text-cyan-200 hover:text-white hover:border-cyan-300 hover:bg-white/10 backdrop-blur-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_25px_rgba(0,219,233,0.3)] hover:-translate-y-1 group"
          >
            <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>SAMCA</span>
          </a>

          {/* Instagram SEMAPHORE.26 */}
          <a
            href="https://www.instagram.com/samca_nitte_mca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 border-t-white/20 text-cyan-200 hover:text-white hover:border-cyan-300 hover:bg-white/10 backdrop-blur-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_25px_rgba(0,219,233,0.3)] hover:-translate-y-1 group"
          >
            <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>SEMAPHORE.26</span>
          </a>

          {/* YouTube SAMCA */}
          <a
            href="https://www.youtube.com/@SAMCANMAMIT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 border-t-white/20 text-cyan-200 hover:text-white hover:border-cyan-300 hover:bg-white/10 backdrop-blur-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_25px_rgba(0,219,233,0.3)] hover:-translate-y-1 group"
          >
            <svg className="w-4 h-4 fill-currentColor text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>SAMCA</span>
          </a>
        </div>

        {/* Thin Accent Line Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

        {/* Cyber Interface Telemetry Badge Bar */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-cyan-200 font-mono text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase shadow-sm">
            <span>AQUASAGA_DEVELOPMENT_INTERFACE_v2K26.47</span>
            <span className="text-white/30">|</span>
            <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>NEURAL_LINK_ESTABLISHED</span>
          </div>

          <p className="text-[10px] sm:text-xs text-slate-400/80 font-mono tracking-wider pt-1">
            Built with dedication by the Semaphore 2K26 Development Team
          </p>
        </div>

      </footer>

    </div>
  );
}
