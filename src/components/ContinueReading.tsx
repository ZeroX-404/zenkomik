"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { readJson } from "@/lib/storage";
import { slugify } from "@/lib/text";

type HistoryItem = {
  id_series?: string;
  id_chapter: string;
  ch_name?: string;
  chapter_name?: string;
  chapter_title?: string;
  title?: string;
  date?: number;
  read_at?: number;
  last_read?: number;
};

function extractChapterNumberText(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;

  let s = raw
    .replace(/^chapter\s*/i, "")
    .replace(/^ch\.?\s*/i, "")
    .replace(/^episode\s*/i, "")
    .trim();

  s = s.replace(/^chapter-/, "").replace(/^ch-/, "");
  if (!s) return null;

  if (/^\d+-\d+$/.test(s) && !s.includes(".")) s = s.replace("-", ".");
  s = s.replace(/_/g, ".");

  const match = s.match(/(\d+(?:\.\d+)?)/);
  const text = match?.[1] ?? null;
  if (!text) return null;

  const n = Number(text);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
}

function formatChapterSegment(value: number) {
  const text = Number.isInteger(value) ? String(Math.trunc(value)) : String(value);
  return `chapter-${text}`;
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

export default function ContinueReading({
  id_series,
  first_chapter_id,
  first_chapter_number,
  series_slug,
}: {
  id_series: string;
  first_chapter_id?: string;
  first_chapter_number?: number | null;
  series_slug?: string;
}) {
  const [lastRead, setLastRead] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const history = loadHistory();
    const found = history.find((item) => item.id_series === id_series);
    setLastRead(found || null);
  }, [id_series]);

  const seriesSlug =
    String(series_slug || "").trim() ||
    (lastRead?.title ? slugify(String(lastRead.title)) : "") ||
    String(id_series || "").trim();

  const startChapterNum =
    typeof first_chapter_number === "number" && Number.isFinite(first_chapter_number)
      ? formatChapterSegment(first_chapter_number)
      : null;

  const startHref =
    seriesSlug && startChapterNum
      ? `/series/${encodeURIComponent(seriesSlug)}/${encodeURIComponent(startChapterNum)}`
      : first_chapter_id
        ? `/chapter/${encodeURIComponent(first_chapter_id)}`
        : null;

  if (lastRead) {
    const label =
      lastRead.ch_name || lastRead.chapter_name || lastRead.chapter_title || "Chapter Terakhir";
    const continueChapterText = extractChapterNumberText(label);
    const continueHref =
      seriesSlug && continueChapterText
        ? `/series/${encodeURIComponent(seriesSlug)}/${encodeURIComponent(
            `chapter-${continueChapterText}`
          )}`
        : `/chapter/${encodeURIComponent(lastRead.id_chapter)}`;

    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href={continueHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20"
        >
          <Play className="w-5 h-5 fill-current" />
          Lanjut Baca: {continueChapterText ? `Ch. ${continueChapterText}` : label}
        </Link>

        {startHref ? (
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition border border-white/10"
          >
            Mulai dari Awal
          </Link>
        ) : null}
      </div>
    );
  }

  if (startHref) {
    return (
      <Link
        href={startHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition"
      >
        <Play className="w-5 h-5 fill-current" />
        {startChapterNum ? `Mulai dari Awal (${startChapterNum.replace(/^chapter-/, "Ch. ")})` : "Mulai dari Awal"}
      </Link>
    );
  }

  return null;
}
