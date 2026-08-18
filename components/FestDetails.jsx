"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// interface EventItem {
//   id: string;
//   title: string;
//   category: "Technical" | "Management" | "Innovation" | "E-Sports & Fun" | "Creative";
//   desc: string;
//   date: string;
//   time: string;
//   venue: string;
//   prize: string;
//   rules: string[];
// }

const events = [
  {
    id: "it-quiz",
    title: "IT Quiz",
    category: "Technical",
    desc: "Test your knowledge on Programming, DBMS, Operating Systems, Networks, and Cyber Security. Battle against top tech minds.",
    date: "9 October 2026",
    time: "10:00 AM",
    venue: "Main Auditorium",
    prize: "₹ 10,000",
    rules: ["Teams of 2 members", "Preliminary written round followed by live stage quiz"],
  },
  {
    id: "it-manager",
    title: "IT Manager",
    category: "Management",
    desc: "You are the technology manager of a company. Something goes wrong. Test your leadership, crisis management, and decision-making skills.",
    date: "9 October 2026",
    time: "11:30 AM",
    venue: "MCA Seminar Hall",
    prize: "₹ 15,000",
    rules: ["Individual participation", "Multiple stress rounds & mock press conference"],
  },
  {
    id: "techno-hive",
    title: "Techno Hive",
    category: "Technical",
    desc: "A pure technical and IT-oriented challenge designed to test your core tech competencies, web dev, and adaptability.",
    date: "9 October 2026",
    time: "02:00 PM",
    venue: "Computer Lab 3",
    prize: "₹ 12,000",
    rules: ["Teams of 2 members", "Coding, debugging, and live prototype deployment"],
  },
  {
    id: "hyper-launch",
    title: "Hyper Launch",
    category: "Innovation",
    desc: "An innovation, product, and business-oriented challenge. Pitch your startup ideas and show your entrepreneurial spirit.",
    date: "10 October 2026",
    time: "09:30 AM",
    venue: "Incubation Center",
    prize: "₹ 15,000",
    rules: ["Teams of up to 3 members", "5-minute pitch + 3-minute Q&A with judges"],
  },
  {
    id: "it-debate",
    title: "IT Debate",
    category: "Technical",
    desc: "Engage in heated debates on cutting-edge tech topics, AI ethics, cyber warfare, and technological singularity.",
    date: "10 October 2026",
    time: "11:00 AM",
    venue: "Conference Room B",
    prize: "₹ 8,000",
    rules: ["2 members per team (1 For, 1 Against)", "3-minute turn + rebuttal round"],
  },
  {
    id: "gaming-hunt",
    title: "Gaming & Treasure Hunt",
    category: "E-Sports & Fun",
    desc: "Survive intense gaming trenches (BGMI & Valorant) and solve cryptic tech clues across campus to unearth the hidden treasure.",
    date: "10 October 2026",
    time: "01:30 PM",
    venue: "E-Sports Arena & CampusCrrt this pr Grounds",
    prize: "₹ 20,000",
    rules: ["Squads of 4 members", "Time-bound physical & digital clues"],
  },
  {
    id: "meme-photo",
    title: "Meme Making & Photography",
    category: "Creative",
    desc: "Showcase your humor and artistic eye in our creative digital arts and spot-photography competitions.",
    date: "10 October 2026",
    time: "03:00 PM",
    venue: "Media Studio",
    prize: "₹ 7,000",
    rules: ["Individual entries", "Original un-edited raw photos + hilarious tech memes"],
  },
];

export default function FestDetails() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showReturnBtn, setShowReturnBtn] = useState(false);

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category.toLowerCase() === activeCategory.toLowerCase());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowReturnBtn(true);
      } else {
        setShowReturnBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const section = sectionRef.current;
    if (!section) return;

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
      }
    );

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector(".cards-container"),
          start: "top 85%",
        },
      }
    );


    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-[#020914] text-white px-6 py-24 z-10 overflow-hidden border-t-2 border-cyan-500/30"
      >
        {/* Deep Ocean Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Portal World Header */}
          <div className="fest-header text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-[0.25em] uppercase mb-6 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              PORTAL GATEWAY DISCOVERED // NEW WORLD
            </div>

            <h2 className="text-sm md:text-base font-mono font-bold tracking-[0.35em] text-cyan-400 uppercase mb-3">
              9–10 October 2026 | NMAMIT Nitte
            </h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 pb-2 drop-shadow-[0_0_35px_rgba(0,200,255,0.4)]">
              SEMAPHORE 2K26
            </h3>
            <p className="mt-6 text-cyan-100/70 font-mono text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
              Welcome to the New World inside the portal. A National Level IT & Cultural Fest organized by the Department of MCA, NMAM Institute of Technology. Explore our flagship technical & cultural competitions below.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {["All", "Technical", "Management", "Innovation", "E-Sports & Fun", "Creative"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 ${activeCategory === cat
                    ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.6)] border-cyan-400"
                    : "bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:text-white"
                    }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="cards-container grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((ev, i) => (
              <div
                key={ev.id}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                onClick={() => setSelectedEvent(ev)}
                className="group relative p-8 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 backdrop-blur-xl overflow-hidden hover:border-cyan-400/80 transition-all duration-500 cursor-pointer shadow-[0_0_30px_rgba(0,200,255,0.08)] hover:shadow-[0_0_40px_rgba(0,255,255,0.25)] hover:-translate-y-1"
              >
                {/* Cyber Corner Markers */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider">
                      {ev.category}
                    </span>
                    <span className="font-mono text-xs text-cyan-400/80 tracking-widest font-bold">
                      PRIZE: {ev.prize}
                    </span>
                  </div>

                  <h4 className="text-3xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors font-mono tracking-wide">
                    {ev.title}
                  </h4>
                  <p className="text-cyan-100/70 leading-relaxed mb-8 font-sans text-sm">
                    {ev.desc}
                  </p>

                  <div className="flex justify-between items-center pt-6 border-t border-cyan-500/20 font-mono text-xs">
                    <span className="text-cyan-300/80">{ev.date}</span>
                    <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      VIEW DETAILS <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Floating Return to Surface Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-500 ${showReturnBtn ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button
          onClick={scrollToTop}
          className="group relative flex items-center gap-3 bg-black/80 border border-cyan-400/60 px-6 py-3 rounded-full backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:border-cyan-300 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-cyan-300 group-hover:text-white">
            ↑ RETURN TO SURFACE OCEAN
          </span>
        </button>
      </div>

      {/* Interactive Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-xl p-8 rounded-3xl bg-[#021020] border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(0,255,255,0.3)] text-white">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 font-mono text-cyan-400 text-sm font-bold hover:text-white"
            >
              [ CLOSE ✕ ]
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider mb-4">
              {selectedEvent.category}
            </span>

            <h3 className="text-3xl font-black font-mono text-white mb-2">{selectedEvent.title}</h3>
            <p className="text-cyan-200/80 text-sm mb-6 leading-relaxed">{selectedEvent.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 font-mono text-xs">
              <div>
                <span className="text-cyan-400/60 block">DATE & TIME</span>
                <span className="text-cyan-200 font-bold">{selectedEvent.date} @ {selectedEvent.time}</span>
              </div>
              <div>
                <span className="text-cyan-400/60 block">VENUE</span>
                <span className="text-cyan-200 font-bold">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-cyan-400/60 block">PRIZE POOL</span>
                <span className="text-cyan-300 font-bold text-sm">{selectedEvent.prize}</span>
              </div>
            </div>

            <h4 className="font-mono text-xs font-bold text-cyan-400 tracking-wider mb-2">EVENT GUIDELINES:</h4>
            <ul className="list-disc list-inside text-xs text-cyan-100/70 space-y-1 mb-8">
              {selectedEvent.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                alert(`Registration for ${selectedEvent.title} will open soon!`);
                setSelectedEvent(null);
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-mono font-bold text-black text-sm tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:brightness-110 transition-all"
            >
              REGISTER FOR {selectedEvent.title.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
