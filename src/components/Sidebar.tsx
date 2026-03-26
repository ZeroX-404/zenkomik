import Link from "next/link";
import Image from "next/image";
import { Hash, TrendingUp } from "lucide-react";
import SupportCard from "@/components/SupportCard";
import { slugify } from "@/lib/text";

type TrendingComic = {
  id_series: string;
  title: string;
  image: string;
};

const TAGS = ["Action", "Isekai", "Murim", "Romance", "Fantasy"];

export default function Sidebar({ trending }: { trending: TrendingComic[] }) {
  const list = Array.isArray(trending) ? trending : [];

  return (
    <div className="sticky top-24 space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-5 text-orange-500">
          <TrendingUp size={20} />
          <h3 className="font-black uppercase tracking-tight text-white text-sm">Top Weekly</h3>
        </div>
        <div className="space-y-4">
          {list.slice(0, 6).map((comic, i) => (
            <Link
              key={comic.id_series}
              href={`/series/${encodeURIComponent(slugify(comic.title) || comic.id_series)}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative flex-shrink-0 w-10 h-14 rounded overflow-hidden border border-gray-800 bg-gray-900">
                <Image
                  src={
                    comic.image
                      ? `/api/proxy?url=${encodeURIComponent(comic.image)}`
                      : "/placeholder-comic.svg"
                  }
                  alt={comic.title}
                  fill
                  sizes="40px"
                  className="object-cover group-hover:scale-110 transition"
                />
                <div className="absolute top-0 left-0 bg-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-br">
                  {i + 1}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[13px] font-bold text-gray-200 line-clamp-1 group-hover:text-blue-400 transition">
                  {comic.title}
                </h4>
              </div>
            </Link>
          ))}

          {!list.length ? <p className="text-xs text-gray-500">Belum ada data populer.</p> : null}
        </div>
      </section>

      <section className="bg-[#151515] p-5 rounded-xl border border-gray-800">
        <h3 className="text-[11px] font-black uppercase text-gray-500 mb-4 flex items-center gap-2">
          <Hash size={14} /> Populer
        </h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((g) => (
            <Link
              key={g}
              href={`/explore/${g.toLowerCase()}`}
              className="text-[10px] font-bold px-3 py-1.5 bg-gray-900 hover:bg-blue-600 border border-gray-800 rounded-md transition"
            >
              {g}
            </Link>
          ))}
        </div>
      </section>

      <SupportCard />
    </div>
  );
}
