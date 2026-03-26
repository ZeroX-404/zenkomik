import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { ALL_GENRES, genreToSlug } from "@/lib/constants";
import { getExplore } from "@/lib/api";
import ComicCard from "@/components/ComicCard";

export const metadata: Metadata = {
  title: "Explore - ZENKOMIK",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type ExploreHubSearchParams = {
  status?: string;
  format?: string;
  page?: string;
};

const STATUS_OPTIONS = ["all", "ongoing", "completed", "hiatus"] as const;
const FORMAT_OPTIONS = ["all", "manga", "manhwa", "manhua"] as const;

function titleizeSlug(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeChoice(value: string, allowed: readonly string[]) {
  const v = value.trim().toLowerCase();
  return allowed.includes(v) ? v : allowed[0];
}

function buildExploreHubHref(status: string, format: string) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (format && format !== "all") params.set("format", format);
  const qs = params.toString();
  return `/explore${qs ? `?${qs}` : ""}`;
}

function buildGenreHref(slug: string, status: string, format: string) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (format && format !== "all") params.set("format", format);
  const qs = params.toString();
  return `/explore/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`;
}

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function buildExploreHubPageHref(status: string, format: string, page: number) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (format && format !== "all") params.set("format", format);
  const safePage = Math.max(1, page);
  if (safePage !== 1) params.set("page", String(safePage));
  const qs = params.toString();
  return `/explore${qs ? `?${qs}` : ""}`;
}

export default async function ExploreHubPage({
  searchParams,
}: {
  searchParams?: ExploreHubSearchParams;
}) {
  const status = normalizeChoice(String(searchParams?.status || "all"), STATUS_OPTIONS);
  const format = normalizeChoice(String(searchParams?.format || "all"), FORMAT_OPTIONS);
  const page = parsePage(searchParams?.page);

  let items: any[] = [];
  let pagination: any = null;
  try {
    const res: any = await getExplore("all", { status, format, page });
    items = asArray<any>(res?.data);
    pagination = res?.pagination ?? null;
  } catch {
    items = [];
    pagination = null;
  }

  const currentPage =
    typeof pagination?.currentPage === "number" && Number.isFinite(pagination.currentPage)
      ? pagination.currentPage
      : page;
  const totalPages =
    typeof pagination?.totalPages === "number" && Number.isFinite(pagination.totalPages)
      ? pagination.totalPages
      : 1;
  const totalRecords =
    typeof pagination?.totalRecords === "number" && Number.isFinite(pagination.totalRecords)
      ? pagination.totalRecords
      : null;
  const formatLabel = format === "all" ? "Semua" : titleizeSlug(format);
  const statusLabel = status === "all" ? "All" : titleizeSlug(status);

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <main className="container mx-auto px-6 py-10 space-y-10 pb-32">
        <SectionHeader title="Eksplorasi Komik" icon={LayoutGrid} />

        <section className="space-y-4 bg-[#111] p-5 rounded-2xl border border-gray-800">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">
                Status:
              </span>
              {STATUS_OPTIONS.map((s) => (
                <Link
                  key={s}
                  href={buildExploreHubHref(s, format)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    status === s ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  aria-current={status === s ? "page" : undefined}
                >
                  {s === "all" ? "All" : titleizeSlug(s)}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">
                Format:
              </span>
              {FORMAT_OPTIONS.map((f) => (
                <Link
                  key={f}
                  href={buildExploreHubHref(status, f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    format === f ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  aria-current={format === f ? "page" : undefined}
                >
                  {f === "all" ? "All" : titleizeSlug(f)}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">
	            Pilih filter, lalu pilih genre untuk melihat daftar komik.
	          </p>
	        </section>

	        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Pilih Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {ALL_GENRES.map((g) => {
              const slug = genreToSlug(g);
              return (
                <Link
                  key={g}
                  href={buildGenreHref(slug, status, format)}
                  className="p-4 bg-[#111] border border-white/5 rounded-2xl text-center text-[10px] font-bold hover:bg-blue-600 transition-all active:scale-95 uppercase"
                >
                  {g}
                </Link>
              );
	            })}
	          </div>
	        </section>

        <hr className="border-white/5" />

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black uppercase text-white tracking-tighter">
              Hasil Filter: <span className="text-blue-500">{formatLabel}</span>
            </h2>
            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap">
              {totalRecords ?? items.length} Komik
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Status: <span className="text-white">{statusLabel}</span> • Page{" "}
            <span className="text-white">{currentPage}</span>
            {totalPages > 1 ? (
              <>
                {" "}
                / <span className="text-white">{totalPages}</span>
              </>
            ) : null}
          </p>

          {items.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {items.map((c: any) => (
                <ComicCard key={c.id_series} comic={c} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 bg-[#111] rounded-3xl border border-dashed border-gray-800 font-bold">
              Waduh, nggak ada komik yang cocok sama filter lo.
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex justify-center items-center gap-4 pt-6">
              <Link
                href={buildExploreHubPageHref(status, format, currentPage - 1)}
                className={`px-6 py-2 bg-[#151515] border border-white/5 rounded-xl text-xs font-bold transition ${
                  currentPage <= 1
                    ? "opacity-20 pointer-events-none"
                    : "hover:bg-white hover:text-black"
                }`}
                aria-label="Previous page"
              >
                Prev
              </Link>

              <div className="px-6 py-2 bg-blue-600 rounded-xl font-black text-xs">
                PAGE {currentPage}
              </div>

              <Link
                href={buildExploreHubPageHref(status, format, currentPage + 1)}
                className={`px-6 py-2 bg-[#151515] border border-white/5 rounded-xl text-xs font-bold transition ${
                  currentPage >= totalPages
                    ? "opacity-20 pointer-events-none"
                    : "hover:bg-white hover:text-black"
                }`}
                aria-label="Next page"
              >
                Next
              </Link>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
