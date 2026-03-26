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

function formatChapterSegment(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  const text = Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
  return `chapter-${text}`;
}

export default function ChapterList({
  initialChapters,
  synopsis,
  pagination,
  seriesHref,
}: {
  initialChapters: Chapter[];
  synopsis?: string;
  pagination?: PaginationInfo;
  seriesHref?: string;
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
  const canPaginate = Boolean(seriesHref) && totalPages > 1;
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
              const chapterSegment = formatChapterSegment(ch.number);
              const chapterHref =
                seriesHref && chapterSegment
                  ? `${seriesHref.replace(/\/+$/, "")}/${encodeURIComponent(chapterSegment)}`
                  : `/chapter/${ch.id_chapter}`;
              return (
                <Link
                  key={ch.id_chapter}
                  href={chapterHref}
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
                href={`${seriesHref}?page=1`}
                className={`p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition ${
                  currentPage === 1 ? "opacity-40 pointer-events-none" : ""
                }`}
                aria-label="Halaman pertama"
              >
                <ChevronsLeft size={18} />
              </Link>

              {prevPage ? (
                <Link
                  href={`${seriesHref}?page=${prevPage}`}
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
                  href={`${seriesHref}?page=${nextPage}`}
                  className="p-2 rounded bg-[#151515] border border-gray-800 hover:border-blue-600 transition"
                  aria-label="Berikutnya"
                >
                  <ChevronRight size={18} />
                </Link>
              ) : null}

              <Link
                href={`${seriesHref}?page=${totalPages}`}
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
