"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { readJson, writeJson } from "@/lib/storage";
import ReaderControls from "@/components/ReaderControls";
import ChapterImage from "@/components/ChapterImage";

type HistoryEntry = {
  id_series?: string;
  id_chapter: string;
  title?: string;
  ch_name?: string;
  image?: string;
  date?: number;
};

type ChapterLike = {
  title?: string;
  images?: string[];
  chapter_name?: string;
  chapter_title?: string;
  thumbnail?: string;
  image?: string;
  [key: string]: unknown;
};

export default function ChapterReader({
  chapterId,
  seriesId,
  seriesHref,
  prevHref,
  nextHref,
  chapter,
  fallbackChapterLabel,
}: {
  chapterId: string;
  seriesId?: string | null;
  seriesHref: string;
  prevHref?: string | null;
  nextHref?: string | null;
  chapter: ChapterLike;
  fallbackChapterLabel?: string;
}) {
  const [isTheater, setIsTheater] = useState(false);

  const images = Array.isArray(chapter?.images) ? (chapter.images as string[]) : [];
  const seriesTitle = String(chapter?.title || "Reading");
  const chapterLabel = String(
    chapter?.chapter_name || chapter?.chapter_title || fallbackChapterLabel || "Chapter"
  );
  const coverImage = String((chapter as any)?.thumbnail || (chapter as any)?.image || "").trim();

  const scrollHandler = (direction: "up" | "down") => {
    const distance = window.innerHeight * 0.6;
    window.scrollBy({
      top: direction === "down" ? distance : -distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const key = "read_history";
    const history = readJson<unknown>(key, []);
    const list = Array.isArray(history) ? (history as any[]) : [];
    const filtered = list.filter((x) => x?.id_chapter !== chapterId);

    const entry: HistoryEntry = {
      id_series: seriesId ? String(seriesId) : undefined,
      id_chapter: chapterId,
      title: seriesTitle,
      ch_name: chapterLabel,
      image: coverImage || undefined,
      date: Date.now(),
    };

    writeJson(key, [entry, ...filtered].slice(0, 20));
  }, [chapterId, chapterLabel, coverImage, seriesId, seriesTitle]);

  return (
    <div className="bg-black min-h-screen text-white transition-all duration-500">
      {/* Mobile tap zones (Kiri=Up, Tengah=Toggle UI, Kanan=Down) */}
      <div className="fixed inset-0 z-40 flex pointer-events-none md:hidden">
        <button
          type="button"
          onClick={() => scrollHandler("up")}
          className="w-1/4 h-full pointer-events-auto active:bg-white/5 transition"
          aria-label="Scroll up"
        />
        <button
          type="button"
          onClick={() => setIsTheater((v) => !v)}
          className="w-2/4 h-full pointer-events-auto"
          aria-label="Toggle menu"
        />
        <button
          type="button"
          onClick={() => scrollHandler("down")}
          className="w-1/4 h-full pointer-events-auto active:bg-white/5 transition"
          aria-label="Scroll down"
        />
      </div>

      <nav
        className={`sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 p-3 shadow-xl transition-transform duration-500 ${
          isTheater ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Link
            href={seriesHref}
            className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white"
            title="Kembali ke Detail"
            aria-label="Kembali ke Detail"
          >
            <LayoutGrid size={22} />
          </Link>

          <div className="flex flex-col items-center min-w-0 flex-1 px-2">
            <h1 className="text-[11px] text-blue-400 font-bold uppercase tracking-tighter truncate w-full text-center">
              {seriesTitle}
            </h1>
            <p className="text-[13px] font-medium text-white truncate w-full text-center">
              {chapterLabel}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {prevHref ? (
              <Link
                href={prevHref}
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg hover:bg-blue-600 transition"
                aria-label="Prev chapter"
              >
                <ChevronLeft size={20} />
              </Link>
            ) : (
              <div className="p-2 opacity-20" aria-hidden="true">
                <ChevronLeft size={20} />
              </div>
            )}

            {nextHref ? (
              <Link
                href={nextHref}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
                aria-label="Next chapter"
              >
                <ChevronRight size={20} />
              </Link>
            ) : (
              <div className="p-2 opacity-20" aria-hidden="true">
                <ChevronRight size={20} />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`max-w-2xl mx-auto cursor-pointer ${isTheater ? "py-0" : "py-4"}`}
        onClick={() => setIsTheater((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsTheater((v) => !v);
        }}
      >
        {images.map((url, i) => (
          <ChapterImage
            key={`${i}-${url}`}
            src={`/api/proxy?url=${encodeURIComponent(url)}`}
            alt={`Page ${i + 1}`}
          />
        ))}
      </div>

      <div
        className={`max-w-2xl mx-auto flex justify-between items-center p-10 border-t border-gray-900 mt-10 transition-opacity duration-500 ${
          isTheater ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {prevHref ? (
          <Link
            href={prevHref}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-bold transition"
          >
            <ChevronLeft size={20} /> PREV
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/"
          className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white transition"
          aria-label="Home"
        >
          <Home size={22} />
        </Link>

        {nextHref ? (
          <Link
            href={nextHref}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
          >
            NEXT <ChevronRight size={20} />
          </Link>
        ) : (
          <div />
        )}
      </div>

      <ReaderControls isTheater={isTheater} onToggleTheater={() => setIsTheater((v) => !v)} />
    </div>
  );
}
