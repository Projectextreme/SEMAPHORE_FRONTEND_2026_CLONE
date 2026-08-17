"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "IT Quiz",
    category: "Technical",
    desc: "Test your knowledge on Programming, DBMS, Operating Systems, Networks, and Cyber Security. 2nd Place won by Havyas B & Yashwith.",
    date: "9 October 2026",
  },
  {
    title: "IT Manager",
    category: "Management",
    desc: "You are the technology manager of a company. Something goes wrong. What decision do you make? Test your leadership and problem-solving skills.",
    date: "9 October 2026",
  },
  {
    title: "Techno Hive",
    category: "Technical",
    desc: "A pure technical and IT-oriented challenge designed to test your core tech competencies and adaptability.",
    date: "9 October 2026",
  },
  {
    title: "Hyper Launch",
    category: "Innovation",
    desc: "An innovation, product, and business-oriented challenge. Pitch your ideas and show your entrepreneurial spirit.",
    date: "10 October 2026",
  },
  {
    title: "IT Debate",
    category: "Technical",
    desc: "Engage in heated debates on the latest technology and IT-related topics.",
    date: "10 October 2026",
  },
  {
    title: "Gaming & Treasure Hunt",
    category: "E-Sports & Fun",
    desc: "Survive the gaming trenches and solve clues across the campus to find the hidden treasure.",
    date: "10 October 2026",
  },
  {
    title: "Meme Making & Photography",
    category: "Creative",
    desc: "Showcase your humor and artistic eye in our creative digital arts competitions.",
    date: "10 October 2026",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", // Tech event crowd
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800", // Coding/laptop
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800", // Gaming
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800", // VR/Tech
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", // Event lights
];

export default function FestDetails() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const galleryWrapperRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Fade in the section header
    gsap.fromTo(
      section.querySelector(".fest-header"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      },
    );

    // Stagger fade in the event cards
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 100, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector(".cards-container"),
          start: "top 85%",
        },
      },
    );

    // GSAP Horizontal Scroll Gallery
    const galleryWrapper = galleryWrapperRef.current;
    const gallery = galleryRef.current;

    if (galleryWrapper && gallery) {
      const getScrollAmount = () =>
        -(gallery.scrollWidth - window.innerWidth + 100);

      gsap.to(gallery, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: galleryWrapper,
          start: "top 10%",
          end: () => `+=${gallery.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculates on window resize
        },
      });

      // Animate images slightly on scroll for parallax feel
      const images = gallery.querySelectorAll(".gallery-img");
      images.forEach((img) => {
        gsap.to(img, {
          objectPosition: "100% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: galleryWrapper,
            start: "top 10%",
            end: () => `+=${gallery.scrollWidth - window.innerWidth}`,
            scrub: true,
          },
        });
      });
    }

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-black text-white px-6 py-24 z-10 overflow-hidden"
      >
        {/* Decorative gradient orb for deep underwater glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="fest-header text-center mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] text-blue-400 uppercase mb-4">
              9–10 October 2026
            </h2>
            <h3 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-500 pb-2">
              SEMAPHORE 2K26
            </h3>
            <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
              A National Level IT & Cultural Fest organized by the Department of
              Master of Computer Applications (MCA), NMAM Institute of
              Technology (NMAMIT), Nitte.
            </p>
          </div>

          <div className="cards-container grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md overflow-hidden hover:border-blue-500/50 transition-colors duration-500 cursor-pointer"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-bold tracking-wider mb-6">
                    {ev.category}
                  </span>
                  <h4 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {ev.title}
                  </h4>
                  <p className="text-zinc-400 leading-relaxed mb-8">
                    {ev.desc}
                  </p>

                  <div className="flex items-center pt-6 border-t border-zinc-800/80">
                    <span className="text-sm text-zinc-500 font-mono">
                      {ev.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GSAP Pinned Horizontal Gallery Section */}
      <section
        ref={galleryWrapperRef}
        className="w-full bg-black text-white py-24 overflow-hidden relative border-t border-zinc-900"
      >
        <div className="px-10 mb-16 max-w-6xl mx-auto">
          <h2 className="text-sm font-bold tracking-[0.3em] text-blue-400 uppercase mb-4">
            Flashbacks
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white">
            Memories of the Deep
          </h3>
        </div>

        {/* The scrolling track */}
        <div
          ref={galleryRef}
          className="flex flex-nowrap items-center gap-10 px-10 h-[60vh] w-max"
        >
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="relative w-[60vw] md:w-[40vw] h-full rounded-2xl overflow-hidden shrink-0 group border border-zinc-800"
            >
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Fest memory ${idx + 1}`}
                className="gallery-img absolute inset-0 w-full h-full object-cover object-[0%_50%] scale-110"
              />
            </div>
          ))}
          {/* Spacer block at the end */}
          <div className="w-[10vw] shrink-0" />
        </div>
      </section>
    </>
  );
}
