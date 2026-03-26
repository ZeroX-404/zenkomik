"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter whitespace-nowrap"
          aria-label="ZENKOMIK Home"
        >
          <span className="text-blue-500">ZEN</span>
          <span className="text-white">KOMIK</span>
        </Link>

        <form action="/search" method="get" className="hidden md:flex flex-1 max-w-md relative">
          <input
            name="q"
            type="text"
            placeholder="Cari komik..."
            className="w-full bg-[#151515] text-white pl-10 pr-4 py-2 rounded-full focus:ring-2 focus:ring-blue-500 outline-none border border-gray-800"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
        </form>

        <Link
          href="/search"
          className="md:hidden ml-auto p-2 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10"
          aria-label="Search"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}

