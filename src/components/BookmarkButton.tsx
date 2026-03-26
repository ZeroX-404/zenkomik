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

