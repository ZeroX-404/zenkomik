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
                        href={`/series/${encodeURIComponent(slugify(String(h.title || "")) || String(h.id_series))}`}
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
