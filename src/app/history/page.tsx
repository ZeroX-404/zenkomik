"use client";

import Link from "next/link";
import Image from "next/image";
import { readJson, writeJson } from "@/lib/storage";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/text";

type HistoryItem = {
  id_chapter: string;
  id_series?: string;
  title?: string;
  ch_name?: string;
  image?: string;
  date?: number;
  read_at?: number;
  last_read?: number;
};

const KEY_PRIMARY = "read_history";
const KEY_FALLBACK = "reading_history";

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

function getSeriesSlug(item: HistoryItem) {
  const title = String(item.title || "").trim();
  const id = String(item.id_series || "").trim();
  return slugify(title) || id || "";
}

function getContinueHref(item: HistoryItem) {
  const seriesSlug = getSeriesSlug(item);
  const chapterText = extractChapterNumberText(item.ch_name);
  if (seriesSlug && chapterText) {
    return `/series/${encodeURIComponent(seriesSlug)}/${encodeURIComponent(`chapter-${chapterText}`)}`;
  }
  return `/chapter/${encodeURIComponent(item.id_chapter)}`;
}

function loadHistory(): HistoryItem[] {
  const a = readJson<unknown>(KEY_PRIMARY, []);
  const b = readJson<unknown>(KEY_FALLBACK, []);
  const listA = Array.isArray(a) ? (a as HistoryItem[]) : [];
  const listB = Array.isArray(b) ? (b as HistoryItem[]) : [];

  const byId = new Map<string, HistoryItem>();
  for (const item of [...listA, ...listB]) {
    if (!item?.id_chapter) continue;
    byId.set(item.id_chapter, item);
  }
  return Array.from(byId.values()).sort(
    (x, y) =>
      (y.date ?? y.read_at ?? y.last_read ?? 0) - (x.date ?? x.read_at ?? x.last_read ?? 0)
  );
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  function clearAll() {
    setItems([]);
    writeJson(KEY_PRIMARY, []);
    writeJson(KEY_FALLBACK, []);
  }

  return (
    <div className="min-h-screen pb-10">
      <main className="container mx-auto px-4 mt-8 space-y-6 pb-24 md:pb-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Riwayat Baca</h1>
          {items.length ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#151515] border border-gray-800 hover:border-red-600 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Hapus semua
            </button>
          ) : null}
        </div>

        {!items.length ? (
          <p className="text-gray-400">Belum ada riwayat baca.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {items.map((h) => {
              const cover = h.image ? `/api/proxy?url=${encodeURIComponent(h.image)}` : "/placeholder-comic.svg";
              const title = String(h.title || "Komik");
              const chapterText = extractChapterNumberText(h.ch_name);
              const badge = chapterText ? `LANJUT CH. ${chapterText}` : `LANJUT`;
              const continueHref = getContinueHref(h);

              const seriesSlug = getSeriesSlug(h);
              const seriesHref = seriesSlug ? `/series/${encodeURIComponent(seriesSlug)}` : continueHref;

              return (
                <div key={h.id_chapter} className="group space-y-2">
                  <Link
                    href={continueHref}
                    className="relative block aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/5 bg-[#111] shadow-xl"
                    aria-label={`Lanjut baca ${title}`}
                  >
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="px-2 py-1 rounded-lg bg-blue-600/90 border border-blue-500/40 text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                        {badge}
                      </div>
                    </div>
                  </Link>

                  <Link href={seriesHref} className="block">
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-2 group-hover:text-blue-400 transition">
                      {title}
                    </h3>
                    {h.ch_name ? (
                      <p className="text-[10px] text-gray-500 font-medium truncate">{h.ch_name}</p>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
