"use client";

import { ChevronUp, Maximize, Minimize } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ReaderControls({
  isTheater,
  onToggleTheater,
}: {
  isTheater: boolean;
  onToggleTheater: () => void;
}) {
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;

    function compute() {
      raf = 0;
      const el = document.documentElement;
      const total = el.scrollHeight - window.innerHeight;
      const current = window.scrollY || el.scrollTop || 0;
      const ratio = total > 0 ? current / total : 0;
      const pct = Math.max(0, Math.min(1, ratio));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${pct})`;
    }

    function onChange() {
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (autoScrollSpeed <= 0) return;

    let raf = 0;
    let last = window.performance.now();

    const step = (now: number) => {
      const dt = Math.min(100, Math.max(0, now - last));
      last = now;

      const el = document.documentElement;
      const maxScroll = el.scrollHeight - window.innerHeight;
      const current = window.scrollY || el.scrollTop || 0;
      if (maxScroll <= 0 || current >= maxScroll - 1) return;

      const delta = (autoScrollSpeed * dt) / 50;
      window.scrollBy(0, delta);
      raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [autoScrollSpeed]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-800">
        <div
          ref={progressRef}
          className="h-full bg-blue-500 origin-left"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-opacity duration-500 ${
          isTheater ? "opacity-20 hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Speed: {autoScrollSpeed}
            </span>
            <input
              type="range"
              min={0}
              max={20}
              value={autoScrollSpeed}
              onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
              className="w-28 accent-blue-500"
              aria-label="Auto scroll speed"
            />
          </div>

          <button
            type="button"
            onClick={onToggleTheater}
            className={`p-3 rounded-xl transition ${
              isTheater ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
            }`}
            title="Theater Mode"
            aria-label="Toggle theater mode"
          >
            {isTheater ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition active:scale-95"
          aria-label="Scroll to top"
          title="Ke atas"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </>
  );
}
