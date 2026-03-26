import ComicCard from "@/components/ComicCard";
import SectionHeader from "@/components/SectionHeader";
import { getRecommended } from "@/lib/api";
import { Book, Star } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RecommendedPage({ params }: { params: { type: string } }) {
  const type = String(params.type || "").toLowerCase();
  if (type !== "manhwa" && type !== "manga") notFound();

  const res = await getRecommended(type);
  const comics = Array.isArray(res.data) ? res.data : [];

  const title = type === "manhwa" ? "Semua Manhwa Rekomendasi" : "Semua Manga Rekomendasi";
  const icon = type === "manhwa" ? Star : Book;

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <main className="container mx-auto px-4 py-6 md:py-10 space-y-8">
        <SectionHeader title={title} icon={icon} />

        {comics.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {comics.map((c: any) => (
              <ComicCard key={c.id_series} comic={c} />
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-gray-500">Belum ada rekomendasi tersedia.</p>
        )}
      </main>
    </div>
  );
}
