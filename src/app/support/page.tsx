import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Heart, Medal, ShieldCheck, Trophy, Zap } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dukung ZENKOMIK",
};

export default function SupportPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-12 max-w-5xl pb-32">
      <SectionHeader title="Dukung ZENKOMIK" icon={Heart} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <section className="lg:col-span-8 bg-[#111] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent -z-10" />

          <div className="relative group flex-shrink-0">
            <Image
              src="https://i.giphy.com/w7dn7xRSHGZUs.webp"
              alt="Support Admin"
              width={224}
              height={224}
              unoptimized
              className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] object-cover border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover:rotate-0 -rotate-3"
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 p-3 rounded-2xl shadow-xl animate-bounce">
              <Medal className="text-black" size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
              ADMIN BUTUH{" "}
              <span className="text-blue-500 drop-shadow-[0_0_18px_rgba(37,99,235,0.45)]">
                ASUPAN!
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Bantu admin beli kopi &amp; indomie biar mata nggak sepet pas update chapter buat
              kalian semua.
              <br />
              Setiap dukungan sangat berarti buat kelangsungan web ini.
            </p>
            <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-blue-500 font-bold text-[10px] tracking-[0.2em] uppercase">
              <ShieldCheck size={14} /> NO ADS FOREVER WITH YOUR SUPPORT
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 flex flex-col gap-4">
          <a
            href="https://trakteer.id/zenkomik"
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 group bg-[#111] hover:bg-blue-600 border border-white/5 hover:border-blue-400 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-xl"
          >
            <div className="p-4 bg-white/5 group-hover:bg-white/20 rounded-2xl mb-4 transition-colors">
              <Coffee className="text-blue-500 group-hover:text-white" size={32} />
            </div>
            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-100 uppercase tracking-widest mb-1">
              Via Trakteer
            </span>
            <span className="text-xl font-black text-white">TRAKTIR KOPI</span>
          </a>

          <a
            href="https://saweria.co/zenkomik"
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 group bg-[#111] hover:bg-orange-500 border border-white/5 hover:border-orange-400 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-xl"
          >
            <div className="p-4 bg-white/5 group-hover:bg-white/20 rounded-2xl mb-4 transition-colors">
              <Zap className="text-orange-500 group-hover:text-white" size={32} />
            </div>
            <span className="text-xs font-bold text-gray-500 group-hover:text-orange-100 uppercase tracking-widest mb-1">
              Via Saweria
            </span>
            <span className="text-xl font-black text-white">DUKUNG ADMIN</span>
          </a>
        </section>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-500" size={28} />
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            Wall of Fame
          </h2>
        </div>

        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 text-center">
          <p className="text-gray-300 font-black uppercase tracking-tighter">Belum ada data</p>
          <p className="text-gray-500 text-sm mt-2">
            Nama donatur bakal ditampilin di sini kalau udah siap.
          </p>
        </div>

        <div className="py-10 text-center space-y-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">
            Mau namamu muncul di sini?
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-blue-500 text-[10px] font-black uppercase">
            <Heart size={12} className="fill-current animate-pulse" /> Terima kasih orang baik
          </div>
          <p className="text-[11px] text-gray-500">
            Setelah donasi, chat admin biar nama &amp; pesanmu bisa ditampilin.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex px-4 py-2 rounded-xl bg-[#151515] border border-white/5 text-xs font-bold hover:bg-white hover:text-black transition"
            >
              Balik ke Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
