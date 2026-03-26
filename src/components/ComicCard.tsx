"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/text";
import { readJson } from "@/lib/storage";

type LatestChapter = {
  chapter: number;
  id_chapter: string;
  releaseTime: string;
  url?: string;
};

type Comic = {
  title: string;
  id_series: string;
  image: string;
  type?: string;
  rating?: string;
  seriesUrl?: string;
  latestChapters?: LatestChapter[];
};

type HistoryItem = {
  id_series?: string;
  ch_name?: string;
  chapter_name?: string;
  chapter_title?: string;
  date?: number;
  read_at?: number;
  last_read?: number;
};

function parseRating(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function extractChapterNumber(value: unknown) {
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
  return Number.isFinite(n) ? n : null;
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

function getMaxChapterCount(comic: Comic) {
  const heroCount = Number((comic as any)?.hero?.chapterCount);
  if (Number.isFinite(heroCount) && heroCount > 0) return heroCount;

  const latest = Array.isArray(comic.latestChapters) ? comic.latestChapters : [];
  const nums = latest.map((ch) => Number(ch?.chapter)).filter((n) => Number.isFinite(n)) as number[];
  if (!nums.length) return null;
  return Math.max(...nums);
}

function getFlag(type: string | undefined) {
  const t = (type || "").toLowerCase();
  if (t === "manhwa") return "🇰🇷";
  if (t === "manga") return "🇯🇵";
  if (t === "manhua") return "🇨🇳";
  return "🏳️";
}

function getTypeClass(type: string | undefined) {
  const t = (type || "").toLowerCase();
  if (t === "manhwa") return "text-blue-400";
  if (t === "manga") return "text-pink-400";
  if (t === "manhua") return "text-orange-400";
  return "text-gray-300";
}

function buildMirrorSeriesUrl(baseUrl: string, seriesId: string) {
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}/komik/${encodeURIComponent(seriesId)}`;
}

function buildMirrorChapterUrl(baseUrl: string, chapterId: string) {
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}/chapter/${encodeURIComponent(chapterId)}`;
}

function toAbsoluteUrl(href: string, baseUrl: string): string | null {
  const raw = (href || "").trim();
  if (!raw) return null;
  try {
    return new URL(raw).toString();
  } catch {
    // ignore
  }
  if (!baseUrl) return null;
  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return null;
  }
}

function formatChapterSegment(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  const text = Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
  return `chapter-${text}`;
}

export default function ComicCard({ comic, isMirror = false }: { comic: Comic; isMirror?: boolean }) {
  const placeholder = "/placeholder-comic.svg";
  const initial = comic?.image
    ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
    : placeholder;
  const [imgSrc, setImgSrc] = useState(initial);
  const [progressPct, setProgressPct] = useState(0);

  const rating = parseRating(comic.rating);
  const typeLabel = (comic.type || (isMirror ? "Mirror" : "Manga")).toString();
  const mirrorBaseUrl = (process.env.NEXT_PUBLIC_MIRROR_BASE_URL || "").trim();

  const externalSeriesHref = isMirror
    ? toAbsoluteUrl(comic.seriesUrl || "", mirrorBaseUrl) ||
      (mirrorBaseUrl ? buildMirrorSeriesUrl(mirrorBaseUrl, comic.id_series) : null)
    : null;
  const seriesSlug = slugify(String(comic.title || "")) || String(comic.id_series || "");
  const seriesHref = externalSeriesHref || `/series/${encodeURIComponent(seriesSlug)}`;
  const seriesIsExternal = Boolean(externalSeriesHref);
  const maxChapter = getMaxChapterCount(comic);

  useEffect(() => {
    try {
      const history = loadHistory();
      const lastRead = history.find((h) => String(h?.id_series || "") === String(comic.id_series));
      if (!lastRead) {
        setProgressPct(0);
        return;
      }

      const lastNumber =
        extractChapterNumber(lastRead.ch_name) ||
        extractChapterNumber(lastRead.chapter_name) ||
        extractChapterNumber(lastRead.chapter_title);

      if (!lastNumber || !maxChapter) {
        setProgressPct(0);
        return;
      }

      const ratio = lastNumber / maxChapter;
      const pct = Math.max(0, Math.min(1, ratio)) * 100;
      setProgressPct(pct);
    } catch {
      setProgressPct(0);
    }
  }, [comic.id_series, maxChapter]);

  return (
    <div className="group relative bg-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.35)]">
      <div className="relative aspect-[3/4.2] overflow-hidden bg-black">
        <Image
          src={imgSrc}
          alt={comic.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover group-hover:scale-110 transition duration-700"
          onError={() => setImgSrc(placeholder)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-tighter">
          <span>{getFlag(comic.type)}</span>
          <span className={getTypeClass(comic.type)}>{typeLabel}</span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-yellow-500 text-[10px] font-bold">
          <Star size={10} fill="currentColor" />
          <span className="text-white">{rating ?? "—"}</span>
        </div>

        {isMirror ? (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-[40px] font-black text-white/5 rotate-12 select-none uppercase">
              Mirror
            </span>
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 right-3 space-y-2 z-20 pointer-events-none">
          <h3 className="text-xs md:text-[13px] font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition">
            {comic.title}
          </h3>

          <div className="flex flex-col gap-1">
            {comic.latestChapters?.slice(0, 2).map((ch) => {
              const externalChapterHref = isMirror
                ? toAbsoluteUrl(ch.url || "", mirrorBaseUrl) ||
                  (mirrorBaseUrl ? buildMirrorChapterUrl(mirrorBaseUrl, ch.id_chapter) : null)
                : null;
              const chapterSegment = formatChapterSegment(ch.chapter);
              const internalChapterHref = chapterSegment
                ? `/series/${encodeURIComponent(seriesSlug)}/${encodeURIComponent(chapterSegment)}`
                : `/chapter/${ch.id_chapter}`;
              const chapterHref = externalChapterHref || internalChapterHref;
              const chapterIsExternal = Boolean(externalChapterHref);
              return (
                <Link
                  key={ch.id_chapter}
                  href={chapterHref}
                  target={chapterIsExternal ? "_blank" : undefined}
                  rel={chapterIsExternal ? "noreferrer noopener" : undefined}
                  className="pointer-events-auto flex justify-between items-center bg-white/5 hover:bg-blue-600 px-2 py-1 rounded text-[9px] font-bold text-gray-300 hover:text-white transition"
                >
                  <span>Ch. {ch.chapter}</span>
                  <span className="opacity-50 font-medium">{ch.releaseTime}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href={seriesHref}
          target={seriesIsExternal ? "_blank" : undefined}
          rel={seriesIsExternal ? "noreferrer noopener" : undefined}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">Buka {comic.title}</span>
        </Link>

        {progressPct > 0 ? (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30 pointer-events-none">
            <div
              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-[width] duration-700"
              style={{ width: `${Math.round(progressPct)}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
