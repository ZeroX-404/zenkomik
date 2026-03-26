"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Clock, Play } from "lucide-react";
import { readJson } from "@/lib/storage";
import { slugify } from "@/lib/text";

type HistoryItem = {
  id_series?: string;
  id_chapter?: string;
  title?: string;
  ch_name?: string;
  chapter_name?: string;
  chapter_title?: string;
  image?: string;
  date?: number;
  read_at?: number;
  last_read?: number;
};

function extractChapterNumberText(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;

  const cleaned = raw
    .replace(/^chapter\s*/i, "")
    .replace(/^ch\.?\s*/i, "")
    .replace(/^episode\s*/i, "")
    .replace(/_/g, ".")
    .replace(/^chapter-/, "")
    .replace(/^ch-/, "");

  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match?.[1]) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
}

function loadHistory() {
  const a = readJson<unknown>("read_history", []);
  const b = readJson<unknown>("reading_history", []);
  const listA = Array.isArray(a) ? (a as HistoryItem[]) : [];
  const listB = Array.isArray(b) ? (b as HistoryItem[]) : [];

  return [...listA, ...listB].sort(
    (x, y) =>
      (y.date ?? y.read_at ?? y.last_read ?? 0) - (x.date ?? x.read_at ?? x.last_read ?? 0)
  );
}

export default function ContinueReadingHub() {
  const [lastRead, setLastRead] = useState<HistoryItem | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const history = loadHistory();
    setLastRead(history[0] || null);
  }, []);

  useEffect(() => {
    if (!lastRead) return;
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, [lastRead]);

  const href = useMemo(() => {
    if (!lastRead) return null;
    const chapterId = String(lastRead.id_chapter || "").trim();
    const seriesId = String(lastRead.id_series || "").trim();
    const title = String(lastRead.title || "").trim();
    const chapterText =
      extractChapterNumberText(lastRead.ch_name) ||
      extractChapterNumberText(lastRead.chapter_name) ||
      extractChapterNumberText(lastRead.chapter_title);

    const seriesSegment = slugify(title) || seriesId;
    if (seriesSegment && chapterText) {
      return `/series/${encodeURIComponent(seriesSegment)}/${encodeURIComponent(`chapter-${chapterText}`)}`;
    }

    return chapterId ? `/chapter/${encodeURIComponent(chapterId)}` : null;
  }, [lastRead]);

  if (!lastRead || !href) return null;

  const title = String(lastRead.title || "Lanjut membaca");
  const label = String(
    lastRead.ch_name || lastRead.chapter_name || lastRead.chapter_title || "Chapter"
  );
  const cover = String(lastRead.image || "").trim();
  const imgSrc = cover ? `/api/proxy?url=${encodeURIComponent(cover)}` : "/placeholder-comic.svg";

  return (
    <section
      className={`relative overflow-hidden bg-blue-600/10 border border-blue-500/20 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 hover:bg-blue-600/15 transition-all will-change-transform ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } transition-[opacity,transform] duration-500 ease-out`}
    >
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500/90 via-blue-400/30 to-transparent" />

      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <div className="relative w-12 h-16 md:w-14 md:h-20 rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0 shadow-lg shadow-blue-900/10">
          <Image src={imgSrc} alt={title} fill className="object-cover" sizes="80px" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Clock size={11} />
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em]">
              Lanjut Baca
            </p>
          </div>
          <h3 className="text-xs md:text-sm font-bold text-white leading-tight truncate uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] md:text-[11px] text-gray-300/80 truncate">{label}</p>
        </div>
      </div>

      <Link
        href={href}
        className="shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-black hover:bg-blue-500 transition shadow-lg shadow-blue-900/25 active:scale-95 md:active:scale-100 w-10 h-10 rounded-full md:w-auto md:h-auto md:px-6 md:py-3 md:rounded-2xl"
      >
        <Play size={18} className="fill-current md:mr-0.5" />
        <span className="hidden md:inline text-xs tracking-widest uppercase">Gas Baca</span>
      </Link>
    </section>
  );
}
