"use client";

import { useMemo, useState } from "react";
import { ImageOff, RefreshCw } from "lucide-react";

function appendRetryParam(src: string, retryCount: number) {
  if (retryCount <= 0) return src;
  const raw = String(src || "").trim();
  if (!raw) return raw;

  try {
    const url = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    url.searchParams.set("retry", String(retryCount));
    return url.toString();
  } catch {
    const join = raw.includes("?") ? "&" : "?";
    return `${raw}${join}retry=${retryCount}`;
  }
}

export default function ChapterImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const effectiveSrc = useMemo(() => appendRetryParam(src, retryCount), [src, retryCount]);

  if (error) {
    return (
      <div className="w-full aspect-[2/3] bg-[#111] flex flex-col items-center justify-center gap-4 border border-white/5 my-2 rounded-xl">
        <ImageOff size={48} className="text-gray-700" />
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
          Gagal memuat halaman
        </p>
        <button
          type="button"
          onClick={() => {
            setError(false);
            setRetryCount((v) => v + 1);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase hover:bg-blue-500 transition"
        >
          <RefreshCw size={14} /> Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0b0b0b]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={effectiveSrc}
        alt={alt}
        className="w-full h-auto block"
        onError={() => setError(true)}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 animate-shimmer bg-gradient-to-r from-[#0b0b0b] via-[#111] to-[#0b0b0b]" />
    </div>
  );
}

