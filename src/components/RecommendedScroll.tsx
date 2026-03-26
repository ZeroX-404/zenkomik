"use client";

import Image from "next/image";
import Link from "next/link";
import { Book, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { slugify } from "@/lib/text";

type Comic = {
  id_series: string;
  title: string;
  image: string;
  rating?: string | number;
};

function parseRating(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function RecommendedScroll({
  title,
  data,
  type,
  limit = 12,
}: {
  title: string;
  data: Comic[];
  type: "manhwa" | "manga";
  limit?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const n = Number.isFinite(Number(limit)) ? Math.max(0, Math.trunc(Number(limit))) : 12;
    return n ? data.slice(0, n) : data;
  }, [data, limit]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  return (
    <section className="space-y-4 group/rec relative">
      <SectionHeader
        title={title}
        icon={type === "manga" ? Book : Star}
        href={`/explore?format=${type}`}
      />

      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-[55%] z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full opacity-0 group-hover/rec:opacity-100 transition hidden md:block border border-white/10 text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-[55%] z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full opacity-0 group-hover/rec:opacity-100 transition hidden md:block border border-white/10 text-white"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {items.map((comic, idx) => {
          const img = comic.image
            ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
            : "/placeholder-comic.svg";

          const rating = parseRating(comic.rating);
          const ratingText = rating === null ? "—" : rating.toFixed(1);

          return (
            <Link
              key={comic.id_series}
              href={`/series/${encodeURIComponent(slugify(comic.title) || comic.id_series)}`}
              className="relative min-w-[140px] md:min-w-[180px] aspect-[3/4.2] rounded-xl overflow-hidden snap-start group border border-white/5 bg-[#111] flex-shrink-0"
            >
              <Image
                src={img}
                alt={comic.title}
                fill
                sizes="(max-width: 768px) 140px, 180px"
                className="object-cover group-hover:scale-110 transition duration-500"
                priority={idx < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 text-yellow-500 text-[10px] border border-white/10">
                <Star size={10} fill="currentColor" />
                <span className="text-white font-bold">{ratingText}</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition">
                  {comic.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
