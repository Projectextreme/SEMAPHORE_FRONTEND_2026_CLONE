"use client"

import React, { useState } from 'react';
import eventsData from "../../data/events.json";
import EventInfoModal from "../../components/EventInfoModal";

// Since EventInfoModal expects event.num to map to the id. Let's create a reverse map.
const reverseMap = {
  "abyssal_algorithm": "01",
  "tidal_weaver": "02",
  "oceanic_oracle": "03",
  "neptunes_arena": "04",
  "sonar_symposium": "05",
  "bermuda_enigma": "06",
  "trident_command": "07",
  "aqua_venture": "08",
  "luminescent_lens": "09",
  "synchronized_swarm": "10"
};

export default function InfoPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCardClick = (event) => {
    // EventInfoModal expects an object with 'num' property
    setSelectedEvent({ num: reverseMap[event.id] });
  };

  return (
    <div className="min-h-screen bg-[#010810] text-white p-8 font-mono pb-20 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-4 tracking-[0.2em] uppercase drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            Events Info
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent rounded-full opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map((event) => (
            <div 
              key={event.id}
              onClick={() => handleCardClick(event)}
              className="group relative bg-[#021020]/80 border border-cyan-400/20 rounded-xl p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:border-cyan-400/80 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-[50px] rounded-full group-hover:bg-cyan-400/20 transition-all duration-500"></div>
              
              <div className="text-cyan-400/60 text-[0.65rem] font-bold tracking-[0.25em] mb-3 uppercase">
                {event.category}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors drop-shadow-md">
                {event.name}
              </h3>
              
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-8">
                {event.description}
              </p>
              
              <div className="absolute bottom-6 left-6 md:left-8 flex items-center text-cyan-400 text-xs font-bold tracking-widest group-hover:translate-x-2 transition-transform">
                VIEW DETAILS <span className="ml-2 font-black">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <EventInfoModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
