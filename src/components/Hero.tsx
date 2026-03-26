"use client";

import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "@/components/BookmarkButton";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Play, Star } from "lucide-react";
import { useRef } from "react";
import { slugify } from "@/lib/text";

type TrendingComic = {
  id_series: string;
  title: string;
  image: string;
  type?: string;
  rating?: string | number;
  latestChapters?: { releaseTime?: string }[];
  hero?: {
    status?: string | null;
    chapterCount?: number | null;
    genres?: string[];
    synopsis?: string;
    rating?: number | null;
    updated?: string;
  };
};

export default function Hero({ trending }: { trending: TrendingComic[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = Array.isArray(trending) ? trending.slice(0, 6) : [];

  const getTypeDetail = (type: unknown) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("manhwa")) return { label: "Manhwa", flag: "🇰🇷", color: "bg-blue-600" };
    if (t.includes("manhua")) return { label: "Manhua", flag: "🇨🇳", color: "bg-red-600" };
    if (t.includes("manga")) return { label: "Manga", flag: "🇯🇵", color: "bg-orange-600" };
    return { label: "Komik", flag: "🌐", color: "bg-gray-600" };
  };

  const parseRating = (value: unknown) => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  };

  const statusChip = (status: string) => {
    const v = status.toLowerCase();
    if (v.includes("ongo")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (v.includes("complete") || v.includes("tamat") || v.includes("end"))
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-white/10 text-gray-200 border-white/10";
  };

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  if (!items.length) {
    return (
      <div className="h-[220px] md:h-[320px] w-full rounded-2xl border border-gray-800 bg-[#151515] flex items-center justify-center text-gray-400">
        Belum ada data trending.
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#0b0b0b]">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-blue-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hidden md:block text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-blue-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hidden md:block text-white"
        aria-label="Scroll right"
      >
        <ChevronRight size={28} />
      </button>

      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {items.map((comic, i) => {
          const typeInfo = getTypeDetail(comic.type);
          const img = comic.image
            ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
            : "/placeholder-comic.svg";
          const seriesSlug = slugify(String(comic.title || "")) || String(comic.id_series || "");

          const hero = comic.hero || {};
          const status = typeof hero.status === "string" ? hero.status : null;
          const chapterCount = typeof hero.chapterCount === "number" ? hero.chapterCount : null;
          const genres = Array.isArray(hero.genres) ? hero.genres : [];
          const synopsis = typeof hero.synopsis === "string" ? hero.synopsis : "";
          const updated =
            typeof hero.updated === "string"
              ? hero.updated
              : typeof comic.latestChapters?.[0]?.releaseTime === "string"
                ? comic.latestChapters?.[0]?.releaseTime
                : "";

          const rating =
            typeof hero.rating === "number" ? hero.rating : parseRating(comic.rating);
          const ratingText = typeof rating === "number" ? rating.toFixed(1) : "—";

          return (
            <div
              key={comic.id_series}
              className="relative min-w-full h-[400px] md:h-[550px] snap-center flex-shrink-0 flex items-center"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />

              <div className="relative z-10 w-full px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
                <div className="hidden md:block relative w-64 h-[380px] flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-[#111]">
                  <Image src={img} alt={comic.title} fill sizes="256px" className="object-cover" priority={i === 0} />
                  <div
                    className={`absolute top-4 left-4 ${typeInfo.color} text-white px-3 py-1 rounded-lg text-xs font-black border border-white/10 uppercase tracking-tighter`}
                  >
                    {typeInfo.flag} {typeInfo.label}
                  </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <span className="bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-blue-900/40">
                      Trending #{i + 1}
                    </span>
                    <span
                      className={`${typeInfo.color} text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] border border-white/10`}
                      title={typeInfo.label}
                    >
                      {typeInfo.flag} {typeInfo.label}
                    </span>
                    {status ? (
                      <span
                        className={`border text-[11px] font-bold px-3 py-1.5 rounded-full uppercase ${statusChip(status)}`}
                      >
                        {status}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl line-clamp-2">
                    {comic.title}
                  </h2>

                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm font-bold text-gray-300">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" fill="currentColor" />
                      <span className="text-white text-lg">{ratingText}</span>
                    </div>
                    {chapterCount ? (
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-500" />
                        <span>{chapterCount.toLocaleString()} Chapters</span>
                      </div>
                    ) : null}
                    {updated ? (
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-purple-500" />
                        <span className="truncate max-w-[240px]">{updated}</span>
                      </div>
                    ) : null}
                  </div>

                  {genres.length ? (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {genres.slice(0, 4).map((genre) => (
                        <span
                          key={genre}
                          className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:border-blue-500 transition cursor-default"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {synopsis ? (
                    <p className="hidden md:block text-gray-300/80 text-sm leading-relaxed line-clamp-2 max-w-2xl italic">
                      {synopsis}
                    </p>
                  ) : null}

                  <div className="pt-2 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <Link
                      href={`/series/${encodeURIComponent(seriesSlug)}`}
                      className="inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl active:scale-95"
                    >
                      <Play size={20} fill="currentColor" /> BACA SEKARANG
                    </Link>
                    <BookmarkButton
                      series={{
                        id_series: comic.id_series,
                        title: comic.title,
                        image: comic.image,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
        ))}
      </div>
    </div>
  );
}
