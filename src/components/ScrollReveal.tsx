"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export default function ScrollReveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealState, setRevealState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setRevealState("visible");
      return;
    }

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.85;
    if (alreadyInView) {
      setRevealState("visible");
      return;
    }

    setRevealState("hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealState("visible");
            observer.unobserve(entry.target);
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${
        revealState === "hidden"
          ? "scroll-reveal--hidden"
          : revealState === "visible"
            ? "scroll-reveal--visible"
            : ""
      } ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
