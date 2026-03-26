"use client";

import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PromoProps = {
  image: string;
  link: string;
  title: string;
  badge?: string;
  storageKey?: string;
};

export default function PromoCard({ image, link, title, badge = "Support Admin", storageKey }: PromoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const key = useMemo(() => {
    const k = String(storageKey || "").trim();
    return k || null;
  }, [storageKey]);

  useEffect(() => {
    if (!key) return;
    try {
      if (localStorage.getItem(key) === "1") setIsVisible(false);
    } catch {
      // ignore
    }
  }, [key]);

  if (!isVisible) return null;

  return (
    <div className="relative aspect-[3/4.2] w-full group overflow-hidden rounded-2xl border border-blue-500/30 shadow-2xl bg-black">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative"
        aria-label={title}
        title={title}
      >
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 0px, 280px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-center gap-2 bg-white text-black py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
            <ExternalLink size={14} /> Klik Di Sini
          </div>
        </div>

        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase shadow-lg">
          {badge}
        </div>
      </a>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            if (key) localStorage.setItem(key, "1");
          } catch {
            // ignore
          }
          setIsVisible(false);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors z-20 border border-white/10"
        title="Tutup"
        aria-label="Tutup promo"
      >
        <X size={14} />
      </button>
    </div>
  );
}

