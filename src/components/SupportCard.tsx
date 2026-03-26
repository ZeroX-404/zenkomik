import Image from "next/image";
import { Coffee, Heart } from "lucide-react";

export default function SupportCard({
  href = "https://trakteer.id/zenkomik",
}: {
  href?: string;
}) {
  return (
    <div className="relative bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group transition-all duration-500 hover:border-blue-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50 group-hover:opacity-100 transition duration-500" />

      <div className="relative p-6 flex flex-col items-center text-center space-y-5">
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 -rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl bg-black/20">
          <Image
            src="https://i.giphy.com/w7dn7xRSHGZUs.webp"
            alt="Support Admin Lucu"
            width={128}
            height={128}
            unoptimized
            className="w-full h-full object-cover scale-110"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-xl text-white tracking-tighter uppercase italic drop-shadow-md">
            ADMIN BUTUH ASUPAN! 🍙
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-medium px-2">
            Bantu admin beli kopi &amp; indomie ya biar mata nggak sepet pas update chapter
            buat kalian semua.
            <br />
            <span className="text-blue-500 font-bold block mt-2 text-[10px] tracking-widest uppercase">
              Semangat Admin = Update Makin Gacor! 🚀
            </span>
          </p>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
        >
          <Coffee size={18} fill="currentColor" />
          TRAKTIR KOPI ADMIN
        </a>

        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-black tracking-widest uppercase opacity-50">
          <Heart size={10} className="text-red-500 animate-pulse" fill="currentColor" />
          Satu Saweria Seribu Semangat
        </div>
      </div>
    </div>
  );
}
