"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProfileSidebar({ user }) {
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user/register");
  };

  return (
    <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,100,150,0.15)] flex flex-col items-center">
        <img
          src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name + "&background=cffafe&color=164e63"}
          alt={user.name}
          className="w-24 h-24 rounded-full mb-4 shadow-md object-cover border-4 border-white/60"
        />
        <h2 className="text-xl font-extrabold text-cyan-950 text-center uppercase tracking-wider">{user.name}</h2>
        <p className="text-sm text-cyan-800/80 mb-6 text-center">{user.email}</p>

        <div className="w-full space-y-3 mb-6 border-t border-cyan-200/50 pt-4">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-cyan-900">Role:</span>
            <span className="text-cyan-800 font-medium">{user.role || 'Participant'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-cyan-900">College:</span>
            <span className="text-cyan-800 font-medium text-right max-w-[60%] line-clamp-2">
              {user.collegeName || user.college?.collegeName || 'N/A'}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1.5">
          {['My Dashboard', 'My Profile', 'Events', 'Settings', 'Help'].map((item, idx) => (
            <button 
              key={idx}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                idx === 0 
                  ? "bg-cyan-500/15 text-cyan-900 border border-cyan-400/30" 
                  : "text-cyan-800/70 hover:bg-white/40 hover:text-cyan-900"
              }`}
            >
              {item}
            </button>
          ))}

          <div className="h-px bg-cyan-200/50 my-2"></div>

          <button 
            onClick={handleLogout}
            className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-500/90 hover:bg-red-50/50 hover:text-red-600 transition-all border border-transparent hover:border-red-200/50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
