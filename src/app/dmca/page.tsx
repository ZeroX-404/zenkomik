import SectionHeader from "@/components/SectionHeader";
import { Shield } from "lucide-react";

export default function DmcaPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-8 max-w-3xl">
      <SectionHeader title="DMCA / Copyright" icon={Shield} />

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-4 text-gray-300 text-sm leading-relaxed">
        <p>
          ZENKOMIK menghormati hak cipta. Jika kamu adalah pemilik hak cipta dan merasa ada konten
          yang melanggar, silakan kirim permintaan takedown dengan informasi berikut:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li>Link halaman yang dilaporkan</li>
          <li>Bukti kepemilikan / otorisasi</li>
          <li>Informasi kontak yang bisa dihubungi</li>
        </ul>
        <p className="text-gray-400">
          Setelah kami menerima laporan lengkap, kami akan meninjau dan mengambil tindakan yang
          diperlukan.
        </p>
      </div>
    </main>
  );
}

