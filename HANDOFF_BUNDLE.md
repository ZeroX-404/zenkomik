# HANDOFF_BUNDLE — my-komik-debe

Bundle ini berisi source code penting (tanpa node_modules/.next).

## Cara jalanin

```bash
cd my-komik-debe
npm install
npm run dev
```

## Env (opsional)

Lihat file `my-komik-debe/.env.example`.

---

## my-komik-debe/package.json

```json
{
  "name": "my-komik-debe",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=18.17.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "lucide-react": "^1.6.0",
    "next": "14.2.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/node": "^18.19.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.4.5"
  }
}
```

---

## my-komik-debe/next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;

```

---

## my-komik-debe/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

---

## my-komik-debe/tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

```

---

## my-komik-debe/postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

---

## my-komik-debe/next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

---

## my-komik-debe/.eslintrc.json

```json
{
  "extends": ["next/core-web-vitals"]
}
```

---

## my-komik-debe/.gitignore

```
node_modules
.next
out
dist
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store

```

---

## my-komik-debe/.env.example

```
# API base URL (client + server)
NEXT_PUBLIC_KOMIKDEBE_BASE_URL=https://komikdebe.vercel.app

# Optional: server-only override (kalau mau beda dengan client)
KOMIKDEBE_BASE_URL=https://komikdebe.vercel.app

# (Optional) Mirror feed fallback (lebih stabil).
# Isi dengan URL endpoint JSON yang return `data: [...]` (contoh: `https://data.westmanga.tv/api/contents?page=1`).
MIRROR_CONTENTS_ENDPOINT=

# (Optional) Base URL mirror buat link series/chapter di section Mirror Updates (biar nggak 404).
# Contoh: https://westmanga.tv
NEXT_PUBLIC_MIRROR_BASE_URL=

# (Optional) Base URL web kamu, buat OG/Twitter image jadi absolut
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# (Optional) Allowlist host untuk /api/proxy (comma-separated)
# Contoh: placehold.co, *.example.com
KOMIK_PROXY_ALLOWED_HOSTS=
```

---

## my-komik-debe/README.md

```md
# my-komik-debe

Next.js (App Router) web komik yang langsung konsumsi API KomikDebe, lengkap dengan:

- Home (Recommended / Popular / Latest)
- Detail series + list chapter
- Reader (Auto-Scroll + Prev/Next) + History saver
- Search
- Bookmarks
- Image Proxy (`/api/proxy`)

## Jalankan

```bash
cd my-komik-debe
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Node.js version

Project ini dipin ke `next@14` supaya bisa jalan di Node.js 18.x.

- Kalau kamu mau pakai Next.js terbaru (mis. `next@16`), upgrade Node.js ke `>=20.9.0`, lalu update dependency.

## Konfigurasi (opsional)

Copy `.env.example` jadi `.env.local`, lalu sesuaikan:

- `NEXT_PUBLIC_KOMIKDEBE_BASE_URL` / `KOMIKDEBE_BASE_URL`
- `NEXT_PUBLIC_SITE_URL` (buat OG/Twitter image absolut)
- `KOMIK_PROXY_ALLOWED_HOSTS` (optional, biar `/api/proxy` nggak jadi open-proxy)

## Dev tanpa API publik (opsional)

Kalau mau pakai API dummy lokal yang sudah ada di repo ini:

```bash
cd komik-api
npm run dev
```

Lalu di `my-komik-debe/.env.local` set:

```bash
NEXT_PUBLIC_KOMIKDEBE_BASE_URL=http://127.0.0.1:3000
KOMIKDEBE_BASE_URL=http://127.0.0.1:3000
```
```

---

## my-komik-debe/public/placeholder-comic.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#1a1a1a" />
      <stop offset="1" stop-color="#0b0b0b" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)" />
  <rect
    x="40"
    y="40"
    width="520"
    height="720"
    rx="24"
    fill="none"
    stroke="#334155"
    stroke-width="4"
  />
  <g fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="300" y="410" font-size="44" font-weight="700">No Cover</text>
    <text x="300" y="460" font-size="18">Image unavailable</text>
  </g>
</svg>

```

---

## my-komik-debe/public/manifest.json

```json
{
  "name": "DEBEKOMIK - Baca Komik Indonesia",
  "short_name": "DEBEKOMIK",
  "description": "Platform baca komik tercepat dan terlengkap.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0b0b0b",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

```

---

## my-komik-debe/public/icon-192x192.png

(binary file omitted from markdown bundle — ambil dari tarball atau regenerate)

---

## my-komik-debe/public/icon-512x512.png

(binary file omitted from markdown bundle — ambil dari tarball atau regenerate)

---

## my-komik-debe/src/lib/api.ts

```ts
import "server-only";

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
};

export type ComicCardData = {
  title: string;
  id_series: string;
  image: string;
  rating?: string;
  type?: string;
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

export async function getLatest(type = "project") {
  return fetchJson<ApiResponse<ComicCardData[]>>(`/latest?type=${encodeURIComponent(type)}`, {
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
    `/search?q=${encodeURIComponent(q)}`
  );
}

export async function getExplore(
  genre: string,
  opts?: { page?: number; pageSize?: number; status?: string; format?: string }
) {
  const params = new URLSearchParams();
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.pageSize) params.set("page_size", String(opts.pageSize));
  if (opts?.status) params.set("status", opts.status);
  if (opts?.format) {
    // Be permissive: some providers use `format`, others use `type`.
    params.set("format", opts.format);
    params.set("type", opts.format);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return fetchJson<ApiResponse<ComicCardData[]> & { pagination?: Pagination }>(
    `/explore/${encodeURIComponent(genre)}${suffix}`,
    { next: { revalidate: 600 } }
  );
}
```

---

## my-komik-debe/src/lib/storage.ts

```ts
export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

```

---

## my-komik-debe/src/lib/text.ts

```ts
export type ParsedSynopsis = {
  synopsis: string;
  credit?: string;
};

function decodeHtmlEntities(text: string) {
  const named: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };

  let out = text;

  // Hex entities: &#x20;
  out = out.replace(/&#x([0-9a-fA-F]+);?/g, (_m, hex: string) => {
    const codePoint = Number.parseInt(hex, 16);
    if (!Number.isFinite(codePoint)) return _m;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return _m;
    }
  });

  // Decimal entities: &#32;
  out = out.replace(/&#(\d+);?/g, (_m, dec: string) => {
    const codePoint = Number.parseInt(dec, 10);
    if (!Number.isFinite(codePoint)) return _m;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return _m;
    }
  });

  // Named entities (common)
  out = out.replace(/&(nbsp|amp|lt|gt|quot|apos);?/g, (_m, name: string) => named[name] ?? _m);

  return out;
}

function unescapeMarkdown(text: string) {
  // Unescape common markdown escapes: \* \_ \< \> \[ \]
  return text.replace(/\\([\\`*_~<>\[\](){}#+\-.!])/g, "$1");
}

function stripMarkdownArtifacts(text: string) {
  let out = text;

  // Remove emphasis markers that commonly leak as raw text.
  out = out.replace(/\*\*\*/g, "");
  out = out.replace(/\*\*/g, "");
  out = out.replace(/___/g, "");
  out = out.replace(/__/g, "");
  out = out.replace(/~~/g, "");
  out = out.replace(/```/g, "");

  // Remove single * / _ when used as emphasis wrappers (best-effort).
  out = out.replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,!?:;]|$)/g, "$1$2");
  out = out.replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,!?:;]|$)/g, "$1$2");

  return out;
}

function normalizeRawText(text: string) {
  let out = text.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ");
  out = decodeHtmlEntities(out);
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = unescapeMarkdown(out);
  out = stripMarkdownArtifacts(out);
  return out;
}

function cleanupLines(text: string) {
  const normalized = normalizeRawText(text);
  return normalized
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseSynopsis(raw: unknown): ParsedSynopsis {
  const text = typeof raw === "string" ? raw : "";
  let out = normalizeRawText(text);

  // Some providers prepend a credit line like:
  // [Oleh Author yang mengerjakan <...>]
  // or: Oleh Author ...
  // We extract it (if it appears at the very beginning), then clean the rest.
  let credit: string | undefined;

  const bracketMatch = out.match(/^\s*\[([^\]]*(?:oleh|author)[^\]]*)\]\s*(?:\n+|$)/i);
  if (bracketMatch) {
    credit = cleanupLines(bracketMatch[1]);
    out = out.slice(bracketMatch[0].length);
  } else {
    const plainMatch = out.match(/^\s*((?:oleh|author)\b[^\n]*)\s*(?:\n+|$)/i);
    if (plainMatch) {
      credit = cleanupLines(plainMatch[1]);
      out = out.slice(plainMatch[0].length);
    }
  }

  const synopsis = cleanupLines(out);
  return credit ? { synopsis, credit } : { synopsis };
}

export function normalizeSynopsis(raw: unknown): string {
  return parseSynopsis(raw).synopsis;
}
```

---

## my-komik-debe/src/lib/mirrorFallback.ts

```ts
import "server-only";

import type { ComicCardData } from "@/lib/api";

type Row = Record<string, unknown>;

function asRow(value: unknown): Row | null {
  if (!value || typeof value !== "object") return null;
  return value as Row;
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

function parseChapterNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = toText(value).trim();
  if (!raw) return null;
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function mapMirrorFallbackRows(input: unknown): ComicCardData[] {
  const rows = Array.isArray(input) ? input : [];
  const out: ComicCardData[] = [];

  for (const item of rows) {
    const row = asRow(item);
    if (!row) continue;

    const title = toText(row["Judul Komik"] ?? row.title ?? row["Title"]).trim();
    const seriesUrl = toText(row["URL Komik"] ?? row.url ?? row.href ?? row.link).trim();
    const image = toText(
      row["Gambar Sampul Komik"] ?? row.image ?? row.thumbnail ?? row.cover ?? row["Cover"]
    ).trim();

    const idSeriesRaw = toText(row.id_series ?? row.id ?? row.slug).trim();
    const id_series = idSeriesRaw || (seriesUrl ? slugFromUrl(seriesUrl) : "");

    if (!title || !id_series) continue;

    const type = toText(row.type ?? row.format ?? row["Tipe"] ?? "mirror").trim();
    const rating = toText(row.rating ?? row["Rating"]).trim() || undefined;

    const chapterNumber = parseChapterNumber(row["Chapter Terbaru"] ?? row.latestChapter ?? row.chapter);
    const timeText = toText(
      row["Waktu Update Chapter Terbaru"] ?? row.releaseTime ?? row.time ?? row.updated
    ).trim();

    const chapterUrl = toText(
      row["URL Chapter Terbaru"] ?? row.chapterUrl ?? row.chapter_url ?? row["URL Chapter"]
    ).trim();
    const id_chapter = chapterUrl ? slugFromUrl(chapterUrl) : "";

    const latestChapters =
      chapterNumber !== null && id_chapter
        ? [
            {
              chapter: chapterNumber,
              id_chapter,
              releaseTime: timeText || "Baru saja",
            },
          ]
        : undefined;

    out.push({
      title,
      id_series,
      image,
      type: type || undefined,
      rating,
      latestChapters,
    });
  }

  return out;
}

```

---

## my-komik-debe/src/data/mirrorFallback.ts

```ts
export const mirrorFallbackRows: unknown[] = [
  // Paste data feed mirror kamu di sini (pastikan kamu punya izin untuk menggunakan datanya).
  // Contoh format (opsional):
  // {
  //   "Judul Komik": "Contoh Judul",
  //   "URL Komik": "https://example.com/series/contoh-judul",
  //   "Gambar Sampul Komik": "https://example.com/cover.jpg",
  //   "Chapter Terbaru": "Chapter 40",
  //   "Waktu Update Chapter Terbaru": "6 jam",
  //   "URL Chapter Terbaru": "https://example.com/chapter/contoh-judul-chapter-40"
  // }
];

```

---

## my-komik-debe/src/components/Navbar.tsx

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, History, Search } from "lucide-react";
import { useState } from "react";

const GENRES = ["Action", "Adventure", "Romance", "Isekai", "Fantasy", "Drama", "School"];
const TYPES = [
  { label: "Manhwa", href: "/explore?type=manhwa", flag: "🇰🇷" },
  { label: "Manga", href: "/explore?type=manga", flag: "🇯🇵" },
  { label: "Manhua", href: "/explore?type=manhua", flag: "🇨🇳" },
] as const;

function genreSlug(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <nav className="bg-[#0b0b0b] border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black text-blue-500 tracking-tighter">
            DEBE<span className="text-white">KOMIK</span>
          </Link>

          <form onSubmit={onSubmit} className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Cari komik..."
              className="w-full bg-[#151515] text-white pl-10 pr-4 py-2 rounded-full focus:ring-2 focus:ring-blue-500 outline-none border border-gray-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </form>

          <div className="flex gap-4 text-white">
            <Link href="/history" aria-label="History">
              <History className="w-6 h-6 hover:text-blue-400" />
            </Link>
            <Link href="/bookmarks" aria-label="Bookmarks">
              <Heart className="w-6 h-6 hover:text-red-400" />
            </Link>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-900 pt-3 overflow-x-auto no-scrollbar">
          {TYPES.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
            >
              <span className="mr-1.5">{t.flag}</span>
              {t.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto py-2 md:py-0">
          {GENRES.map((g) => (
            <Link
              key={g}
              href={`/explore/${genreSlug(g)}`}
              className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-blue-500 transition whitespace-nowrap uppercase tracking-tighter"
            >
              {g}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

---

## my-komik-debe/src/components/Skeleton.tsx

```tsx
export function SkeletonCard() {
  return (
    <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
      <div className="aspect-[3/4] animate-shimmer" />
      <div className="p-3 space-y-3">
        <div className="h-4 rounded w-3/4 animate-shimmer" />
        <div className="space-y-2">
          <div className="h-3 rounded w-full animate-shimmer" />
          <div className="h-3 rounded w-1/2 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

---

## my-komik-debe/src/components/SectionHeader.tsx

```tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
  href?: string;
};

export default function SectionHeader({ title, icon: Icon, href }: Props) {
  return (
    <div className="flex items-center justify-between mb-6 border-l-4 border-blue-600 pl-4">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="text-blue-500" size={22} />
        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter truncate">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-[10px] font-bold text-gray-500 hover:text-blue-500 transition uppercase border border-gray-800 px-3 py-1 rounded-full whitespace-nowrap"
        >
          Lihat Semua
        </Link>
      ) : null}
    </div>
  );
}

```

---

## my-komik-debe/src/components/Hero.tsx

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "@/components/BookmarkButton";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Play, Star } from "lucide-react";
import { useRef } from "react";

type TrendingComic = {
  id_series: string;
  title: string;
  image: string;
  type?: string;
  rating?: string | number;
  latestChapters?: { releaseTime?: string }[];
  hero?: {
    status?: string | null;
    chapterCount?: number | null;
    genres?: string[];
    synopsis?: string;
    rating?: number | null;
    updated?: string;
  };
};

export default function Hero({ trending }: { trending: TrendingComic[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = Array.isArray(trending) ? trending.slice(0, 6) : [];

  const getTypeDetail = (type: unknown) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("manhwa")) return { label: "Manhwa", flag: "🇰🇷", color: "bg-blue-600" };
    if (t.includes("manhua")) return { label: "Manhua", flag: "🇨🇳", color: "bg-red-600" };
    if (t.includes("manga")) return { label: "Manga", flag: "🇯🇵", color: "bg-orange-600" };
    return { label: "Komik", flag: "🌐", color: "bg-gray-600" };
  };

  const parseRating = (value: unknown) => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  };

  const statusChip = (status: string) => {
    const v = status.toLowerCase();
    if (v.includes("ongo")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (v.includes("complete") || v.includes("tamat") || v.includes("end"))
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-white/10 text-gray-200 border-white/10";
  };

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  if (!items.length) {
    return (
      <div className="h-[220px] md:h-[320px] w-full rounded-2xl border border-gray-800 bg-[#151515] flex items-center justify-center text-gray-400">
        Belum ada data trending.
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#0b0b0b]">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-blue-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hidden md:block text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-blue-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md hidden md:block text-white"
        aria-label="Scroll right"
      >
        <ChevronRight size={28} />
      </button>

      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {items.map((comic, i) => {
          const typeInfo = getTypeDetail(comic.type);
          const img = comic.image
            ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
            : "/placeholder-comic.svg";

          const hero = comic.hero || {};
          const status = typeof hero.status === "string" ? hero.status : null;
          const chapterCount = typeof hero.chapterCount === "number" ? hero.chapterCount : null;
          const genres = Array.isArray(hero.genres) ? hero.genres : [];
          const synopsis = typeof hero.synopsis === "string" ? hero.synopsis : "";
          const updated =
            typeof hero.updated === "string"
              ? hero.updated
              : typeof comic.latestChapters?.[0]?.releaseTime === "string"
                ? comic.latestChapters?.[0]?.releaseTime
                : "";

          const rating =
            typeof hero.rating === "number" ? hero.rating : parseRating(comic.rating);
          const ratingText = typeof rating === "number" ? rating.toFixed(1) : "—";

          return (
            <div
              key={comic.id_series}
              className="relative min-w-full h-[400px] md:h-[550px] snap-center flex-shrink-0 flex items-center"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />

              <div className="relative z-10 w-full px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
                <div className="hidden md:block relative w-64 h-[380px] flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-[#111]">
                  <Image src={img} alt={comic.title} fill sizes="256px" className="object-cover" priority={i === 0} />
                  <div
                    className={`absolute top-4 left-4 ${typeInfo.color} text-white px-3 py-1 rounded-lg text-xs font-black border border-white/10 uppercase tracking-tighter`}
                  >
                    {typeInfo.flag} {typeInfo.label}
                  </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <span className="bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-blue-900/40">
                      Trending #{i + 1}
                    </span>
                    <span
                      className={`${typeInfo.color} text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] border border-white/10`}
                      title={typeInfo.label}
                    >
                      {typeInfo.flag} {typeInfo.label}
                    </span>
                    {status ? (
                      <span
                        className={`border text-[11px] font-bold px-3 py-1.5 rounded-full uppercase ${statusChip(status)}`}
                      >
                        {status}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl line-clamp-2">
                    {comic.title}
                  </h2>

                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm font-bold text-gray-300">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" fill="currentColor" />
                      <span className="text-white text-lg">{ratingText}</span>
                    </div>
                    {chapterCount ? (
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-500" />
                        <span>{chapterCount.toLocaleString()} Chapters</span>
                      </div>
                    ) : null}
                    {updated ? (
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-purple-500" />
                        <span className="truncate max-w-[240px]">{updated}</span>
                      </div>
                    ) : null}
                  </div>

                  {genres.length ? (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {genres.slice(0, 4).map((genre) => (
                        <span
                          key={genre}
                          className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:border-blue-500 transition cursor-default"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {synopsis ? (
                    <p className="hidden md:block text-gray-300/80 text-sm leading-relaxed line-clamp-2 max-w-2xl italic">
                      {synopsis}
                    </p>
                  ) : null}

                  <div className="pt-2 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <Link
                      href={`/series/${comic.id_series}`}
                      className="inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl active:scale-95"
                    >
                      <Play size={20} fill="currentColor" /> BACA SEKARANG
                    </Link>
                    <BookmarkButton
                      series={{
                        id_series: comic.id_series,
                        title: comic.title,
                        image: comic.image,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
        ))}
      </div>
    </div>
  );
}
```

---

## my-komik-debe/src/components/Sidebar.tsx

```tsx
import Link from "next/link";
import Image from "next/image";
import { Hash, TrendingUp } from "lucide-react";
import SupportCard from "@/components/SupportCard";

type TrendingComic = {
  id_series: string;
  title: string;
  image: string;
};

const TAGS = ["Action", "Isekai", "Murim", "Romance", "Fantasy"];

export default function Sidebar({ trending }: { trending: TrendingComic[] }) {
  const list = Array.isArray(trending) ? trending : [];

  return (
    <div className="sticky top-24 space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-5 text-orange-500">
          <TrendingUp size={20} />
          <h3 className="font-black uppercase tracking-tight text-white text-sm">Top Weekly</h3>
        </div>
        <div className="space-y-4">
          {list.slice(0, 6).map((comic, i) => (
            <Link
              key={comic.id_series}
              href={`/series/${comic.id_series}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative flex-shrink-0 w-10 h-14 rounded overflow-hidden border border-gray-800 bg-gray-900">
                <Image
                  src={
                    comic.image
                      ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
                      : "/placeholder-comic.svg"
                  }
                  alt={comic.title}
                  fill
                  sizes="40px"
                  className="object-cover group-hover:scale-110 transition"
                />
                <div className="absolute top-0 left-0 bg-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-br">
                  {i + 1}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[13px] font-bold text-gray-200 line-clamp-1 group-hover:text-blue-400 transition">
                  {comic.title}
                </h4>
              </div>
            </Link>
          ))}

          {!list.length ? <p className="text-xs text-gray-500">Belum ada data populer.</p> : null}
        </div>
      </section>

      <section className="bg-[#151515] p-5 rounded-xl border border-gray-800">
        <h3 className="text-[11px] font-black uppercase text-gray-500 mb-4 flex items-center gap-2">
          <Hash size={14} /> Populer
        </h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((g) => (
            <Link
              key={g}
              href={`/explore/${g.toLowerCase()}`}
              className="text-[10px] font-bold px-3 py-1.5 bg-gray-900 hover:bg-blue-600 border border-gray-800 rounded-md transition"
            >
              {g}
            </Link>
          ))}
        </div>
      </section>

      <SupportCard />
    </div>
  );
}
```

---

## my-komik-debe/src/components/PopularHorizontal.tsx

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";

type LatestChapter = {
  chapter: number;
  id_chapter: string;
  releaseTime: string;
};

type Comic = {
  id_series: string;
  title: string;
  image: string;
  type?: string;
  rating?: string;
  latestChapters?: LatestChapter[];
};

const FILTERS = ["Minggu ini", "Bulan ini", "Sepanjang masa"] as const;

function parseRating(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

type Props = {
  data: Comic[];
  title?: string;
  showHeader?: boolean;
  showFilters?: boolean;
};

export default function PopularHorizontal({
  data,
  title = "Manga Populer",
  showHeader = true,
  showFilters = true,
}: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(FILTERS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // UI-only filter for now (API populer belum punya parameter timeframe).
  const items = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  const showTopBar = showHeader || showFilters;

  return (
    <section className="space-y-6 relative group/popular">
      {showTopBar ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          {showHeader ? (
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {showFilters ? (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap border ${
                    filter === f
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : "bg-[#151515] border-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover/popular:opacity-100 transition hidden md:block border border-white/10"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover/popular:opacity-100 transition hidden md:block border border-white/10"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth px-2"
      >
        {items.map((c) => {
          const img = c.image
            ? `/api/proxy?url=${encodeURIComponent(c.image)}`
            : "/placeholder-comic.svg";

          const latest = c.latestChapters?.[0]?.chapter;
          const rating = parseRating(c.rating);
          const typeLabel = (c.type || "Manga").toString();

          return (
            <Link
              key={c.id_series}
              href={`/series/${c.id_series}`}
              className="relative min-w-[150px] md:min-w-[190px] aspect-[3/4.2] rounded-xl md:rounded-2xl overflow-hidden snap-start group border border-white/5 bg-[#111] flex-shrink-0"
            >
              <Image
                src={img}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 150px, 190px"
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter text-gray-200 border border-white/10">
                {typeLabel}
              </div>

              <div className="absolute bottom-3 left-3 right-3 space-y-2">
                <h3 className="text-xs md:text-[13px] font-bold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-blue-500 uppercase">
                    {typeof latest === "number" ? `Ch. ${latest}` : "Ch. —"}
                  </span>
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-white">{rating ?? "—"}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

---

## my-komik-debe/src/components/RecommendedScroll.tsx

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Book, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";

type Comic = {
  id_series: string;
  title: string;
  image: string;
  rating?: string | number;
};

function parseRating(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function RecommendedScroll({
  title,
  data,
  type,
  limit = 12,
}: {
  title: string;
  data: Comic[];
  type: "manhwa" | "manga";
  limit?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const n = Number.isFinite(Number(limit)) ? Math.max(0, Math.trunc(Number(limit))) : 12;
    return n ? data.slice(0, n) : data;
  }, [data, limit]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTo = direction === "left" ? el.scrollLeft - el.clientWidth : el.scrollLeft + el.clientWidth;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
  }

  return (
    <section className="space-y-4 group/rec relative">
      <SectionHeader title={title} icon={type === "manga" ? Book : Star} href={`/explore?type=${type}`} />

      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-[55%] z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full opacity-0 group-hover/rec:opacity-100 transition hidden md:block border border-white/10 text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-[55%] z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full opacity-0 group-hover/rec:opacity-100 transition hidden md:block border border-white/10 text-white"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {items.map((comic, idx) => {
          const img = comic.image
            ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
            : "/placeholder-comic.svg";

          const rating = parseRating(comic.rating);
          const ratingText = rating === null ? "—" : rating.toFixed(1);

          return (
            <Link
              key={comic.id_series}
              href={`/series/${comic.id_series}`}
              className="relative min-w-[140px] md:min-w-[180px] aspect-[3/4.2] rounded-xl overflow-hidden snap-start group border border-white/5 bg-[#111] flex-shrink-0"
            >
              <Image
                src={img}
                alt={comic.title}
                fill
                sizes="(max-width: 768px) 140px, 180px"
                className="object-cover group-hover:scale-110 transition duration-500"
                priority={idx < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 text-yellow-500 text-[10px] border border-white/10">
                <Star size={10} fill="currentColor" />
                <span className="text-white font-bold">{ratingText}</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition">
                  {comic.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

---

## my-komik-debe/src/components/ComicCard.tsx

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type LatestChapter = {
  chapter: number;
  id_chapter: string;
  releaseTime: string;
};

type Comic = {
  title: string;
  id_series: string;
  image: string;
  latestChapters?: LatestChapter[];
};

export default function ComicCard({ comic }: { comic: Comic }) {
  const placeholder = "/placeholder-comic.svg";
  const initial = comic?.image
    ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
    : placeholder;
  const [imgSrc, setImgSrc] = useState(initial);

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all flex flex-col h-full group">
      <Link
        href={`/series/${comic.id_series}`}
        className="relative aspect-[3/4] overflow-hidden bg-gray-900"
      >
        <Image
          src={imgSrc}
          alt={comic.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover group-hover:scale-110 transition duration-500"
          onError={() => setImgSrc(placeholder)}
        />
      </Link>

      <div className="p-3 flex flex-col gap-2 flex-grow">
        <Link href={`/series/${comic.id_series}`}>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight hover:text-blue-400">
            {comic.title}
          </h3>
        </Link>

        <div className="mt-auto space-y-1">
          {comic.latestChapters?.slice(0, 2).map((ch) => (
            <Link
              key={ch.id_chapter}
              href={`/chapter/${ch.id_chapter}`}
              className="flex justify-between text-[10px] bg-[#252525] p-1.5 rounded text-gray-400 hover:bg-blue-900 hover:text-white"
            >
              <span>Ch. {ch.chapter}</span>
              <span className="opacity-50">{ch.releaseTime}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## my-komik-debe/src/components/BookmarkButton.tsx

```tsx
"use client";

import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readJson, writeJson } from "@/lib/storage";

type BookmarkItem = {
  id_series: string;
  title: string;
  image: string;
  added_at: number;
};

const STORAGE_KEY = "bookmarks";

function loadBookmarks(): BookmarkItem[] {
  const data = readJson<unknown>(STORAGE_KEY, []);
  return Array.isArray(data) ? (data as BookmarkItem[]) : [];
}

export default function BookmarkButton({
  series,
}: {
  series: { id_series: string; title: string; image: string };
}) {
  const [bookmarked, setBookmarked] = useState(false);

  const item = useMemo<BookmarkItem>(
    () => ({
      id_series: series.id_series,
      title: series.title,
      image: series.image,
      added_at: Date.now(),
    }),
    [series.id_series, series.image, series.title]
  );

  useEffect(() => {
    const bookmarks = loadBookmarks();
    setBookmarked(bookmarks.some((b) => b.id_series === series.id_series));
  }, [series.id_series]);

  function toggle() {
    const bookmarks = loadBookmarks();
    const exists = bookmarks.some((b) => b.id_series === series.id_series);
    const next = exists
      ? bookmarks.filter((b) => b.id_series !== series.id_series)
      : [item, ...bookmarks];
    writeJson(STORAGE_KEY, next.slice(0, 200));
    setBookmarked(!exists);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
        bookmarked
          ? "bg-red-600/20 border-red-600 text-red-200"
          : "bg-[#151515] border-gray-800 text-gray-200 hover:border-red-500"
      }`}
    >
      <Heart className={`w-5 h-5 ${bookmarked ? "fill-red-500" : ""}`} />
      <span className="text-sm font-semibold">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}

```

---

## my-komik-debe/src/components/ContinueReading.tsx

```tsx
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
```

---

## my-komik-debe/src/components/RelatedSeries.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import { getExplore } from "@/lib/api";

function slugifyGenre(value: unknown) {
  const raw = typeof value === "string" ? value : "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function RelatedSeries({
  genres,
  excludeId,
}: {
  genres?: string[];
  excludeId?: string;
}) {
  const mainGenre = slugifyGenre(Array.isArray(genres) && genres.length ? genres[0] : "action") || "action";

  try {
    const res = await getExplore(mainGenre, { pageSize: 12 });
    const items = Array.isArray(res.data) ? res.data : [];
    const filtered = items
      .filter((c: any) => String(c?.id_series || "") && String(c.id_series) !== String(excludeId || ""))
      .slice(0, 6);

    if (!filtered.length) return null;

    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
          <h2 className="text-xl font-black uppercase text-white">Rekomendasi Serupa</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.map((c: any) => (
            <ComicCard key={c.id_series} comic={c} />
          ))}
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

```

---

## my-komik-debe/src/components/ShareButton.tsx

```tsx
"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title,
      text: `Baca komik "${title}" di DEBEKOMIK.`,
      url,
    };

    try {
      const nav: any = navigator;

      if (typeof nav?.share === "function") {
        await nav.share(shareData);
        return;
      }

      if (typeof nav?.clipboard?.writeText === "function") {
        await nav.clipboard.writeText(url);
      } else {
        const el = document.createElement("textarea");
        el.value = url;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore share/copy errors
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-[#151515] border border-gray-800 rounded-xl hover:border-blue-500 transition group text-sm font-bold"
    >
      {copied ? (
        <Check className="text-green-500" size={18} />
      ) : (
        <Share2 className="group-hover:text-blue-500" size={18} />
      )}
      <span>{copied ? "Link Disalin!" : "Share"}</span>
    </button>
  );
}
```

---

## my-komik-debe/src/components/ReaderControls.tsx

```tsx
"use client";

import { ChevronUp, Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReaderControls({
  isTheater,
  onToggleTheater,
}: {
  isTheater: boolean;
  onToggleTheater: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);

  useEffect(() => {
    let raf = 0;

    function compute() {
      raf = 0;
      const el = document.documentElement;
      const total = el.scrollHeight - window.innerHeight;
      const current = window.scrollY || el.scrollTop || 0;
      const pct = total > 0 ? (current / total) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
    }

    function onChange() {
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (autoScrollSpeed <= 0) return;
    const interval = window.setInterval(() => {
      window.scrollBy({ top: autoScrollSpeed, behavior: "smooth" });
    }, 50);
    return () => window.clearInterval(interval);
  }, [autoScrollSpeed]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-opacity duration-500 ${
          isTheater ? "opacity-20 hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Speed: {autoScrollSpeed}
            </span>
            <input
              type="range"
              min={0}
              max={20}
              value={autoScrollSpeed}
              onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
              className="w-28 accent-blue-500"
              aria-label="Auto scroll speed"
            />
          </div>

          <button
            type="button"
            onClick={onToggleTheater}
            className={`p-3 rounded-xl transition ${
              isTheater ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
            }`}
            title="Theater Mode"
            aria-label="Toggle theater mode"
          >
            {isTheater ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition active:scale-95"
          aria-label="Scroll to top"
          title="Ke atas"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </>
  );
}

```

---

## my-komik-debe/src/components/SupportCard.tsx

```tsx
import Image from "next/image";
import { Coffee, Heart } from "lucide-react";

export default function SupportCard({
  href = "https://trakteer.id/debekomik",
}: {
  href?: string;
}) {
  return (
    <div className="relative bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group transition-all duration-500 hover:border-blue-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50 group-hover:opacity-100 transition duration-500" />

      <div className="relative p-6 flex flex-col items-center text-center space-y-5">
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 -rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl bg-black/20">
          <Image
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmhqamhidHFldDB2emI3ZzdseGh3Ymh0eHl5M3Rha293anp3cG4xaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w7dn7xRSHGZUs/giphy.gif"
            alt="Support Admin Lucu"
            width={128}
            height={128}
            unoptimized
            className="w-full h-full object-cover scale-110"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-xl text-white tracking-tighter uppercase italic drop-shadow-md">
            ADMIN BUTUH ASUPAN! 🍙
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-medium px-2">
            Bantu admin beli kopi &amp; indomie ya biar mata nggak sepet pas update chapter
            buat kalian semua.
            <br />
            <span className="text-blue-500 font-bold block mt-2 text-[10px] tracking-widest uppercase">
              Semangat Admin = Update Makin Gacor! 🚀
            </span>
          </p>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
        >
          <Coffee size={18} fill="currentColor" />
          TRAKTIR KOPI ADMIN
        </a>

        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-black tracking-widest uppercase opacity-50">
          <Heart size={10} className="text-red-500 animate-pulse" fill="currentColor" />
          Satu Saweria Seribu Semangat
        </div>
      </div>
    </div>
  );
}

```

---

## my-komik-debe/src/components/ChapterList.tsx

```tsx
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SortAsc, SortDesc } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readJson } from "@/lib/storage";

export type Chapter = {
  id_chapter: string;
  number: number;
  title: string;
  time: string;
};

type PaginationInfo = {
  currentPage?: number;
  nextPage?: number | null;
  totalPages?: number;
  totalRecords?: number;
};

function toNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function toInt(value: unknown) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : null;
}

type HistoryItem = { id_chapter?: string };

function loadReadChapterIds() {
  const a = readJson<unknown>("read_history", []);
  const b = readJson<unknown>("reading_history", []);
  const listA = Array.isArray(a) ? (a as HistoryItem[]) : [];
  const listB = Array.isArray(b) ? (b as HistoryItem[]) : [];

  const ids = new Set<string>();
  for (const item of [...listA, ...listB]) {
    if (!item?.id_chapter) continue;
    ids.add(String(item.id_chapter));
  }
  return ids;
}

export default function ChapterList({
  initialChapters,
  synopsis,
  pagination,
  seriesId,
}: {
  initialChapters: Chapter[];
  synopsis?: string;
  pagination?: PaginationInfo;
  seriesId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"chapter" | "synopsis">("chapter");
  const [search, setSearch] = useState("");
  const [isDescending, setIsDescending] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setReadIds(loadReadChapterIds());
  }, []);

  const filteredChapters = useMemo(() => {
    const list = Array.isArray(initialChapters) ? [...initialChapters] : [];
    const q = search.trim().toLowerCase();

    const filtered = q
      ? list.filter((ch) => {
          const n = toNumber(ch?.number);
          const numberText = n === null ? String(ch?.number ?? "") : String(n);
          const titleText = String(ch?.title ?? "").toLowerCase();
          return numberText.includes(q) || titleText.includes(q);
        })
      : list;

    filtered.sort((a, b) => {
      const an = toNumber(a?.number);
      const bn = toNumber(b?.number);

      if (an === null && bn === null) return 0;
      if (an === null) return 1;
      if (bn === null) return -1;

      return isDescending ? bn - an : an - bn;
    });

    return filtered;
  }, [initialChapters, search, isDescending]);

  const synopsisText = String(synopsis || "").trim();

  const totalPages = toInt(pagination?.totalPages) ?? 1;
  const currentPage = toInt(pagination?.currentPage) ?? 1;
  const canPaginate = Boolean(seriesId) && totalPages > 1;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-800 gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("chapter")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${
            activeTab === "chapter"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Chapter ({Array.isArray(initialChapters) ? initialChapters.length : 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("synopsis")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${
            activeTab === "synopsis"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Sinopsis
        </button>
      </div>

      {activeTab === "synopsis" ? (
        <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 leading-relaxed text-gray-300 whitespace-pre-line">
          {synopsisText || "Tidak ada sinopsis."}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari chapter... (contoh: 76)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151515] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsDescending((v) => !v)}
              className="px-4 bg-[#151515] border border-gray-800 rounded-lg text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
            >
              {isDescending ? <SortDesc size={18} /> : <SortAsc size={18} />}
              <span className="hidden md:inline">Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 max-h-[600px] overflow-y-auto pr-2">
            {filteredChapters.map((ch) => {
              const read = readIds.has(ch.id_chapter);
              return (
                <Link
                  key={ch.id_chapter}
                  href={`/chapter/${ch.id_chapter}`}
                  className={`group flex items-center justify-between p-4 bg-[#111] hover:bg-blue-600/10 border-b border-gray-800/50 transition ${
                    read ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-200 group-hover:text-blue-400">
                      Chapter {ch.number}
                    </span>
                    {ch.title ? (
                      <span className="text-[11px] text-gray-500 truncate">
                        {ch.title}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">{ch.time}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      {ch.time}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-gray-600 group-hover:text-blue-500"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {!filteredChapters.length ? (
            <p className="text-center py-10 text-gray-500 italic">
              {search.trim()
                ? "Chapter tidak ditemukan."
                : "Belum ada chapter tersedia."}
            </p>
          ) : null}

          {canPaginate ? (
            <div className="flex items-center justify-center gap-2 pt-6 overflow-x-auto no-scrollbar">
              <Link
                href={`/series/${seriesId}?page=1`}
                className={`p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition ${
                  currentPage === 1 ? "opacity-40 pointer-events-none" : ""
                }`}
                aria-label="Halaman pertama"
              >
                <ChevronsLeft size={18} />
              </Link>

              {prevPage ? (
                <Link
                  href={`/series/${seriesId}?page=${prevPage}`}
                  className="p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </Link>
              ) : null}

              <span className="px-4 py-2 bg-blue-600 rounded text-xs font-bold whitespace-nowrap">
                Page {currentPage} / {totalPages}
              </span>

              {nextPage ? (
                <Link
                  href={`/series/${seriesId}?page=${nextPage}`}
                  className="p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition"
                  aria-label="Berikutnya"
                >
                  <ChevronRight size={18} />
                </Link>
              ) : null}

              <Link
                href={`/series/${seriesId}?page=${totalPages}`}
                className={`p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition ${
                  currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
                }`}
                aria-label="Halaman terakhir"
              >
                <ChevronsRight size={18} />
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
```

---

## my-komik-debe/src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0b0b0b;
}

html,
body {
  height: 100%;
}

body {
  background: var(--background);
  color: white;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
    "Apple Color Emoji", "Segoe UI Emoji";
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #0b0b0b;
}
::-webkit-scrollbar-thumb {
  background: #2563eb;
  border-radius: 10px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@layer utilities {
  .animate-shimmer {
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

---

## my-komik-debe/src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DEBEKOMIK",
  description: "Komik reader untuk API KomikDebe",
  manifest: "/manifest.json",
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#0b0b0b] text-white antialiased">{children}</body>
    </html>
  );
}
```

---

## my-komik-debe/src/app/loading.tsx

```tsx
import { SkeletonGrid } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="h-10 bg-gray-800 rounded-lg w-48 animate-pulse" />
      <SkeletonGrid />
    </div>
  );
}

```

---

## my-komik-debe/src/app/not-found.tsx

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-black text-white">404 — Tidak ditemukan</h1>
        <p className="text-gray-400">
          Halaman yang kamu cari nggak ada, atau datanya belum tersedia.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}

```

---

## my-komik-debe/src/app/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularHorizontal from "@/components/PopularHorizontal";
import RecommendedScroll from "@/components/RecommendedScroll";
import Sidebar from "@/components/Sidebar";
import SectionHeader from "@/components/SectionHeader";
import { mirrorFallbackRows } from "@/data/mirrorFallback";
import { getExplore, getLatest, getPopular, getRecommended, getSeries } from "@/lib/api";
import { mapMirrorFallbackRows } from "@/lib/mirrorFallback";
import { normalizeSynopsis } from "@/lib/text";
import { Globe, Zap } from "lucide-react";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseRating(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatStatus(value: unknown) {
  if (typeof value === "number") return value === 1 ? "Ongoing" : "Completed";
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v.includes("ongo")) return "Ongoing";
    if (v.includes("complete") || v.includes("end") || v.includes("tamat")) return "Completed";
    return value;
  }
  return null;
}

export default async function Home() {
  const [latestProjectSettled, latestMirrorSettled, popularSettled, manhwaSettled, mangaSettled] =
    await Promise.allSettled([
      getLatest("project"),
      getLatest("mirror"),
      getPopular(),
      getExplore("all", { pageSize: 18, format: "manhwa" }),
      getExplore("all", { pageSize: 12, format: "manga" }),
    ]);

  const latestProject =
    latestProjectSettled.status === "fulfilled" ? latestProjectSettled.value : ({ data: [] } as any);
  const latestMirror =
    latestMirrorSettled.status === "fulfilled" ? latestMirrorSettled.value : ({ data: [] } as any);
  const popular = popularSettled.status === "fulfilled" ? popularSettled.value : ({ data: [] } as any);
  let manhwaRec = manhwaSettled.status === "fulfilled" ? manhwaSettled.value : ({ data: [] } as any);
  let mangaRec = mangaSettled.status === "fulfilled" ? mangaSettled.value : ({ data: [] } as any);

  if (!asArray<any>(manhwaRec.data).length) {
    try {
      manhwaRec = await getRecommended("manhwa");
    } catch {
      // ignore
    }
  }
  if (!asArray<any>(mangaRec.data).length) {
    try {
      mangaRec = await getRecommended("manga");
    } catch {
      // ignore
    }
  }

  const latestProjectItems = asArray<any>(latestProject.data);
  let latestMirrorItems = asArray<any>(latestMirror.data);
  const popularItems = asArray<any>(popular.data);
  const manhwaItems = asArray<any>(manhwaRec.data);
  const mangaItems = asArray<any>(mangaRec.data);
  const heroSeed = popularItems.slice(0, 6);

  if (!latestMirrorItems.length) {
    latestMirrorItems = mapMirrorFallbackRows(mirrorFallbackRows);
  }

  const heroItems = await Promise.all(
    heroSeed.map(async (c: any) => {
      const id = String(c?.id_series || "");
      if (!id) return c;

      try {
        const res: any = await getSeries(id, 1, 1);
        const s: any = res?.data || null;
        const pagination = res?.pagination || s?.pagination || {};

        const chapterCountRaw = pagination?.totalRecords;
        const chapterCount =
          typeof chapterCountRaw === "number"
            ? chapterCountRaw
            : Number.isFinite(Number(chapterCountRaw))
              ? Number(chapterCountRaw)
              : Array.isArray(s?.chapters)
                ? s.chapters.length
                : null;

        const genres = Array.isArray(s?.genres) ? (s.genres as string[]) : [];
        const synopsis = normalizeSynopsis(s?.synopsis);
        const status = formatStatus(s?.info?.status);
        const rating =
          typeof s?.info?.rating === "number" ? s.info.rating : parseRating(c?.rating);
        const updated =
          (c?.latestChapters?.[0]?.releaseTime as string | undefined) ||
          (Array.isArray(s?.chapters) ? (s.chapters[0]?.time as string | undefined) : undefined);

        return {
          ...c,
          hero: {
            status,
            chapterCount,
            genres,
            synopsis,
            rating,
            updated,
          },
        };
      } catch {
        return c;
      }
    })
  );

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-10 space-y-12 pb-24 md:pb-10">
        <Hero trending={heroItems} />
        <PopularHorizontal data={popularItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9 space-y-12">
            <RecommendedScroll
              title="Eksplor Manhwa"
              data={manhwaItems}
              type="manhwa"
              limit={18}
            />

            <RecommendedScroll
              title="Eksplor Manga"
              data={mangaItems}
              type="manga"
            />

            <section>
              <SectionHeader title="Update Project" icon={Zap} href="/latest?type=project" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {latestProjectItems.slice(0, 8).map((c: any) => (
                  <ComicCard key={c.id_series} comic={c} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Mirror Updates" icon={Globe} href="/latest?type=mirror" />
              {latestMirrorItems.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {latestMirrorItems.slice(0, 8).map((c: any) => (
                    <ComicCard key={c.id_series} comic={c} />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-gray-800 bg-[#151515] text-gray-400">
                  Belum ada data mirror.
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-3">
            <Sidebar trending={popularItems} />
          </aside>
        </div>
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/latest/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import SectionHeader from "@/components/SectionHeader";
import { getLatest } from "@/lib/api";
import type { Metadata } from "next";
import { Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Update Terbaru - DEBEKOMIK",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default async function LatestPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const rawType = String(searchParams?.type || "project").toLowerCase();
  const type = rawType === "mirror" ? "mirror" : "project";

  let items: any[] = [];
  try {
    const latest = await getLatest(type);
    items = asArray<any>(latest.data);
  } catch {
    items = [];
  }

  const title = type === "mirror" ? "Mirror Updates" : "Update Project";
  const icon = type === "mirror" ? Globe : Zap;

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <Navbar />
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <SectionHeader title={title} icon={icon} />
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((c: any) => (
              <ComicCard key={c.id_series} comic={c} />
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-gray-500">Belum ada data.</p>
        )}
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/search/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import { searchComics } from "@/lib/api";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = String(searchParams.q || "").trim();

  if (!q) {
    return (
      <div className="min-h-screen pb-10">
        <Navbar />
        <main className="container mx-auto px-4 mt-8">
          <h1 className="text-xl font-black text-white">Search</h1>
          <p className="text-gray-400 mt-2">Ketik judul komik di kolom pencarian.</p>
        </main>
      </div>
    );
  }

  const result = await searchComics(q);

  // Support variasi response: `data` bisa array (komik-api), atau object (provider lain).
  const direct = Array.isArray(result.data) ? (result.data as any[]) : null;
  const nested = asArray<any>((result as any)?.data?.data);
  const items = direct ?? nested;

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <div>
          <h1 className="text-xl font-black text-white">Hasil pencarian</h1>
          <p className="text-gray-400 text-sm mt-1">
            Query: <span className="text-white">{q}</span> ({items.length} hasil)
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((c: any) => (
            <ComicCard key={c.id_series} comic={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/explore/[genre]/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import { getExplore } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function titleize(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: { genre: string };
}): Promise<Metadata> {
  const genreName = titleize(decodeURIComponent(params.genre || ""));
  const title = `Explore ${genreName} - DEBEKOMIK`;
  const description = `Cari komik genre ${genreName} terbaru.`;
  return { title, description };
}

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

type ExploreSearchParams = {
  page?: string;
  status?: string;
  type?: string;
};

function buildQuery(current: ExploreSearchParams | undefined, updates: Partial<ExploreSearchParams>) {
  const merged: ExploreSearchParams = { ...(current || {}), ...(updates || {}) };
  const params = new URLSearchParams();

  const page = String(merged.page || "").trim();
  const status = String(merged.status || "").trim();
  const type = String(merged.type || "").trim();

  if (page && page !== "1") params.set("page", page);
  if (status) params.set("status", status);
  if (type) params.set("type", type);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function isActive(current: ExploreSearchParams | undefined, key: keyof ExploreSearchParams, value: string) {
  const v = String(current?.[key] || "").trim();
  if (!value) return !v;
  return v === value;
}

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams?: ExploreSearchParams;
}) {
  const genreParam = String(params.genre || "");
  const genreName = titleize(decodeURIComponent(genreParam));
  const page = parsePage(searchParams?.page);
  const status = String(searchParams?.status || "").trim();
  const format = String(searchParams?.type || "").trim();

  let items: any[] = [];
  let pagination: any = null;
  try {
    const res: any = await getExplore(genreParam, {
      page,
      status: status || undefined,
      format: format || undefined,
    });
    items = asArray<any>(res.data);
    pagination = res.pagination || null;
  } catch {
    items = [];
    pagination = null;
  }

  const currentPage = pagination?.currentPage ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <Navbar />
      <main className="container mx-auto px-4 mt-8">
        <header className="mb-8 space-y-4 border-b border-gray-800 pb-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Genre: <span className="text-blue-500">{genreName}</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Menampilkan {items.length} komik
              {totalPages > 1 ? ` — Page ${currentPage}/${totalPages}` : ""}.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase shrink-0">
                Status:
              </span>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, { status: "", page: "1" })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "status", "")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Semua
              </Link>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, {
                  status: "ongoing",
                  page: "1",
                })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "status", "ongoing")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Ongoing
              </Link>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, {
                  status: "completed",
                  page: "1",
                })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "status", "completed")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Completed
              </Link>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-bold text-gray-500 uppercase shrink-0">
                Format:
              </span>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, { type: "", page: "1" })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "type", "")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Semua
              </Link>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, { type: "manga", page: "1" })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "type", "manga")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Manga
              </Link>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, { type: "manhwa", page: "1" })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "type", "manhwa")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Manhwa
              </Link>
              <Link
                href={`/explore/${genreParam}${buildQuery(searchParams, { type: "manhua", page: "1" })}`}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isActive(searchParams, "type", "manhua")
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                Manhua
              </Link>
            </div>
          </div>
        </header>

        {items.length ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((c: any) => (
                <ComicCard key={c.id_series} comic={c} />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex justify-between items-center">
                {currentPage > 1 ? (
                  <Link
                    href={`/explore/${genreParam}${buildQuery(searchParams, {
                      page: String(currentPage - 1),
                    })}`}
                    className="px-4 py-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600"
                  >
                    Prev
                  </Link>
                ) : (
                  <span />
                )}

                {pagination?.nextPage ? (
                  <Link
                    href={`/explore/${genreParam}${buildQuery(searchParams, {
                      page: String(pagination.nextPage),
                    })}`}
                    className="px-4 py-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600"
                  >
                    Next
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#151515] rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-500">Yah, belum ada komik di genre ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/explore/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import PopularHorizontal from "@/components/PopularHorizontal";
import SectionHeader from "@/components/SectionHeader";
import { getExplore, getPopular } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore - DEBEKOMIK",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function titleize(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

type ExploreSearchParams = {
  genre?: string;
  page?: string;
  status?: string;
  type?: string;
  sort?: string;
};

function buildQuery(current: ExploreSearchParams | undefined, updates: Partial<ExploreSearchParams>) {
  const merged: ExploreSearchParams = { ...(current || {}), ...(updates || {}) };
  const params = new URLSearchParams();

  const genre = String(merged.genre || "").trim();
  const page = String(merged.page || "").trim();
  const status = String(merged.status || "").trim();
  const type = String(merged.type || "").trim();
  const sort = String(merged.sort || "").trim();

  if (genre && genre !== "all") params.set("genre", genre);
  if (page && page !== "1") params.set("page", page);
  if (status) params.set("status", status);
  if (type) params.set("type", type);
  if (sort && sort !== "latest") params.set("sort", sort);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function isActive(current: ExploreSearchParams | undefined, key: keyof ExploreSearchParams, value: string) {
  const v = String(current?.[key] || "").trim().toLowerCase();
  if (!value) return !v;
  return v === value.toLowerCase();
}

const GENRES = ["all", "action", "isekai", "murim", "romance", "fantasy", "drama", "school", "adventure"] as const;
const TYPES = ["", "manga", "manhwa", "manhua"] as const;
const STATUSES = ["", "ongoing", "completed"] as const;
const SORTS = ["latest", "popular", "az"] as const;

function sortItems(items: any[], sort: string) {
  const s = String(sort || "").toLowerCase();
  if (s === "az") {
    return [...items].sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
  }
  return items;
}

export default async function ExploreIndexPage({
  searchParams,
}: {
  searchParams?: ExploreSearchParams;
}) {
  const genreParam = String(searchParams?.genre || "all").trim().toLowerCase() || "all";
  const page = parsePage(searchParams?.page);
  const status = String(searchParams?.status || "").trim().toLowerCase();
  const format = String(searchParams?.type || "").trim().toLowerCase();
  const sort = String(searchParams?.sort || "latest").trim().toLowerCase();
  const current: ExploreSearchParams = { ...(searchParams || {}), genre: genreParam };

  let items: any[] = [];
  let pagination: any = null;
  try {
    const res: any = await getExplore(genreParam, {
      page,
      pageSize: 24,
      status: status || undefined,
      format: format || undefined,
    });
    items = asArray<any>(res.data);
    pagination = res.pagination || null;
  } catch {
    items = [];
    pagination = null;
  }

  const currentPage = pagination?.currentPage ?? page;
  const totalPages = pagination?.totalPages ?? 1;
  const sorted = sortItems(items, sort);
  const genreName = genreParam === "all" ? "" : titleize(decodeURIComponent(genreParam));
  const typeName = format ? titleize(format) : "";
  const headerTitle = genreName
    ? `Explore: ${genreName}${typeName ? ` ${typeName}` : ""}`
    : typeName
      ? `Explore: ${typeName}`
      : "Explore";

  let trendingItems: any[] = [];
  try {
    const popular: any = await getPopular();
    const popularItems = asArray<any>(popular.data);
    trendingItems = format
      ? popularItems.filter((c) => String(c?.type || "").trim().toLowerCase() === format)
      : popularItems;
  } catch {
    trendingItems = [];
  }

  if (!trendingItems.length) trendingItems = items.slice(0, 10);
  trendingItems = trendingItems.slice(0, 10);
  const trendingLabel = format ? `Trending ${titleize(format)}` : "Trending";

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <Navbar />
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <SectionHeader title={headerTitle} icon={Compass} />

        {trendingItems.length ? (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4">
              <Flame className="text-orange-500" size={24} />
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                {trendingLabel}
              </h1>
            </div>
            <PopularHorizontal data={trendingItems} showHeader={false} showFilters={false} />
          </section>
        ) : null}

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6 bg-[#111] p-6 rounded-2xl border border-white/5 h-fit md:sticky md:top-24">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <Link
                    key={g}
                    href={`/explore${buildQuery(current, { genre: g, page: "1" })}`}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      isActive(current, "genre", g)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-black border-white/5 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {titleize(g)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Tipe</h3>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <Link
                    key={t || "all"}
                    href={`/explore${buildQuery(current, { type: t, page: "1" })}`}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      isActive(current, "type", t)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-black border-white/5 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {t ? titleize(t) : "All"}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Status</h3>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <Link
                    key={s || "all"}
                    href={`/explore${buildQuery(current, { status: s, page: "1" })}`}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      isActive(current, "status", s)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-black border-white/5 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {s ? titleize(s) : "All"}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Urutan</h3>
              <div className="flex flex-wrap gap-2">
                {SORTS.map((s) => (
                  <Link
                    key={s}
                    href={`/explore${buildQuery(current, { sort: s, page: "1" })}`}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      isActive(current, "sort", s === "latest" ? "" : s) ||
                      (s === "latest" && (String(current?.sort || "") === "" || String(current?.sort || "") === "latest"))
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-black border-white/5 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {s === "az" ? "A-Z" : titleize(s)}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <p className="text-xs text-gray-500">
              Menampilkan {sorted.length} komik{totalPages > 1 ? ` — Page ${currentPage}/${totalPages}` : ""}.
            </p>

            {sorted.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sorted.map((c: any) => (
                  <ComicCard key={c.id_series} comic={c} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#151515] rounded-2xl border border-dashed border-gray-800">
                <p className="text-gray-500">Belum ada komik untuk filter ini.</p>
              </div>
            )}

            {totalPages > 1 ? (
              <div className="flex justify-between items-center pt-6">
                {currentPage > 1 ? (
                  <Link
                    href={`/explore${buildQuery(current, { page: String(currentPage - 1) })}`}
                    className="px-4 py-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600"
                  >
                    Prev
                  </Link>
                ) : (
                  <span />
                )}

                {pagination?.nextPage ? (
                  <Link
                    href={`/explore${buildQuery(current, { page: String(pagination.nextPage) })}`}
                    className="px-4 py-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600"
                  >
                    Next
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/recommended/[type]/page.tsx

```tsx
import ComicCard from "@/components/ComicCard";
import Navbar from "@/components/Navbar";
import SectionHeader from "@/components/SectionHeader";
import { getRecommended } from "@/lib/api";
import { Book, Star } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RecommendedPage({ params }: { params: { type: string } }) {
  const type = String(params.type || "").toLowerCase();
  if (type !== "manhwa" && type !== "manga") notFound();

  const res = await getRecommended(type);
  const comics = Array.isArray(res.data) ? res.data : [];

  const title = type === "manhwa" ? "Semua Manhwa Rekomendasi" : "Semua Manga Rekomendasi";
  const icon = type === "manhwa" ? Star : Book;

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-10 space-y-8">
        <SectionHeader title={title} icon={icon} />

        {comics.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {comics.map((c: any) => (
              <ComicCard key={c.id_series} comic={c} />
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-gray-500">Belum ada rekomendasi tersedia.</p>
        )}
      </main>
    </div>
  );
}

```

---

## my-komik-debe/src/app/series/[id]/page.tsx

```tsx
import Navbar from "@/components/Navbar";
import BookmarkButton from "@/components/BookmarkButton";
import ContinueReading from "@/components/ContinueReading";
import ChapterList from "@/components/ChapterList";
import RelatedSeries from "@/components/RelatedSeries";
import ShareButton from "@/components/ShareButton";
import { getSeries } from "@/lib/api";
import { parseSynopsis } from "@/lib/text";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Book, Clock, LayoutGrid, Star, User } from "lucide-react";

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parsePositiveInt(value: unknown, fallback: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function formatStatus(value: unknown) {
  if (typeof value === "number") return value === 1 ? "Ongoing" : "Completed";
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v.includes("ongo")) return "Ongoing";
    if (v.includes("complete") || v.includes("end") || v.includes("tamat")) return "Completed";
    return value;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await getSeries(params.id, 1, 1);
    if (!res?.status || !res.data) return { title: "Komik Tidak Ditemukan" };

    const s: any = res.data;
    const title = String(s.title || "Komik");
    const parsed = parseSynopsis(s.synopsis);
    const description =
      parsed.synopsis.slice(0, 160) || `Baca komik ${title} bahasa Indonesia terbaru gratis.`;

    const image = typeof s.image === "string" ? s.image : "";
    const proxyImage = image ? `/api/proxy?url=${encodeURIComponent(image)}` : undefined;

    return {
      title: `Baca ${title} Bahasa Indonesia - DEBEKOMIK`,
      description,
      openGraph: {
        title,
        description,
        images: proxyImage ? [proxyImage, image].filter(Boolean) : image ? [image] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: proxyImage ? [proxyImage, image].filter(Boolean) : image ? [image] : [],
      },
    };
  } catch {
    return { title: "Komik Tidak Ditemukan" };
  }
}

export default async function SeriesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const page = parsePage(searchParams.page);
  const pageSize = 40;
  const res = await getSeries(params.id, page, pageSize);

  if (!res?.status || !res.data) notFound();

  const s: any = res.data;
  const chapters = Array.isArray(s.chapters) ? (s.chapters as any[]) : [];
  const firstChapter = [...chapters].sort((a, b) => {
    const an = Number(a?.number);
    const bn = Number(b?.number);
    const aOk = Number.isFinite(an);
    const bOk = Number.isFinite(bn);
    if (!aOk && !bOk) return 0;
    if (!aOk) return 1;
    if (!bOk) return -1;
    return an - bn;
  })[0];
  const firstChapterId = firstChapter?.id_chapter as string | undefined;
  const proxiedImg = s?.image ? `/api/proxy?url=${encodeURIComponent(s.image)}` : "";
  const pagination = (res as any).pagination || s.pagination || {};
  const currentPage = parsePositiveInt(pagination.currentPage, page);
  const totalPages = parsePositiveInt(pagination.totalPages, 1);
  const chapterCount = parsePositiveInt(pagination.totalRecords, chapters.length);
  const statusLabel = formatStatus(s?.info?.status);
  const typeLabel =
    typeof s?.type === "string" && s.type.trim()
      ? s.type
      : typeof s?.format === "string" && s.format.trim()
        ? s.format
        : "Komik";
  const parsed = parseSynopsis(s.synopsis);
  const synopsis = parsed.synopsis;
  const credit = parsed.credit;
  const creditWork = credit?.match(/<([^>]+)>/)?.[1]?.trim();
  const creditText = creditWork ? `Oleh author dari: ${creditWork}` : credit;

  let firstChapterGlobalId = firstChapterId;
  let firstChapterGlobalNumber = Number.isFinite(Number(firstChapter?.number))
    ? Number(firstChapter?.number)
    : null;

  const numbers = chapters
    .map((ch) => Number(ch?.number))
    .filter((n) => Number.isFinite(n)) as number[];
  const order =
    numbers.length >= 2 ? (numbers[0] < numbers[numbers.length - 1] ? "asc" : numbers[0] > numbers[numbers.length - 1] ? "desc" : null) : null;

  const considerCandidate = (candidate: any) => {
    const id = candidate?.id_chapter ? String(candidate.id_chapter) : null;
    const num = Number(candidate?.number);
    if (!id || !Number.isFinite(num)) return;
    if (firstChapterGlobalNumber === null || num < firstChapterGlobalNumber) {
      firstChapterGlobalNumber = num;
      firstChapterGlobalId = id;
    }
  };

  const fetchMinChapterFromPage = async (pageToFetch: number) => {
    const resPage = await getSeries(params.id, pageToFetch, pageSize);
    const pageChapters = Array.isArray((resPage as any)?.data?.chapters) ? (resPage as any).data.chapters : [];
    const minChapter = [...pageChapters].sort((a, b) => {
      const an = Number(a?.number);
      const bn = Number(b?.number);
      const aOk = Number.isFinite(an);
      const bOk = Number.isFinite(bn);
      if (!aOk && !bOk) return 0;
      if (!aOk) return 1;
      if (!bOk) return -1;
      return an - bn;
    })[0];
    considerCandidate(minChapter);
  };

  if (totalPages > 1) {
    try {
      if (order === "asc") {
        if (currentPage !== 1) await fetchMinChapterFromPage(1);
      } else if (order === "desc") {
        if (currentPage !== totalPages) await fetchMinChapterFromPage(totalPages);
      } else {
        if (currentPage !== 1) await fetchMinChapterFromPage(1);
        if (currentPage !== totalPages) await fetchMinChapterFromPage(totalPages);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-[#0b0b0b]">
      <Navbar />
      <main className="min-h-screen pb-10">
        <div className="relative h-[360px] md:h-[500px] w-full overflow-hidden">
          {proxiedImg ? (
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30"
              style={{ backgroundImage: `url(${proxiedImg})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#111]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />

          <div className="relative container mx-auto px-4 h-full flex flex-col md:flex-row items-end gap-6 pb-10">
            <div className="relative w-40 md:w-64 aspect-[3/4] flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-gray-800 bg-[#111]">
              {proxiedImg ? (
                <Image
                  src={proxiedImg}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 160px, 256px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>

            <div className="flex-1 space-y-4">
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {s.title}
              </h1>

              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Book size={14} className="text-blue-400" /> {typeLabel}
                </span>

                {statusLabel ? (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Clock size={14} className="text-green-400" /> {statusLabel}
                  </span>
                ) : null}

                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <LayoutGrid size={14} className="text-purple-400" /> {chapterCount} Chapters
                </span>

                {typeof s?.info?.rating === "number" ? (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Star size={14} className="text-yellow-400" /> {s.info.rating}
                  </span>
                ) : null}

                {creditText ? (
                  <span
                    className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 min-w-0"
                    title={credit}
                  >
                    <User size={14} className="text-cyan-300" />
                    <span className="truncate max-w-[240px]">{creditText}</span>
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {(s.genres || []).map((g: string) => (
                  <span
                    key={g}
                    className="text-[10px] uppercase font-bold px-3 py-1 bg-gray-900 border border-gray-700 rounded-md text-gray-300"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <ContinueReading id_series={s.id_series} first_chapter_id={firstChapterGlobalId} />
                <ShareButton title={String(s.title || "Komik")} />
                <BookmarkButton
                  series={{ id_series: s.id_series, title: s.title, image: s.image }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 space-y-12">
          <section className="bg-[#0e0e0e]/80 backdrop-blur p-6 rounded-2xl border border-gray-900 space-y-6 shadow-2xl">
            {totalPages > 1 ? (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Page {currentPage} / {totalPages}
                </span>
                <span>Total: {chapterCount}</span>
              </div>
            ) : null}

            <ChapterList
              initialChapters={chapters}
              synopsis={synopsis}
              pagination={pagination}
              seriesId={String(s.id_series || params.id)}
            />
          </section>

          <RelatedSeries
            genres={Array.isArray(s?.genres) ? (s.genres as string[]) : []}
            excludeId={String(s?.id_series || params.id)}
          />
        </div>
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/chapter/[id]/page.tsx

```tsx
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, LayoutGrid } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readJson, writeJson } from "@/lib/storage";
import ReaderControls from "@/components/ReaderControls";

type ChapterData = {
  title?: string;
  images?: string[];
  id_series?: string;
  series_id?: string;
  thumbnail?: string;
  image?: string;
  chapter_name?: string;
  chapter_title?: string;
  prev_id?: string | null;
  next_id?: string | null;
  prev_chapter?: string | null;
  next_chapter?: string | null;
  [key: string]: unknown;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_KOMIKDEBE_BASE_URL || "https://komikdebe.vercel.app";
}

function getPrevNext(data: ChapterData) {
  const prev =
    (data.prev_id as string | null | undefined) ??
    (data.prev_chapter as string | null | undefined) ??
    null;
  const next =
    (data.next_id as string | null | undefined) ??
    (data.next_chapter as string | null | undefined) ??
    null;
  return { prev, next };
}

type CachedChapter = {
  ts: number;
  data: ChapterData;
};

function chapterCacheKey(id: string) {
  return `chapter_cache:${id}`;
}

function readChapterCache(id: string): ChapterData | null {
  try {
    const raw = sessionStorage.getItem(chapterCacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedChapter | null;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.data || typeof parsed.data !== "object") return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeChapterCache(id: string, data: ChapterData) {
  try {
    const payload: CachedChapter = { ts: Date.now(), data };
    sessionStorage.setItem(chapterCacheKey(id), JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export default function Reader({ params }: { params: { id: string } }) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [isTheater, setIsTheater] = useState(false);
  const baseUrl = useMemo(() => getBaseUrl().replace(/\/+$/, ""), []);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const cached = readChapterCache(params.id);
    const hadCache = Boolean(cached);
    if (cached) setData(cached);
    const controller = new AbortController();

    fetch(`${baseUrl}/chapter/${params.id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const chapter = (json?.data || null) as ChapterData | null;
        setData(chapter);
        if (chapter) writeChapterCache(params.id, chapter);

        if (chapter) {
          const idSeries = (chapter.id_series || chapter.series_id) as string | undefined;
          const image = (chapter.thumbnail || chapter.image) as string | undefined;
          const chapterName =
            (chapter.chapter_name || chapter.chapter_title || chapter.title) as string | undefined;

          const key = "read_history";
          const history = readJson<unknown>(key, []);
          const list = Array.isArray(history) ? (history as any[]) : [];
          const filtered = list.filter((x) => x?.id_chapter !== params.id);
          const next = [
            {
              id_series: idSeries,
              id_chapter: params.id,
              title: chapter.title,
              ch_name: chapterName,
              image,
              date: Date.now(),
            },
            ...filtered,
          ].slice(0, 20);
          writeJson(key, next);
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (!hadCache) setData(null);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [baseUrl, params.id]);

  useEffect(() => {
    if (!data) return;
    const { next } = getPrevNext(data);
    if (!next) return;
    if (readChapterCache(next)) return;

    const controller = new AbortController();
    router.prefetch(`/chapter/${next}`);
    fetch(`${baseUrl}/chapter/${next}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        const chapter = (json?.data || null) as ChapterData | null;
        if (chapter) writeChapterCache(next, chapter);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [baseUrl, data, router]);

  if (!data) {
    return (
      <div className="p-20 text-center text-white font-bold animate-pulse">
        Memuat Chapter...
      </div>
    );
  }

  const images = Array.isArray(data.images) ? data.images : [];
  const { prev, next } = getPrevNext(data);
  const seriesId = (data.id_series || data.series_id) as string | undefined;
  const seriesHref = seriesId ? `/series/${seriesId}` : "/";
  const chapterLabel =
    (data.chapter_name || data.chapter_title || data.title) ?? "Reading";

  return (
    <div className="bg-black min-h-screen text-white transition-all duration-500">
      <nav
        className={`sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 p-3 shadow-xl transition-transform duration-500 ${
          isTheater ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Link
            href={seriesHref}
            className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white"
            title={seriesId ? "Kembali ke Detail" : "Kembali"}
            aria-label={seriesId ? "Kembali ke Detail" : "Kembali"}
          >
            <LayoutGrid size={22} />
          </Link>

          <div className="flex flex-col items-center min-w-0 flex-1 px-2">
            <h1 className="text-[11px] text-blue-400 font-bold uppercase tracking-tighter truncate w-full text-center">
              {data.title}
            </h1>
            <p className="text-[13px] font-medium text-white truncate w-full text-center">
              {chapterLabel}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {prev ? (
              <Link
                href={`/chapter/${prev}`}
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

            {next ? (
              <Link
                href={`/chapter/${next}`}
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
        className={`max-w-2xl mx-auto cursor-pointer ${
          isTheater ? "py-0" : "py-4"
        }`}
        onClick={() => setIsTheater((v) => !v)}
      >
        {images.map((url, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`${i}-${url}`}
            src={`/api/proxy?url=${encodeURIComponent(url)}`}
            alt={`Page ${i + 1}`}
            className="w-full h-auto"
            loading="lazy"
          />
        ))}
      </div>

      <div
        className={`max-w-2xl mx-auto flex justify-between items-center p-10 border-t border-gray-900 mt-10 transition-opacity duration-500 ${
          isTheater ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {prev ? (
          <Link
            href={`/chapter/${prev}`}
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

        {next ? (
          <Link
            href={`/chapter/${next}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
          >
            NEXT <ChevronRight size={20} />
          </Link>
        ) : (
          <div />
        )}
      </div>

      <ReaderControls
        isTheater={isTheater}
        onToggleTheater={() => setIsTheater((v) => !v)}
      />
    </div>
  );
}
```

---

## my-komik-debe/src/app/bookmarks/page.tsx

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { readJson, writeJson } from "@/lib/storage";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type BookmarkItem = {
  id_series: string;
  title: string;
  image: string;
  added_at?: number;
};

const STORAGE_KEY = "bookmarks";

function load(): BookmarkItem[] {
  const data = readJson<unknown>(STORAGE_KEY, []);
  return Array.isArray(data) ? (data as BookmarkItem[]) : [];
}

export default function BookmarksPage() {
  const [items, setItems] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setItems(load());
  }, []);

  function remove(idSeries: string) {
    const next = items.filter((x) => x.id_series !== idSeries);
    setItems(next);
    writeJson(STORAGE_KEY, next);
  }

  function clearAll() {
    setItems([]);
    writeJson(STORAGE_KEY, []);
  }

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white">Bookmarks</h1>
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
          <p className="text-gray-400">Belum ada bookmark.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((b) => (
              <div
                key={b.id_series}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 flex flex-col"
              >
                <Link href={`/series/${b.id_series}`} className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={
                      b.image
                        ? `/api/proxy?url=${encodeURIComponent(b.image)}`
                        : "/placeholder-comic.svg"
                    }
                    alt={b.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover"
                  />
                </Link>
                <div className="p-3 flex-1 flex flex-col gap-2">
                  <Link href={`/series/${b.id_series}`}>
                    <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-blue-400">
                      {b.title}
                    </h3>
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(b.id_series)}
                    className="mt-auto px-3 py-2 rounded bg-[#151515] border border-gray-800 hover:border-red-600 text-xs text-gray-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/history/page.tsx

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { readJson, writeJson } from "@/lib/storage";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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
      <Navbar />
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white">History</h1>
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
          <div className="space-y-3">
            {items.map((h) => (
              <div
                key={h.id_chapter}
                className="flex gap-3 p-3 rounded-lg bg-[#151515] border border-gray-800"
              >
                {h.image ? (
                  <Link href={`/chapter/${h.id_chapter}`} className="shrink-0">
                    <Image
                      src={
                        h.image
                          ? `/api/proxy?url=${encodeURIComponent(h.image)}`
                          : "/placeholder-comic.svg"
                      }
                      alt={h.title || "cover"}
                      width={56}
                      height={80}
                      className="w-14 h-20 object-cover rounded border border-gray-800"
                    />
                  </Link>
                ) : null}

                <div className="flex-1 min-w-0">
                  <Link href={`/chapter/${h.id_chapter}`} className="block">
                    <div className="font-bold text-white truncate">{h.title || "Chapter"}</div>
                    {h.ch_name ? <div className="text-xs text-gray-400 truncate">{h.ch_name}</div> : null}
                  </Link>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Link
                      href={`/chapter/${h.id_chapter}`}
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold"
                    >
                      Lanjut baca
                    </Link>
                    {h.id_series ? (
                      <Link
                        href={`/series/${h.id_series}`}
                        className="px-3 py-1.5 rounded bg-[#0b0b0b] border border-gray-800 hover:border-blue-600 text-xs"
                      >
                        Detail series
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## my-komik-debe/src/app/api/proxy/route.ts

```ts
import { isIP } from "node:net";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getAllowedHosts() {
  const raw = process.env.KOMIK_PROXY_ALLOWED_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedHostname(hostname: string) {
  const allowList = getAllowedHosts();
  if (!allowList.length) return true;

  const host = hostname.toLowerCase();
  return allowList.some((pattern) => {
    if (!pattern) return false;
    if (pattern.startsWith("*.")) {
      const base = pattern.slice(2);
      return host === base || host.endsWith(`.${base}`);
    }
    if (pattern.startsWith(".")) {
      const base = pattern.slice(1);
      return host === base || host.endsWith(`.${base}`);
    }
    return host === pattern;
  });
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return false;

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

function isPrivateIpv6(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "::1" || host === "::") return true;
  if (host.startsWith("fe80:")) return true; // link-local
  if (host.startsWith("fc") || host.startsWith("fd")) return true; // ULA
  return false;
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local")) return true;

  const ipVersion = isIP(host);
  if (ipVersion === 4) return isPrivateIpv4(host);
  if (ipVersion === 6) return isPrivateIpv6(host);
  return false;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return new Response("No URL", { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return new Response("Invalid protocol", { status: 400 });
  }

  if (!url.hostname || isBlockedHostname(url.hostname)) {
    return new Response("Blocked host", { status: 403 });
  }

  if (!isAllowedHostname(url.hostname)) {
    return new Response("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(url.toString(), {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });

  if (!upstream.ok) {
    return new Response("Upstream error", { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");

  return new Response(upstream.body, { status: 200, headers });
}
```

---
