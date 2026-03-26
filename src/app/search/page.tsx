import type { Metadata } from "next";
import { Search } from "lucide-react";
import ComicCard from "@/components/ComicCard";
import SectionHeader from "@/components/SectionHeader";
import { searchComics } from "@/lib/api";

export const metadata: Metadata = {
  title: "Search - ZENKOMIK",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = String(searchParams.q || "").trim();

  const result = q ? await searchComics(q) : null;

  const direct = result && Array.isArray((result as any).data) ? ((result as any).data as any[]) : null;
  const nested = result ? asArray<any>((result as any)?.data?.data) : [];
  const items = q ? (direct ?? nested) : [];

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <main className="container mx-auto px-4 mt-8 space-y-6">
        <SectionHeader title="Search" icon={Search} />

        <form action="/search" method="get" className="flex flex-col md:flex-row gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Ketik judul komik..."
            className="flex-1 bg-[#151515] text-white px-4 py-3 rounded-xl border border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black"
          >
            Cari
          </button>
        </form>

        {!q ? (
          <div className="py-16 text-center text-gray-400 bg-[#111] rounded-2xl border border-dashed border-gray-800">
            Ketik judul komik untuk mulai mencari.
          </div>
        ) : items.length ? (
          <>
            <p className="text-sm text-gray-400">
              Query: <span className="text-white font-semibold">{q}</span> ({items.length} hasil)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((c: any) => (
                <ComicCard key={c.id_series} comic={c} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-gray-400 bg-[#111] rounded-2xl border border-dashed border-gray-800">
            Tidak ada hasil untuk <span className="text-white font-semibold">{q}</span>.
          </div>
        )}
      </main>
    </div>
  );
}
