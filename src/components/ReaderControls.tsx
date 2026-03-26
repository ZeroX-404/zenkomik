"use client";

import { ChevronUp, Maximize, Minimize, Move, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { readJson, writeJson } from "@/lib/storage";

type DockSide = "left" | "right";

type Prefs = {
  dockSide?: DockSide;
  autoScrollSpeed?: number;
  autoScrollPaused?: boolean;
};

const PREF_KEY = "reader_controls:prefs";

export default function ReaderControls({
  isTheater,
  onToggleTheater,
}: {
  isTheater: boolean;
  onToggleTheater: () => void;
}) {
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [dockSide, setDockSide] = useState<DockSide>("right");
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = readJson<unknown>(PREF_KEY, null);
    if (!raw || typeof raw !== "object") return;
    const prefs = raw as Prefs;

    if (prefs.dockSide === "left" || prefs.dockSide === "right") setDockSide(prefs.dockSide);
    if (typeof prefs.autoScrollSpeed === "number" && Number.isFinite(prefs.autoScrollSpeed)) {
      setAutoScrollSpeed(Math.max(0, Math.min(20, Math.round(prefs.autoScrollSpeed))));
    }
    if (typeof prefs.autoScrollPaused === "boolean") setAutoScrollPaused(prefs.autoScrollPaused);
  }, []);

  useEffect(() => {
    const prefs: Prefs = {
      dockSide,
      autoScrollSpeed,
      autoScrollPaused,
    };
    writeJson(PREF_KEY, prefs);
  }, [autoScrollPaused, autoScrollSpeed, dockSide]);

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
    if (autoScrollSpeed <= 0 || autoScrollPaused) return;

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
  }, [autoScrollPaused, autoScrollSpeed]);

  const isAutoScrolling = autoScrollSpeed > 0 && !autoScrollPaused;

  function toggleAutoScroll() {
    if (autoScrollSpeed <= 0) {
      setAutoScrollSpeed(4);
      setAutoScrollPaused(false);
      return;
    }
    setAutoScrollPaused((v) => !v);
  }

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
        className={`fixed bottom-6 ${
          dockSide === "right" ? "right-6" : "left-6"
        } z-50 flex flex-col gap-3 transition-opacity duration-500 ${
          isTheater ? "opacity-20 hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-4 items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDockSide((v) => (v === "right" ? "left" : "right"))}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 transition"
              title="Pindah posisi"
              aria-label="Pindah posisi"
            >
              <Move size={18} />
            </button>

            <button
              type="button"
              onClick={toggleAutoScroll}
              className={`p-2 rounded-xl transition ${
                isAutoScrolling
                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "bg-blue-600/20 text-blue-200 hover:bg-blue-600/30"
              }`}
              title={isAutoScrolling ? "Pause auto-scroll" : "Play auto-scroll"}
              aria-label={isAutoScrolling ? "Pause auto-scroll" : "Play auto-scroll"}
            >
              {isAutoScrolling ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={onToggleTheater}
              className={`p-2 rounded-xl transition ${
                isTheater ? "bg-blue-600 text-white" : "hover:bg-gray-900 text-gray-400"
              }`}
              title="Theater Mode"
              aria-label="Toggle theater mode"
            >
              {isTheater ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Auto-scroll: {autoScrollSpeed}
            </span>
            <input
              type="range"
              min={0}
              max={20}
              value={autoScrollSpeed}
              onChange={(e) => {
                const next = Number(e.target.value);
                setAutoScrollSpeed(next);
                if (next <= 0) setAutoScrollPaused(false);
                else setAutoScrollPaused(false);
              }}
              className="w-32 accent-blue-500"
              aria-label="Auto scroll speed"
            />
          </div>

          {autoScrollSpeed > 0 ? (
            <button
              type="button"
              onClick={() => setAutoScrollPaused(false)}
              className={`text-[10px] font-bold uppercase tracking-widest ${
                autoScrollPaused ? "text-gray-300 hover:text-white" : "text-gray-500"
              }`}
              aria-label="Resume auto scroll"
            >
              {autoScrollPaused ? "Paused • Tap Play" : "Scrolling"}
            </button>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Auto-scroll off
            </span>
          )}
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
