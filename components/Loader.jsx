'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ loading, progress, error, onRetry }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const eqBarsRef = useRef([]);
  const tweenObj = useRef({ value: 0 });

  // GSAP Entrance Animation on Mount
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP Smooth Progress Bar & Counter Tween
  useEffect(() => {
    const target = loading ? progress : 100;

    gsap.to(tweenObj.current, {
      value: target,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        const rounded = Math.floor(tweenObj.current.value);
        setDisplayProgress(rounded);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${tweenObj.current.value}%`;
        }
      },
    });
  }, [loading, progress]);

  // GSAP Exit Choreography when loading completes
  useEffect(() => {
    if (error || loading || displayProgress < 100) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsDone(true),
      });

      tl.to(contentRef.current, {
        opacity: 0,
        y: -25,
        duration: 0.6,
        ease: 'power3.in',
      }).to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        '-=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, displayProgress, error]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0908]"
    >
      <div ref={contentRef} className="w-full max-w-lg px-8">
        <div className="flex items-end justify-center gap-[3px] mb-12 h-8">
          {[0.1, 0.3, 0.5, 0.7, 0.5, 0.3, 0.1].map((delay, i) => (
            <div
              key={i}
              ref={(el) => (eqBarsRef.current[i] = el)}
              className="w-1.5 bg-blue-500 rounded-full shadow-[blue]"
              style={{
                height: '100%',
                animation: 'eq 1.2s ease-in-out infinite',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center mb-16">
          <h1 className="text-sm md:text-base tracking-[0.6em] font-medium uppercase text-[#eae5de] ml-[0.6em]">
            SEMAPHORE 2K26
          </h1>
        </div>

        {error ? (
          <div className="text-center">
            <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-[#c8b9a6] mb-3">
              {error}
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6f6a64] mb-6">
              Check your connection and try again.
            </p>
            <button
              onClick={onRetry}
              className="px-8 py-2.5 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#eae5de] border border-[#3d3832] hover:border-[#eae5de] hover:bg-[#eae5de]/5 transition-all duration-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="w-full h-[1px] bg-[#2f2c28] mb-6 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#eae5de]"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#8f8a84] font-medium">
                DIVING INTO THE DEEP SEA..
              </span>
              <span className="text-xs md:text-sm font-bold text-[#eae5de] tracking-wider">
                {displayProgress}%
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

