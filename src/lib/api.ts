import "server-only";

import { slugify } from "@/lib/text";

const DEFAULT_BASE_URL = "https://komikdebe.vercel.app";

function getBaseUrl() {
  const raw =
    process.env.KOMIKDEBE_BASE_URL ||
    process.env.NEXT_PUBLIC_KOMIKDEBE_BASE_URL ||
    DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, "");
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${url}`);
  }
  return (await res.json()) as T;
}

export type LatestChapter = {
  chapter: number;
  id_chapter: string;
  releaseTime: string;
  url?: string;
};

export type ComicCardData = {
  title: string;
  id_series: string;
  image: string;
  rating?: string;
  type?: string;
  seriesUrl?: string;
  latestChapters?: LatestChapter[];
};

export type ApiResponse<T> = {
  status: boolean;
  data: T;
  [key: string]: unknown;
};

export type Pagination = {
  currentPage: number;
  nextPage: number | null;
  totalPages: number;
  totalRecords: number;
  [key: string]: unknown;
};

export async function getLatest(type = "project", page = 1) {
  const params = new URLSearchParams();
  const safeType = String(type || "project").trim() || "project";
  const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;

  params.set("type", safeType);
  if (safePage !== 1) params.set("page", String(safePage));

  const qs = params.toString();

  return fetchJson<ApiResponse<ComicCardData[]> & { pagination?: Pagination }>(`/latest?${qs}`, {
    next: { revalidate: 600 },
  });
}

export async function getPopular() {
  return fetchJson<ApiResponse<ComicCardData[]>>("/popular", { next: { revalidate: 3600 } });
}

export async function getRecommended(type = "manhwa") {
  return fetchJson<ApiResponse<ComicCardData[]>>(
    `/recommended?type=${encodeURIComponent(type)}`,
    { next: { revalidate: 3600 } }
  );
}

export type SeriesChapter = {
  title: string;
  number: number;
  id_chapter: string;
  time: string;
};

export type SeriesDetail = {
  title: string;
  id_series: string;
  image: string;
  synopsis: string;
  info?: { status?: number; rating?: number };
  genres?: string[];
  chapters: SeriesChapter[];
  pagination?: Pagination;
};

export async function getSeries(id: string, page?: number, pageSize?: number) {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return fetchJson<ApiResponse<SeriesDetail>>(`/series/${encodeURIComponent(id)}${suffix}`);
}

export type ChapterDetail = {
  title: string;
  id_chapter: string;
  images: string[];
  next_id?: string | null;
  prev_id?: string | null;
  next_chapter?: string | null;
  prev_chapter?: string | null;
  [key: string]: unknown;
};

export async function getChapter(id: string) {
  return fetchJson<ApiResponse<ChapterDetail>>(`/chapter/${encodeURIComponent(id)}`);
}

export async function searchComics(q: string) {
  return fetchJson<ApiResponse<ComicCardData[]> & { pagination?: Pagination }>(
    `/search?q=${encodeURIComponent(q)}`,
    { next: { revalidate: 3600 } }
  );
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function getSeriesIdBySlug(slug: string) {
  const normalizedSlug = slugify(String(slug || ""));
  if (!normalizedSlug) return null;

  const query = normalizedSlug.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

  try {
    const searchRes: any = await searchComics(query);

    const direct = asArray<any>(searchRes?.data);
    const nested = asArray<any>(searchRes?.data?.data);
    const items = direct.length ? direct : nested;

    const found = items.find((c: any) => slugify(String(c?.title || "")) === normalizedSlug);
    const id = (found?.id_series || items?.[0]?.id_series) as string | undefined;
    return id ? String(id) : null;
  } catch {
    return null;
  }
}

type ChapterLookup = {
  id_chapter: string;
  number: number;
};

export type ChapterLookupResult = {
  seriesTitle?: string;
  seriesImage?: string;
  current: ChapterLookup;
  prev: ChapterLookup | null;
  next: ChapterLookup | null;
};

function toFiniteNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeChapterParam(chapterParam: string): { value: number | null; text: string | null } {
  const raw = String(chapterParam || "").trim().toLowerCase();
  if (!raw) return { value: null, text: null };

  let s = raw;
  s = s.replace(/^chapter-/, "").replace(/^ch-/, "");
  if (!s) return { value: null, text: null };

  // Support `9-2` as `9.2` (common for extra/part chapters).
  if (/^\d+-\d+$/.test(s) && !s.includes(".")) s = s.replace("-", ".");
  s = s.replace(/_/g, ".");

  // Only take the leading number.
  const match = s.match(/^\d+(?:\.\d+)?/);
  const numText = match?.[0] ?? null;
  if (!numText) return { value: null, text: null };

  const value = Number(numText);
  if (!Number.isFinite(value)) return { value: null, text: null };
  const text = Number.isInteger(value) ? String(Math.trunc(value)) : String(value);
  return { value, text };
}

function toLookup(chapter: any): ChapterLookup | null {
  const id = chapter?.id_chapter ? String(chapter.id_chapter).trim() : "";
  const number = toFiniteNumber(chapter?.number);
  if (!id || number === null) return null;
  return { id_chapter: id, number };
}

function findChapterIndexByNumber(chapters: any[], target: number, targetText: string) {
  for (let i = 0; i < chapters.length; i += 1) {
    const ch = chapters[i];
    const n = toFiniteNumber(ch?.number);
    if (n === null) continue;
    if (Math.abs(n - target) < 1e-9) return i;
    if (String(ch?.number) === targetText) return i;
  }
  return -1;
}

function getRange(chapters: any[]) {
  const nums = chapters
    .map((ch) => toFiniteNumber(ch?.number))
    .filter((n): n is number => n !== null);
  if (!nums.length) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function detectOrder(chapters: any[]) {
  if (!chapters.length) return null;
  const first = toFiniteNumber(chapters[0]?.number);
  const last = toFiniteNumber(chapters[chapters.length - 1]?.number);
  if (first === null || last === null) return null;
  if (first === last) return null;
  return first > last ? "desc" : "asc";
}

function pickClosest(
  chapters: any[],
  currentNumber: number,
  direction: "smaller" | "larger"
): ChapterLookup | null {
  let best: ChapterLookup | null = null;
  for (const ch of chapters) {
    const lookup = toLookup(ch);
    if (!lookup) continue;
    if (direction === "smaller") {
      if (lookup.number < currentNumber && (!best || lookup.number > best.number)) best = lookup;
    } else {
      if (lookup.number > currentNumber && (!best || lookup.number < best.number)) best = lookup;
    }
  }
  return best;
}

function parsePositiveInt(value: unknown, fallback: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function getChapterLookupByNumber(seriesId: string, chapterParam: string) {
  const { value: target, text: targetText } = normalizeChapterParam(chapterParam);
  if (target === null || !targetText) return null;

  const safeSeriesId = String(seriesId || "").trim();
  if (!safeSeriesId) return null;

  const pageSize = 500;

  const fetchPage = async (page: number) => {
    const res: any = await getSeries(safeSeriesId, page, pageSize);
    const s: any = res?.data || null;
    const chapters = asArray<any>(s?.chapters);
    const pagination = (res as any)?.pagination ?? s?.pagination ?? null;
    const title = typeof s?.title === "string" ? s.title : undefined;
    const image = typeof s?.image === "string" ? s.image : undefined;
    return { chapters, pagination, title, image };
  };

  const firstPage = await fetchPage(1);
  const totalPages = parsePositiveInt(firstPage.pagination?.totalPages, 1);
  const order = detectOrder(firstPage.chapters) ?? "desc";

  let foundPage = 1;
  let foundChapters = firstPage.chapters;
  let foundTitle = firstPage.title;
  let foundImage = firstPage.image;
  let idx = findChapterIndexByNumber(foundChapters, target, targetText);

  if (idx < 0 && totalPages > 1) {
    let low = 1;
    let high = totalPages;
    let iterations = 0;

    while (low <= high && iterations < 20) {
      iterations += 1;
      const mid = Math.floor((low + high) / 2);

      const pageData = mid === 1 ? firstPage : await fetchPage(mid);
      const range = getRange(pageData.chapters);
      if (!range) break;

      if (target >= range.min && target <= range.max) {
        const foundIdx = findChapterIndexByNumber(pageData.chapters, target, targetText);
        if (foundIdx >= 0) {
          foundPage = mid;
          foundChapters = pageData.chapters;
          foundTitle = pageData.title;
          foundImage = pageData.image;
          idx = foundIdx;
        }
        break;
      }

      if (order === "desc") {
        if (target < range.min) low = mid + 1;
        else if (target > range.max) high = mid - 1;
        else break;
      } else {
        if (target < range.min) high = mid - 1;
        else if (target > range.max) low = mid + 1;
        else break;
      }
    }
  }

  if (idx < 0) return null;

  const current = toLookup(foundChapters[idx]);
  if (!current) return null;

  let prev: ChapterLookup | null = null;
  let next: ChapterLookup | null = null;

  const candidates = [foundChapters[idx - 1], foundChapters[idx + 1]];
  for (const c of candidates) {
    const lookup = toLookup(c);
    if (!lookup) continue;
    if (lookup.number < current.number && (!prev || lookup.number > prev.number)) prev = lookup;
    if (lookup.number > current.number && (!next || lookup.number < next.number)) next = lookup;
  }

  if ((!prev || !next) && totalPages > 1) {
    const wantPrevPage = order === "desc" ? foundPage + 1 : foundPage - 1;
    const wantNextPage = order === "desc" ? foundPage - 1 : foundPage + 1;

    if (!prev) {
      for (const p of [wantPrevPage, wantNextPage]) {
        if (p < 1 || p > totalPages) continue;
        const pageData = p === 1 ? firstPage : await fetchPage(p);
        const picked = pickClosest(pageData.chapters, current.number, "smaller");
        if (picked) {
          prev = picked;
          break;
        }
      }
    }

    if (!next) {
      for (const p of [wantNextPage, wantPrevPage]) {
        if (p < 1 || p > totalPages) continue;
        const pageData = p === 1 ? firstPage : await fetchPage(p);
        const picked = pickClosest(pageData.chapters, current.number, "larger");
        if (picked) {
          next = picked;
          break;
        }
      }
    }
  }

  const result: ChapterLookupResult = {
    seriesTitle: foundTitle,
    seriesImage: foundImage,
    current,
    prev,
    next,
  };
  return result;
}

export async function getChapterIdByNumber(seriesId: string, chapterNum: string) {
  const found = await getChapterLookupByNumber(seriesId, chapterNum);
  return found?.current?.id_chapter ?? null;
}

export async function getExplore(
  genre: string,
  opts?: { page?: number; pageSize?: number; status?: string; format?: string }
) {
  const params = new URLSearchParams();
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.pageSize) params.set("page_size", String(opts.pageSize));
  if (opts?.status) {
    const s = String(opts.status).trim().toLowerCase();
    if (s && s !== "all") params.set("status", s);
  }
  if (opts?.format) {
    const f = String(opts.format).trim().toLowerCase();
    if (f && f !== "all") {
      // Be permissive: some providers use `format`, others use `type`.
      params.set("format", f);
      params.set("type", f);
    }
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return fetchJson<ApiResponse<ComicCardData[]> & { pagination?: Pagination }>(
    `/explore/${encodeURIComponent(genre)}${suffix}`,
    { next: { revalidate: 600 } }
  );
}
