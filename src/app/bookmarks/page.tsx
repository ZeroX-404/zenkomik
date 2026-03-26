"use client";

import Link from "next/link";
import Image from "next/image";
import { readJson, writeJson } from "@/lib/storage";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/text";

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
      <main className="container mx-auto px-4 mt-8 space-y-6 pb-24 md:pb-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Bookmarks</h1>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {items.map((b) => {
              const seriesSlug = slugify(String(b.title || "")) || String(b.id_series || "");
              const seriesHref = seriesSlug ? `/series/${encodeURIComponent(seriesSlug)}` : "/";
              const cover = b.image
                ? `/api/proxy?url=${encodeURIComponent(b.image)}`
                : "/placeholder-comic.svg";

              return (
                <div key={b.id_series} className="group space-y-2">
                  <div className="relative">
                    <Link
                      href={seriesHref}
                      className="relative block aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/5 bg-[#111] shadow-xl"
                      aria-label={`Buka ${b.title}`}
                    >
                      <Image
                        src={cover}
                        alt={b.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-[8px] font-black uppercase tracking-widest text-gray-200">
                        Bookmarked
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(b.id_series);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 text-gray-200 hover:bg-red-600 transition"
                      aria-label={`Hapus bookmark ${b.title}`}
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={seriesHref} className="block">
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-2 group-hover:text-blue-400 transition">
                      {b.title}
                    </h3>
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
