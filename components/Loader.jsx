import React, { useEffect, useRef, useState } from 'react';

export default function Loader({ loading, progress, error, onRetry }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);

  // Drive the counter from elapsed time on a single rAF loop rather than chaining
  // one +1 increment per React re-render. The old approach needed 100 sequential
  // renders to reach 100%, each waiting on a 10ms timer AND competing with the
  // Three.js render loop for the main thread — so on a busy scene the overlay
  // could linger long after every asset had actually finished loading.
  const targetRef = useRef(0);
  const valueRef = useRef(0);

  useEffect(() => {
    targetRef.current = loading ? progress : 100;
  }, [loading, progress]);

  useEffect(() => {
    let rafId;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const target = targetRef.current;
      const gap = target - valueRef.current;

      if (gap > 0.01) {
        // Close the remaining gap exponentially, with a floor so it always keeps
        // visibly moving. Converges in a few frames instead of a hundred renders.
        const step = Math.max(gap * dt * 6.0, dt * 45.0);
        valueRef.current = Math.min(target, valueRef.current + step);

        const rounded = Math.floor(valueRef.current);
        setDisplayProgress((prev) => (prev !== rounded ? rounded : prev));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
  useEffect(() => {
    if (error) return; // hold the curtain up so the retry affordance stays reachable
    if (!loading && displayProgress === 100) {
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, displayProgress, error]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0908] transition-opacity duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${!shouldHide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`w-full max-w-lg px-8 transition-all duration-1000 transform ${!shouldHide ? "translate-y-0 opacity-100 delay-300" : "-translate-y-8 opacity-0"
          }`}
      >
        <div className="flex items-end justify-center gap-[3px] mb-12 h-8">
          {[0.1, 0.3, 0.5, 0.7, 0.5, 0.3, 0.1].map((delay, i) => (
            <div
              key={i}
              className="w-1.5 bg-blue-500 rounded-full shadow-[blue]"
              style={{
                height: '100%',
                animation: `eq 1.2s ease-in-out infinite`,
                animationDelay: `${delay}s`
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
        <div className="w-full h-[1px] bg-[#2f2c28] mb-6">
          <div
            className="h-full bg-[#eae5de] transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#8f8a84] font-medium">
            DEPLOYING INTO THE DEEP NOW!
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
