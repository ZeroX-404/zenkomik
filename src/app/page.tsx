import ComicCard from "@/components/ComicCard";
import Hero from "@/components/Hero";
import PopularHorizontal from "@/components/PopularHorizontal";
import RecommendedScroll from "@/components/RecommendedScroll";
import Sidebar from "@/components/Sidebar";
import SectionHeader from "@/components/SectionHeader";
import PromoCard from "@/components/PromoCard";
import ContinueReadingHub from "@/components/ContinueReadingHub";
import ScrollReveal from "@/components/ScrollReveal";
import { mirrorFallbackRows } from "@/data/mirrorFallback";
import { getExplore, getLatest, getPopular, getRecommended, getSeries } from "@/lib/api";
import { fetchMirrorFeed } from "@/lib/mirrorFeed";
import { mapMirrorFallbackRows } from "@/lib/mirrorFallback";
import { normalizeSynopsis } from "@/lib/text";
import { Globe, Star, Zap } from "lucide-react";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseRating(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
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

export default async function Home() {
  const [latestProjectSettled, latestMirrorSettled, popularSettled, manhwaSettled, mangaSettled] =
    await Promise.allSettled([
      getLatest("project"),
      getLatest("mirror"),
      getPopular(),
      getExplore("all", { pageSize: 18, format: "manhwa" }),
      getExplore("all", { pageSize: 12, format: "manga" }),
    ]);

  const latestProject =
    latestProjectSettled.status === "fulfilled" ? latestProjectSettled.value : ({ data: [] } as any);
  const latestMirror =
    latestMirrorSettled.status === "fulfilled" ? latestMirrorSettled.value : ({ data: [] } as any);
  const popular = popularSettled.status === "fulfilled" ? popularSettled.value : ({ data: [] } as any);
  let manhwaRec = manhwaSettled.status === "fulfilled" ? manhwaSettled.value : ({ data: [] } as any);
  let mangaRec = mangaSettled.status === "fulfilled" ? mangaSettled.value : ({ data: [] } as any);

  if (!asArray<any>(manhwaRec.data).length) {
    try {
      manhwaRec = await getRecommended("manhwa");
    } catch {
      // ignore
    }
  }
  if (!asArray<any>(mangaRec.data).length) {
    try {
      mangaRec = await getRecommended("manga");
    } catch {
      // ignore
    }
  }

  const latestProjectItems = asArray<any>(latestProject.data);
  let latestMirrorItems = asArray<any>(latestMirror.data);
  const popularItems = asArray<any>(popular.data);
  const manhwaItems = asArray<any>(manhwaRec.data);
  const mangaItems = asArray<any>(mangaRec.data);
  const heroSeed = popularItems.slice(0, 6);

  if (!latestMirrorItems.length) {
    const mirrorFeed = await fetchMirrorFeed();
    latestMirrorItems = mirrorFeed.length ? mirrorFeed : mapMirrorFallbackRows(mirrorFallbackRows);
  }

  const heroItems = await Promise.all(
    heroSeed.map(async (c: any) => {
      const id = String(c?.id_series || "");
      if (!id) return c;

      try {
        const res: any = await getSeries(id, 1, 1);
        const s: any = res?.data || null;
        const pagination = res?.pagination || s?.pagination || {};

        const chapterCountRaw = pagination?.totalRecords;
        const chapterCount =
          typeof chapterCountRaw === "number"
            ? chapterCountRaw
            : Number.isFinite(Number(chapterCountRaw))
              ? Number(chapterCountRaw)
              : Array.isArray(s?.chapters)
                ? s.chapters.length
                : null;

        const genres = Array.isArray(s?.genres) ? (s.genres as string[]) : [];
        const synopsis = normalizeSynopsis(s?.synopsis);
        const status = formatStatus(s?.info?.status);
        const rating =
          typeof s?.info?.rating === "number" ? s.info.rating : parseRating(c?.rating);
        const updated =
          (c?.latestChapters?.[0]?.releaseTime as string | undefined) ||
          (Array.isArray(s?.chapters) ? (s.chapters[0]?.time as string | undefined) : undefined);

        return {
          ...c,
          hero: {
            status,
            chapterCount,
            genres,
            synopsis,
            rating,
            updated,
          },
        };
      } catch {
        return c;
      }
    })
  );

  return (
    <div className="min-h-screen pb-10 bg-[#0b0b0b]">
      <main className="container mx-auto px-4 py-6 md:py-10 space-y-12 pb-24 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9 space-y-12">
            <Hero trending={heroItems} />
            <ContinueReadingHub />
            <ScrollReveal>
              <PopularHorizontal data={popularItems} />
            </ScrollReveal>

            <ScrollReveal delayMs={40}>
              <section className="space-y-6">
                <SectionHeader title="Eksplor Manhwa" icon={Star} href="/explore?format=manhwa" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {manhwaItems.slice(0, 4).map((c: any) => (
                    <ComicCard key={c.id_series} comic={c} />
                  ))}

                  <div className="hidden lg:block">
                    <PromoCard
                      title="Dukung Admin"
                      link="https://trakteer.id/zenkomik"
                      image="https://c.tenor.com/rt-b5wrDLisAAAAd/tenor.gif"
                      storageKey="promo:support-admin"
                    />
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delayMs={60}>
              <RecommendedScroll title="Eksplor Manga" data={mangaItems} type="manga" />
            </ScrollReveal>

            <ScrollReveal delayMs={80}>
              <section>
                <SectionHeader title="Update Project" icon={Zap} href="/latest?type=project" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {latestProjectItems.slice(0, 8).map((c: any) => (
                    <ComicCard key={c.id_series} comic={c} />
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <section>
                <SectionHeader title="Mirror Updates" icon={Globe} href="/latest?type=mirror" />
                {latestMirrorItems.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {latestMirrorItems.slice(0, 8).map((c: any) => (
                      <ComicCard key={c.id_series} comic={c} isMirror />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-xl border border-gray-800 bg-[#151515] text-gray-400">
                    Belum ada data mirror.
                  </div>
                )}
              </section>
            </ScrollReveal>
          </div>

          <aside className="lg:col-span-3">
            <ScrollReveal delayMs={120}>
              <Sidebar trending={popularItems} />
            </ScrollReveal>
          </aside>
        </div>
      </main>
    </div>
  );
}
