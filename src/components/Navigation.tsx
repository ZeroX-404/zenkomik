"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Heart, History, Home, LayoutGrid, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const MENUS: MenuItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Explore", href: "/explore", Icon: LayoutGrid },
  { label: "History", href: "/history", Icon: History },
  { label: "Bookmark", href: "/bookmarks", Icon: Heart },
  { label: "Cari", href: "/search", Icon: Search },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const pathname = usePathname();
  const supportHref = "/support";
  const isSupportActive = isActiveRoute(pathname, supportHref);

  return (
    <>
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center py-8 px-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-600/20 blur-[40px] rounded-full" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-purple-600/20 blur-[40px] rounded-full" />

          {MENUS.map(({ label, href, Icon }) => {
            const isActive = isActiveRoute(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className="group relative z-10"
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                title={label}
              >
                <span className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 pointer-events-none shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  {label}
                </span>

                <div
                  className={`p-3 rounded-2xl transition-all duration-500 relative ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] scale-110"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                  {isActive ? (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-400 rounded-full blur-[2px]" />
                  ) : null}
                </div>
              </Link>
            );
          })}

          <div className="w-full h-px bg-white/10 my-2" />

          <Link
            href={supportHref}
            className={`p-3 rounded-2xl transition-all relative z-10 ${
              isSupportActive
                ? "bg-orange-500/20 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.25)] scale-110"
                : "text-orange-500 hover:bg-orange-500/10"
            }`}
            aria-label="Support"
            aria-current={isSupportActive ? "page" : undefined}
            title="Support"
          >
            <Coffee size={22} strokeWidth={isSupportActive ? 2.5 : 2} />
          </Link>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-around items-center p-2 shadow-2xl">
          {MENUS.map(({ label, href, Icon }) => {
            const isActive = isActiveRoute(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                  isActive ? "bg-blue-600 text-white scale-110 shadow-lg" : "text-gray-500"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="sr-only">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
