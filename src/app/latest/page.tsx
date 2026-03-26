import ComicCard from "@/components/ComicCard";
import SectionHeader from "@/components/SectionHeader";
import { mirrorFallbackRows } from "@/data/mirrorFallback";
import { getLatest } from "@/lib/api";
import { fetchMirrorContentsFeed } from "@/lib/mirrorFeed";
import { mapMirrorFallbackRows } from "@/lib/mirrorFallback";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Update Terbaru - ZENKOMIK",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeUrl(url: string): string {
  const raw = url.trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname}`.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

function getComicKey(comic: any): string | null {
  const seriesUrl = normalizeUrl(toText(comic?.seriesUrl || comic?.url || ""));
  if (seriesUrl) return `url:${seriesUrl}`;

  const id = toText(comic?.id_series || comic?.id || "").trim();
  if (id) return `id:${id}`;

  const title = normalizeTitle(toText(comic?.title || ""));
  if (title) return `title:${title}`;

  return null;
}

function mergeComics(lists: any[][]): any[] {
  const out: any[] = [];
  const seen = new Map<string, any>();

  for (const list of lists) {
    for (const item of asArray<any>(list)) {
      const key = getComicKey(item);
      if (!key) {
        out.push(item);
        continue;
      }

      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, item);
        out.push(item);
        continue;
      }

      if (!existing.seriesUrl && item.seriesUrl) existing.seriesUrl = item.seriesUrl;
      if (!existing.type && item.type) existing.type = item.type;
      if (!existing.rating && item.rating) existing.rating = item.rating;
      if (!existing.image && item.image) existing.image = item.image;
      if (
        (!Array.isArray(existing.latestChapters) || existing.latestChapters.length === 0) &&
        Array.isArray(item.latestChapters) &&
        item.latestChapters.length
      ) {
        existing.latestChapters = item.latestChapters;
      }
    }
  }

  return out;
}

function parseReleaseTimeToUnixSeconds(releaseTime: unknown, now: number): number | null {
  const text = toText(releaseTime).trim();
  if (!text) return null;

  const lowered = text.toLowerCase();
  if (lowered.includes("baru")) return now;

  const match = lowered.match(/(\d+)\s*(menit|jam|hari|minggu|bulan|tahun)\s*lalu/);
  if (match) {
    const n = Number(match[1]);
    const unit = match[2];
    const multiplier =
      unit === "menit"
        ? 60
        : unit === "jam"
          ? 3600
          : unit === "hari"
            ? 86400
            : unit === "minggu"
              ? 604800
              : unit === "bulan"
                ? 2592000
                : unit === "tahun"
                  ? 31536000
                  : 0;
    if (multiplier && Number.isFinite(n)) return now - n * multiplier;
  }

  const parsedMs = Date.parse(text);
  if (!Number.isNaN(parsedMs)) return Math.floor(parsedMs / 1000);

  return null;
}

function getUpdatedAtSeconds(comic: any, now: number): number | null {
  const direct = Number(comic?.updatedAt ?? comic?.updated_at);
  if (Number.isFinite(direct)) return direct;

  const firstChapter = Array.isArray(comic?.latestChapters) ? comic.latestChapters[0] : null;
  return parseReleaseTimeToUnixSeconds(firstChapter?.releaseTime, now);
}

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parsePositiveInt(value: unknown, fallback: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default async function LatestPage({
  searchParams,
}: {
  searchParams: { type?: string; page?: string; source?: string };
}) {
  const rawType = String(searchParams?.type || "project").toLowerCase();
  const type = rawType === "mirror" ? "mirror" : "project";
  const page = parsePage(searchParams?.page);
  const source = type === "mirror" ? String(searchParams?.source || "").trim() : "";

  let items: any[] = [];
  let pagination: any = null;
  if (type === "mirror") {
    const [apiSettled, contentsSettled] = await Promise.allSettled(
      page === 1
        ? [getLatest("mirror", page, source || undefined), fetchMirrorContentsFeed(source || undefined)]
        : [getLatest("mirror", page, source || undefined), Promise.resolve([])]
    );

    const apiItems =
      apiSettled.status === "fulfilled" ? asArray<any>(apiSettled.value?.data) : [];
    pagination = apiSettled.status === "fulfilled" ? (apiSettled.value as any)?.pagination : null;
    const contentsItems =
      contentsSettled.status === "fulfilled" ? asArray<any>(contentsSettled.value) : [];

    items = mergeComics([apiItems, contentsItems]);

    const now = Math.floor(Date.now() / 1000);
    const scored = items.map((item, index) => ({
      item,
      index,
      updatedAt: getUpdatedAtSeconds(item, now) ?? -1,
    }));
    scored.sort((a, b) => b.updatedAt - a.updatedAt || a.index - b.index);
    items = scored.map((s) => s.item);

    if (!items.length && page === 1) {
      items = mapMirrorFallbackRows(mirrorFallbackRows);
    }
  } else {
    try {
      const latest = await getLatest(type, page);
      items = asArray<any>(latest.data);
      pagination = (latest as any)?.pagination ?? null;
    } catch {
      items = [];
      pagination = null;
    }
  }

  const title = type === "mirror" ? "Mirror Updates" : "Update Project";
  const icon = type === "mirror" ? Globe : Zap;

  const currentPage = parsePositiveInt(pagination?.currentPage, page);
  const totalPages = parsePositiveInt(pagination?.totalPages, 1);

  function buildHref(nextPage: number) {
    const params = new URLSearchParams();
    params.set("type", type);
    if (type === "mirror" && source) params.set("source", source);
    const safePage = Math.max(1, nextPage);
    if (safePage !== 1) params.set("page", String(safePage));
    const qs = params.toString();
    return `/latest?${qs}`;
  }

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <SectionHeader title={title} icon={icon} />
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((c: any) => (
              <ComicCard key={c.id_series} comic={c} isMirror={type === "mirror"} />
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-gray-500">Belum ada data.</p>
        )}

        {totalPages > 1 ? (
          <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4">
              <Link
                href={buildHref(currentPage - 1)}
                className={`p-4 rounded-2xl bg-[#111] border border-white/5 transition-all ${
                  currentPage <= 1
                    ? "opacity-20 pointer-events-none"
                    : "hover:bg-blue-600 hover:border-blue-500"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={24} />
              </Link>

              <div className="px-8 py-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40 text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Halaman
                </span>
                <span className="text-xl font-black">{currentPage}</span>
              </div>

              <Link
                href={buildHref(currentPage + 1)}
                className={`p-4 rounded-2xl bg-[#111] border border-white/5 transition-all ${
                  currentPage >= totalPages
                    ? "opacity-20 pointer-events-none"
                    : "hover:bg-blue-600 hover:border-blue-500"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={24} />
              </Link>
            </div>

            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Total {totalPages} halaman tersedia
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
