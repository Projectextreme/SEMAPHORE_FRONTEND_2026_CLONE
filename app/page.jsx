"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/Scene"), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0908]">
      <div className="w-full max-w-lg px-8 flex flex-col items-center justify-center animate-pulse">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base tracking-[0.6em] font-medium uppercase text-[#eae5de] ml-[0.6em]">
            SEMAPHORE 2K26
          </h1>
        </div>
        <div className="text-[10px] tracking-widest text-[#8f8a84] uppercase">
          ESTABLISHING CONNECTION...
        </div>
      </div>
    </div>
  )
});
export default function Home() {
  return (
    <main className="bg-black min-h-screen relative selection:bg-cyan-500 selection:text-black">
      <Scene />
    </main>
  );
}
