import "server-only";

import type { ComicCardData } from "@/lib/api";

type Row = Record<string, unknown>;

function asRow(value: unknown): Row | null {
  if (!value || typeof value !== "object") return null;
  return value as Row;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function slugFromUrl(value: string): string {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  } catch {
    const cleaned = value.split("#")[0]?.split("?")[0] ?? value;
    const parts = cleaned.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
}

function normalizeId(value: string): string {
  return slugFromUrl(value).trim();
}

function parseChapterNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = toText(value).trim();
  if (!raw) return null;
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

function countryToFormat(countryIdRaw: unknown): string | null {
  const countryId = toText(countryIdRaw).trim().toUpperCase();
  if (!countryId) return null;
  if (countryId === "KR") return "manhwa";
  if (countryId === "JP") return "manga";
  if (countryId === "CN") return "manhua";
  return null;
}

function timeAgo(unixSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const seconds = now - unixSeconds;

  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const week = 604800;
  const month = 2592000;
  const year = 31536000;

  if (seconds < minute) return "baru saja";
  if (seconds < hour) return `${Math.floor(seconds / minute)} menit lalu`;
  if (seconds < day) return `${Math.floor(seconds / hour)} jam lalu`;
  if (seconds < week) return `${Math.floor(seconds / day)} hari lalu`;
  if (seconds < month) return `${Math.floor(seconds / week)} minggu lalu`;
  if (seconds < year) return `${Math.floor(seconds / month)} bulan lalu`;
  return `${Math.floor(seconds / year)} tahun lalu`;
}

function getUnixSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Number(toText(value));
  return Number.isFinite(n) ? n : null;
}

export function mapMirrorFallbackRows(input: unknown): ComicCardData[] {
  const root = asRow(input);
  const rows = Array.isArray(input) ? input : asArray<unknown>(root?.data);
  const out: ComicCardData[] = [];

  for (const item of rows) {
    const row = asRow(item);
    if (!row) continue;

    const title = toText(row["Judul Komik"] ?? row.title ?? row["Title"]).trim();
    const seriesUrl = toText(row["URL Komik"] ?? row.url ?? row.href ?? row.link).trim();
    const image = toText(
      row["Gambar Sampul Komik"] ?? row.image ?? row.thumbnail ?? row.cover ?? row["Cover"]
    ).trim();

    const idSeriesRaw = toText(row.id_series ?? row.slug ?? row.id).trim();
    const id_series = normalizeId(idSeriesRaw || seriesUrl);

    if (!title || !id_series) continue;

    const type = toText(
      row.type ?? row.format ?? row["Tipe"] ?? countryToFormat(row.country_id) ?? "mirror"
    ).trim();
    const rating = toText(row.rating ?? row["Rating"]).trim() || undefined;

    const lastChapters = asArray<unknown>(row.lastChapters);
    const inferredLatestChapters = lastChapters
      .map((ch) => {
        const c = asRow(ch);
        if (!c) return null;

        const chapterNumber = parseChapterNumber(c.number ?? c.chapter ?? c["Chapter"]);
        const chapterSlug = toText(c.slug ?? c.id_chapter ?? c.chapter_slug ?? c.url ?? c.href).trim();
        const id_chapter = chapterSlug ? normalizeId(chapterSlug) : "";

        const chapterUrl = toText(c["URL Chapter"] ?? c.url ?? c.href ?? c.link).trim();

        const created = asRow(c.created_at) ?? asRow(c.createdAt);
        const unix = getUnixSeconds(created?.time);
        const formatted = toText(created?.formatted).trim();
        const releaseTime = unix ? timeAgo(unix) : formatted || "Baru saja";

        if (chapterNumber === null || !id_chapter) return null;
        return { chapter: chapterNumber, id_chapter, releaseTime, url: chapterUrl || undefined };
      })
      .filter(Boolean) as { chapter: number; id_chapter: string; releaseTime: string; url?: string }[];

    const chapterNumber =
      inferredLatestChapters.length > 0
        ? null
        : parseChapterNumber(row["Chapter Terbaru"] ?? row.latestChapter ?? row.chapter);
    const timeText =
      inferredLatestChapters.length > 0
        ? ""
        : toText(row["Waktu Update Chapter Terbaru"] ?? row.releaseTime ?? row.time ?? row.updated).trim();

    const chapterUrl = toText(
      row["URL Chapter Terbaru"] ?? row.chapterUrl ?? row.chapter_url ?? row["URL Chapter"]
    ).trim();
    const id_chapter = chapterUrl ? normalizeId(chapterUrl) : "";

    const latestChapters =
      inferredLatestChapters.length > 0
        ? inferredLatestChapters.slice(0, 2)
        : chapterNumber !== null && id_chapter
          ? [
              {
                chapter: chapterNumber,
                id_chapter,
                releaseTime: timeText || "Baru saja",
                url: chapterUrl || undefined,
              },
            ]
          : undefined;

    out.push({
      title,
      id_series,
      image,
      type: type || undefined,
      rating,
      seriesUrl: seriesUrl || undefined,
      latestChapters,
    });
  }

  return out;
}
