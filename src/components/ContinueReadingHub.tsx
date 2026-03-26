"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
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

  useEffect(() => {
    const history = loadHistory();
    setLastRead(history[0] || null);
  }, []);

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
    <section className="bg-blue-600/10 border border-blue-500/20 p-4 md:p-5 rounded-2xl flex items-center justify-between gap-4 hover:bg-blue-600/15 transition-all">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
          <Image src={imgSrc} alt={title} fill className="object-cover" sizes="56px" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
            Lanjut Membaca
          </p>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight truncate">
            {title}
          </h3>
          <p className="text-[11px] text-gray-300/80 truncate">{label}</p>
        </div>
      </div>

      <Link
        href={href}
        className="px-5 md:px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 whitespace-nowrap inline-flex items-center gap-2"
      >
        <Play size={16} className="fill-current" /> GAS BACA
      </Link>
    </section>
  );
}

