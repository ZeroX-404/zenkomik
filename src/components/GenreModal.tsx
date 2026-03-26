"use client";

import { ALL_GENRES, genreToSlug } from "@/lib/constants";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeGenre: string;
  currentStatus?: string;
  currentFormat?: string;
};

export default function GenreModal({
  isOpen,
  onClose,
  activeGenre,
  currentStatus,
  currentFormat,
}: Props) {
  const router = useRouter();
  if (!isOpen) return null;

  function goToGenre(label: string) {
    const slug = genreToSlug(label);
    const params = new URLSearchParams();

    const status = String(currentStatus || "").trim().toLowerCase();
    const format = String(currentFormat || "").trim().toLowerCase();
    if (status && status !== "all") params.set("status", status);
    if (format && format !== "all") params.set("format", format);

    const qs = params.toString();
    router.push(`/explore/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">
            Pilih Genre
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 no-scrollbar">
          {ALL_GENRES.map((genre) => {
            const slug = genreToSlug(genre);
            const isActive = activeGenre === slug;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => goToGenre(genre)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-[#252525] border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

