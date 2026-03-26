import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
  href?: string;
};

export default function SectionHeader({ title, icon: Icon, href }: Props) {
  return (
    <div className="flex items-center justify-between mb-6 border-l-4 border-blue-600 pl-4">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="text-blue-500" size={22} />
        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter truncate">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-[10px] font-bold text-gray-500 hover:text-blue-500 transition uppercase border border-gray-800 px-3 py-1 rounded-full whitespace-nowrap"
        >
          Lihat Semua
        </Link>
      ) : null}
    </div>
  );
}

