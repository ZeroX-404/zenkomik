import ComicCard from "@/components/ComicCard";
import { getExplore } from "@/lib/api";

function slugifyGenre(value: unknown) {
  const raw = typeof value === "string" ? value : "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function RelatedSeries({
  genres,
  excludeId,
}: {
  genres?: string[];
  excludeId?: string;
}) {
  const mainGenre = slugifyGenre(Array.isArray(genres) && genres.length ? genres[0] : "action") || "action";

  try {
    const res = await getExplore(mainGenre, { pageSize: 12 });
    const items = Array.isArray(res.data) ? res.data : [];
    const filtered = items
      .filter((c: any) => String(c?.id_series || "") && String(c.id_series) !== String(excludeId || ""))
      .slice(0, 6);

    if (!filtered.length) return null;

    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
          <h2 className="text-xl font-black uppercase text-white">Rekomendasi Serupa</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.map((c: any) => (
            <ComicCard key={c.id_series} comic={c} />
          ))}
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

