"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { readJson } from "@/lib/storage";

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
}: {
  id_series: string;
  first_chapter_id?: string;
}) {
  const [lastRead, setLastRead] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const history = loadHistory();
    const found = history.find((item) => item.id_series === id_series);
    setLastRead(found || null);
  }, [id_series]);

  if (lastRead) {
    const label =
      lastRead.ch_name || lastRead.chapter_name || lastRead.chapter_title || "Chapter Terakhir";
    return (
      <Link
        href={`/chapter/${lastRead.id_chapter}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20"
      >
        <Play className="w-5 h-5 fill-current" />
        Lanjut Baca: {label}
      </Link>
    );
  }

  if (first_chapter_id) {
    return (
      <Link
        href={`/chapter/${first_chapter_id}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition"
      >
        <Play className="w-5 h-5 fill-current" />
        Mulai Baca
      </Link>
    );
  }

  return null;
}
