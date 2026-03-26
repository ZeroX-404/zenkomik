import ComicCard from "@/components/ComicCard";
import ExploreHeader from "@/components/ExploreHeader";
import { getExplore } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const title = `Explore ${genreName} - ZENKOMIK`;
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
  format?: string;
  type?: string; // legacy
};

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams?: ExploreSearchParams;
}) {
  const genreParam = String(params.genre || "");
  const page = parsePage(searchParams?.page);
  const status = String(searchParams?.status || "all").trim().toLowerCase() || "all";
  const format =
    String(searchParams?.format || searchParams?.type || "all").trim().toLowerCase() || "all";

  let items: any[] = [];
  let pagination: any = null;
  try {
    const res: any = await getExplore(genreParam, {
      page,
      status,
      format,
    });
    items = asArray<any>(res.data);
    pagination = res.pagination || null;
  } catch {
    items = [];
    pagination = null;
  }

  const currentPage = pagination?.currentPage ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  function buildHref(nextPage: number) {
    const params = new URLSearchParams();
    const safePage = Math.max(1, nextPage);
    params.set("page", String(safePage));
    if (status && status !== "all") params.set("status", status);
    if (format && format !== "all") params.set("format", format);
    const qs = params.toString();
    return `?${qs}`;
  }

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <main className="container mx-auto px-4 mt-8 space-y-8 pb-32">
        <ExploreHeader genre={genreParam} currentStatus={status} currentFormat={format} />

        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {items.map((c: any) => (
              <ComicCard key={c.id_series} comic={c} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 bg-[#111] rounded-2xl border border-dashed border-gray-800">
            Tidak ada komik ditemukan untuk kriteria ini.
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex justify-center items-center gap-4 pt-10">
            <Link
              href={buildHref(currentPage - 1)}
              className={`p-3 rounded-xl bg-[#151515] border border-gray-800 text-white transition ${
                currentPage <= 1 ? "opacity-20 pointer-events-none" : "hover:border-blue-500"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </Link>

            <div className="px-6 py-2 bg-blue-600 rounded-xl font-black text-sm">
              PAGE {currentPage} OF {totalPages}
            </div>

            <Link
              href={buildHref(currentPage + 1)}
              className={`p-3 rounded-xl bg-[#151515] border border-gray-800 text-white transition ${
                currentPage >= totalPages
                  ? "opacity-20 pointer-events-none"
                  : "hover:border-blue-500"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
