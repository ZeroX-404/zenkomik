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
            {items.map((b) => {
              const seriesSlug = slugify(String(b.title || "")) || String(b.id_series || "");
              const seriesHref = seriesSlug ? `/series/${encodeURIComponent(seriesSlug)}` : "/";

              return (
                <div
                  key={b.id_series}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 flex flex-col"
                >
                  <Link href={seriesHref} className="relative aspect-[3/4] overflow-hidden">
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
                    <Link href={seriesHref}>
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
