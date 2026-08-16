"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Scene />
    </main>
  );
}
