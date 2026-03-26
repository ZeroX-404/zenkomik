"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { slugify } from "@/lib/text";

type LatestChapter = {
  chapter: number;
  id_chapter: string;
  releaseTime: string;
};

type Comic = {
  id_series: string;
  title: string;
  image: string;
  type?: string;
  rating?: string;
  latestChapters?: LatestChapter[];
};

const FILTERS = ["Minggu ini", "Bulan ini", "Sepanjang masa"] as const;

function parseRating(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

type Props = {
  data: Comic[];
  title?: string;
  showHeader?: boolean;
  showFilters?: boolean;
};

export default function PopularHorizontal({
  data,
  title = "Manga Populer",
  showHeader = true,
  showFilters = true,
}: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(FILTERS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // UI-only filter for now (API populer belum punya parameter timeframe).
  const items = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  const showTopBar = showHeader || showFilters;

  return (
    <section className="space-y-6 relative group/popular">
      {showTopBar ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          {showHeader ? (
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {showFilters ? (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap border ${
                    filter === f
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : "bg-[#151515] border-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover/popular:opacity-100 transition hidden md:block border border-white/10"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover/popular:opacity-100 transition hidden md:block border border-white/10"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth px-2"
      >
        {items.map((c) => {
          const img = c.image
            ? `/api/proxy?url=${encodeURIComponent(c.image)}`
            : "/placeholder-comic.svg";

          const latest = c.latestChapters?.[0]?.chapter;
          const rating = parseRating(c.rating);
          const typeLabel = (c.type || "Manga").toString();

          return (
            <Link
              key={c.id_series}
              href={`/series/${encodeURIComponent(slugify(c.title) || c.id_series)}`}
              className="relative min-w-[150px] md:min-w-[190px] aspect-[3/4.2] rounded-xl md:rounded-2xl overflow-hidden snap-start group border border-white/5 bg-[#111] flex-shrink-0"
            >
              <Image
                src={img}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 150px, 190px"
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter text-gray-200 border border-white/10">
                {typeLabel}
              </div>

              <div className="absolute bottom-3 left-3 right-3 space-y-2">
                <h3 className="text-xs md:text-[13px] font-bold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-blue-500 uppercase">
                    {typeof latest === "number" ? `Ch. ${latest}` : "Ch. —"}
                  </span>
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-white">{rating ?? "—"}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
