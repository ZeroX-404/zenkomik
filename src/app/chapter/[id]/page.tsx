import { notFound, redirect } from "next/navigation";
import { getChapter } from "@/lib/api";

function extractChapterNumberText(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;

  const cleaned = raw
    .replace(/^chapter\s*/i, "")
    .replace(/^ch\.?\s*/i, "")
    .replace(/^episode\s*/i, "")
    .replace(/_/g, ".")
    .replace(/^chapter-/, "")
    .replace(/^ch-/, "");

  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match?.[1]) return null;

  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
}

export default async function ChapterLegacyPage({ params }: { params: { id: string } }) {
  const chapterId = String(params.id || "").trim();
  if (!chapterId) notFound();

  const res: any = await getChapter(chapterId);
  const chapter = res?.data ?? null;
  if (!res?.status || !chapter) notFound();

  const seriesId = String(chapter?.id_series || chapter?.series_id || "").trim();
  if (!seriesId) notFound();

  const chapterNumberText =
    extractChapterNumberText(chapter?.number) ||
    extractChapterNumberText(chapter?.chapter) ||
    extractChapterNumberText(chapter?.chapter_name) ||
    extractChapterNumberText(chapter?.chapter_title) ||
    extractChapterNumberText(chapter?.ch_name) ||
    null;

  if (!chapterNumberText) {
    redirect(`/series/${encodeURIComponent(seriesId)}`);
  }

  redirect(
    `/series/${encodeURIComponent(seriesId)}/${encodeURIComponent(`chapter-${chapterNumberText}`)}`
  );
}

