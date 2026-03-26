"use client";

import { LayoutGrid } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import GenreModal from "@/components/GenreModal";

function titleizeSlug(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type Props = {
  genre: string;
  currentStatus: string;
  currentFormat: string;
};

export default function ExploreHeader({ genre, currentStatus, currentFormat }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genreLabel = titleizeSlug(decodeURIComponent(genre));

  function setFilter(key: "status" | "format", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const v = String(value || "").trim().toLowerCase();

    if (!v || v === "all") params.delete(key);
    else params.set(key, v);

    params.delete("type");
    params.delete("page");

    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
            <LayoutGrid size={14} /> Eksplorasi
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Genre: <span className="text-blue-600">{genreLabel}</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
        >
          PILIH GENRE
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-[#111] rounded-2xl border border-gray-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">
            Status:
          </span>
          {["all", "ongoing", "completed", "hiatus"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter("status", s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                currentStatus === s
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "all" ? "All" : titleizeSlug(s)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">
            Format:
          </span>
          {["all", "manga", "manhwa", "manhua"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter("format", f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                currentFormat === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All" : titleizeSlug(f)}
            </button>
          ))}
        </div>
      </div>

      <GenreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeGenre={genre}
        currentStatus={currentStatus}
        currentFormat={currentFormat}
      />
    </div>
  );
}
