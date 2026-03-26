import BookmarkButton from "@/components/BookmarkButton";
import ContinueReading from "@/components/ContinueReading";
import ChapterList from "@/components/ChapterList";
import RelatedSeries from "@/components/RelatedSeries";
import ShareButton from "@/components/ShareButton";
import { getSeries, getSeriesIdBySlug } from "@/lib/api";
import { parseSynopsis, slugify } from "@/lib/text";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Book, Clock, LayoutGrid, Star, User } from "lucide-react";

function parsePage(value: unknown) {
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parsePositiveInt(value: unknown, fallback: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function formatStatus(value: unknown) {
  if (typeof value === "number") return value === 1 ? "Ongoing" : "Completed";
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v.includes("ongo")) return "Ongoing";
    if (v.includes("complete") || v.includes("end") || v.includes("tamat")) return "Completed";
    return value;
  }
  return null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function resolveSeriesId(slugOrId: string) {
  const raw = String(slugOrId || "").trim();
  if (!raw) return null;
  if (isUuid(raw)) return raw;
  return await getSeriesIdBySlug(raw);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const id = await resolveSeriesId(params.slug);
    if (!id) return { title: "Komik Tidak Ditemukan" };

    const res = await getSeries(id, 1, 1);
    if (!res?.status || !res.data) return { title: "Komik Tidak Ditemukan" };

    const s: any = res.data;
    const title = String(s.title || "Komik");
    const parsed = parseSynopsis(s.synopsis);
    const description =
      parsed.synopsis.slice(0, 160) || `Baca komik ${title} bahasa Indonesia terbaru gratis.`;

    const image = typeof s.image === "string" ? s.image : "";
    const proxyImage = image ? `/api/proxy?url=${encodeURIComponent(image)}` : undefined;

    return {
      title: `Baca ${title} Bahasa Indonesia - ZENKOMIK`,
      description,
      openGraph: {
        title,
        description,
        images: proxyImage ? [proxyImage, image].filter(Boolean) : image ? [image] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: proxyImage ? [proxyImage, image].filter(Boolean) : image ? [image] : [],
      },
    };
  } catch {
    return { title: "Komik Tidak Ditemukan" };
  }
}

export default async function SeriesPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const page = parsePage(searchParams.page);
  const pageSize = 40;
  const id = await resolveSeriesId(params.slug);
  if (!id) notFound();

  const res = await getSeries(id, page, pageSize);

  if (!res?.status || !res.data) notFound();

  const s: any = res.data;
  const canonicalSlug = slugify(String(s?.title || "")) || String(s?.id_series || id);
  if (canonicalSlug && params.slug !== canonicalSlug) {
    const qs = page && page !== 1 ? `?page=${page}` : "";
    redirect(`/series/${encodeURIComponent(canonicalSlug)}${qs}`);
  }

  const chapters = Array.isArray(s.chapters) ? (s.chapters as any[]) : [];
  const firstChapter = [...chapters].sort((a, b) => {
    const an = Number(a?.number);
    const bn = Number(b?.number);
    const aOk = Number.isFinite(an);
    const bOk = Number.isFinite(bn);
    if (!aOk && !bOk) return 0;
    if (!aOk) return 1;
    if (!bOk) return -1;
    return an - bn;
  })[0];
  const firstChapterId = firstChapter?.id_chapter as string | undefined;
  const proxiedImg = s?.image ? `/api/proxy?url=${encodeURIComponent(s.image)}` : "";
  const pagination = (res as any).pagination || s.pagination || {};
  const currentPage = parsePositiveInt(pagination.currentPage, page);
  const totalPages = parsePositiveInt(pagination.totalPages, 1);
  const chapterCount = parsePositiveInt(pagination.totalRecords, chapters.length);
  const statusLabel = formatStatus(s?.info?.status);
  const typeLabel =
    typeof s?.type === "string" && s.type.trim()
      ? s.type
      : typeof s?.format === "string" && s.format.trim()
        ? s.format
        : "Komik";
  const parsed = parseSynopsis(s.synopsis);
  const synopsis = parsed.synopsis;
  const credit = parsed.credit;
  const creditWork = credit?.match(/<([^>]+)>/)?.[1]?.trim();
  const creditText = creditWork ? `Oleh author dari: ${creditWork}` : credit;

  let firstChapterGlobalId = firstChapterId;
  let firstChapterGlobalNumber = Number.isFinite(Number(firstChapter?.number))
    ? Number(firstChapter?.number)
    : null;

  const numbers = chapters
    .map((ch) => Number(ch?.number))
    .filter((n) => Number.isFinite(n)) as number[];
  const order =
    numbers.length >= 2 ? (numbers[0] < numbers[numbers.length - 1] ? "asc" : numbers[0] > numbers[numbers.length - 1] ? "desc" : null) : null;

  const considerCandidate = (candidate: any) => {
    const id = candidate?.id_chapter ? String(candidate.id_chapter) : null;
    const num = Number(candidate?.number);
    if (!id || !Number.isFinite(num)) return;
    if (firstChapterGlobalNumber === null || num < firstChapterGlobalNumber) {
      firstChapterGlobalNumber = num;
      firstChapterGlobalId = id;
    }
  };

  const fetchMinChapterFromPage = async (pageToFetch: number) => {
    const resPage = await getSeries(id, pageToFetch, pageSize);
    const pageChapters = Array.isArray((resPage as any)?.data?.chapters) ? (resPage as any).data.chapters : [];
    const minChapter = [...pageChapters].sort((a, b) => {
      const an = Number(a?.number);
      const bn = Number(b?.number);
      const aOk = Number.isFinite(an);
      const bOk = Number.isFinite(bn);
      if (!aOk && !bOk) return 0;
      if (!aOk) return 1;
      if (!bOk) return -1;
      return an - bn;
    })[0];
    considerCandidate(minChapter);
  };

  if (totalPages > 1) {
    try {
      if (order === "asc") {
        if (currentPage !== 1) await fetchMinChapterFromPage(1);
      } else if (order === "desc") {
        if (currentPage !== totalPages) await fetchMinChapterFromPage(totalPages);
      } else {
        if (currentPage !== 1) await fetchMinChapterFromPage(1);
        if (currentPage !== totalPages) await fetchMinChapterFromPage(totalPages);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-[#0b0b0b]">
      <main className="min-h-screen pb-10">
        <div className="relative h-[360px] md:h-[500px] w-full overflow-hidden">
          {proxiedImg ? (
            <Image
              src={proxiedImg}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover scale-110 blur-2xl opacity-30 pointer-events-none select-none"
            />
          ) : (
            <div className="absolute inset-0 bg-[#111]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />

          <div className="relative container mx-auto px-4 h-full flex flex-col items-center md:flex-row md:items-end gap-6 pb-10">
            <div className="relative w-40 md:w-64 aspect-[3/4] flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-gray-800 bg-[#111] mx-auto md:mx-0">
              {proxiedImg ? (
                <Image
                  src={proxiedImg}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 160px, 256px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {s.title}
              </h1>

              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-300 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Book size={14} className="text-blue-400" /> {typeLabel}
                </span>

                {statusLabel ? (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Clock size={14} className="text-green-400" /> {statusLabel}
                  </span>
                ) : null}

                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <LayoutGrid size={14} className="text-purple-400" /> {chapterCount} Chapters
                </span>

                {typeof s?.info?.rating === "number" ? (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Star size={14} className="text-yellow-400" /> {s.info.rating}
                  </span>
                ) : null}

                {creditText ? (
                  <span
                    className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 min-w-0"
                    title={credit}
                  >
                    <User size={14} className="text-cyan-300" />
                    <span className="truncate max-w-[240px]">{creditText}</span>
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(s.genres || []).map((g: string) => (
                  <span
                    key={g}
                    className="text-[10px] uppercase font-bold px-3 py-1 bg-gray-900 border border-gray-700 rounded-md text-gray-300"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                <ContinueReading
                  id_series={s.id_series}
                  first_chapter_id={firstChapterGlobalId}
                  first_chapter_number={firstChapterGlobalNumber}
                  series_slug={canonicalSlug}
                />
                <ShareButton title={String(s.title || "Komik")} />
                <BookmarkButton
                  series={{ id_series: s.id_series, title: s.title, image: s.image }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 space-y-12">
          <section className="bg-[#0e0e0e]/80 backdrop-blur p-6 rounded-2xl border border-gray-900 space-y-6 shadow-2xl">
            {totalPages > 1 ? (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Page {currentPage} / {totalPages}
                </span>
                <span>Total: {chapterCount}</span>
              </div>
            ) : null}

            <ChapterList
              initialChapters={chapters}
              synopsis={synopsis}
              pagination={pagination}
              seriesHref={`/series/${encodeURIComponent(canonicalSlug)}`}
            />
          </section>

          <RelatedSeries
            genres={Array.isArray(s?.genres) ? (s.genres as string[]) : []}
            excludeId={String(s?.id_series || id)}
          />
        </div>
      </main>
    </div>
  );
}
