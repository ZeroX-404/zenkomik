import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ChapterReader from "@/components/ChapterReader";
import { getChapter, getChapterLookupByNumber, getSeriesIdBySlug } from "@/lib/api";
import { slugify } from "@/lib/text";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function resolveSeriesId(slugOrId: string) {
  const raw = String(slugOrId || "").trim();
  if (!raw) return null;
  if (isUuid(raw)) return raw;
  return await getSeriesIdBySlug(raw);
}

function extractChapterNumberText(chapterNum: string) {
  const raw = String(chapterNum || "").trim().toLowerCase();
  if (!raw) return null;
  let s = raw.replace(/^chapter-/, "").replace(/^ch-/, "");
  if (!s) return null;
  if (/^\d+-\d+$/.test(s) && !s.includes(".")) s = s.replace("-", ".");
  s = s.replace(/_/g, ".");
  const match = s.match(/^\d+(?:\.\d+)?/);
  const text = match?.[0] ?? null;
  if (!text) return null;
  const n = Number(text);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
}

function formatChapterSegment(value: number) {
  const text = Number.isInteger(value) ? String(Math.trunc(value)) : String(value);
  return `chapter-${text}`;
}

function titleizeSlug(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; chapterNum: string };
}): Promise<Metadata> {
  const seriesName = titleizeSlug(decodeURIComponent(params.slug || ""));
  const chapterText = extractChapterNumberText(params.chapterNum) || params.chapterNum;

  return {
    title: `Baca ${seriesName} Chapter ${chapterText} Bahasa Indonesia - ZENKOMIK`,
    description: `Baca komik ${seriesName} chapter terbaru hanya di ZENKOMIK.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: { slug: string; chapterNum: string };
}) {
  const seriesId = await resolveSeriesId(params.slug);
  if (!seriesId) notFound();

  const lookup = await getChapterLookupByNumber(seriesId, params.chapterNum);
  if (!lookup) notFound();

  const canonicalSeriesSlug = slugify(String(lookup.seriesTitle || params.slug)) || params.slug;
  const canonicalChapterSegment = formatChapterSegment(lookup.current.number);
  if (params.slug !== canonicalSeriesSlug || params.chapterNum !== canonicalChapterSegment) {
    redirect(
      `/series/${encodeURIComponent(canonicalSeriesSlug)}/${encodeURIComponent(canonicalChapterSegment)}`
    );
  }

  const chapterRes = await getChapter(lookup.current.id_chapter);
  if (!chapterRes?.status || !chapterRes.data) notFound();

  const chapter: any = chapterRes.data;
  const fallbackLabel = `Chapter ${extractChapterNumberText(params.chapterNum) || canonicalChapterSegment.replace(/^chapter-/, "")}`;

  const seriesHref = `/series/${encodeURIComponent(canonicalSeriesSlug)}`;
  const prevHref = lookup.prev
    ? `/series/${encodeURIComponent(canonicalSeriesSlug)}/${encodeURIComponent(
        formatChapterSegment(lookup.prev.number)
      )}`
    : null;
  const nextHref = lookup.next
    ? `/series/${encodeURIComponent(canonicalSeriesSlug)}/${encodeURIComponent(
        formatChapterSegment(lookup.next.number)
      )}`
    : null;

  return (
    <ChapterReader
      chapterId={lookup.current.id_chapter}
      seriesId={seriesId}
      seriesHref={seriesHref}
      seriesTitle={lookup.seriesTitle}
      seriesImage={lookup.seriesImage}
      prevHref={prevHref}
      nextHref={nextHref}
      chapter={chapter}
      fallbackChapterLabel={fallbackLabel}
    />
  );
}
