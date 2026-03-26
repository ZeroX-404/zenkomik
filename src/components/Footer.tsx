"use client";

import Link from "next/link";

const categories: Array<{ label: string; href: string }> = [
  { label: "Manhwa Action", href: "/explore/action?format=manhwa" },
  { label: "Manga Romance", href: "/explore/romance?format=manga" },
  { label: "Manhua Martial Arts", href: "/explore/martial%20arts?format=manhua" },
  { label: "Komik Isekai", href: "/explore/isekai" },
  { label: "Manhwa School", href: "/explore/school?format=manhwa" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-10 md:pb-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-5">
            <h2 className="text-3xl font-[900] text-blue-500 italic tracking-tighter">
              ZEN<span className="text-white">KOMIK</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md italic">
              Nikmati pengalaman membaca komik (Manga, Manhwa, Manhua) terbaik dengan antarmuka
              modern, tanpa iklan, dan selalu update setiap hari.
            </p>
          </div>

          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">
              Explore Zen
            </h3>
            <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase">
              {categories.map((cat) => (
                <li key={cat.label} className="hover:text-blue-500 transition">
                  <Link href={cat.href}>Baca {cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">
              Support
            </h3>
            <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase">
              <li className="hover:text-blue-500 transition">
                <Link href="/support">Traktir Admin</Link>
              </li>
              <li className="hover:text-blue-500 transition">
                <Link href="/dmca">DMCA / Copyright</Link>
              </li>
              <li className="hover:text-blue-500 transition">
                <Link href="/terms">Syarat & Ketentuan</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest text-center md:text-left">
            © 2026 ZENKOMIK. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

