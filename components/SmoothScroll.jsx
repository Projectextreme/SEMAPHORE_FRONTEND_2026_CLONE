'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5, // keeps mobile touch-scroll from feeling sluggish
    });

    // Keep ScrollTrigger's internal scroll value in sync with Lenis on every scroll tick
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis off GSAP's own ticker so both systems share one frame clock
    // instead of running two independent rAF loops that can drift apart
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Recalculate ScrollTrigger start/end positions once Lenis has initialized
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return children;
}
