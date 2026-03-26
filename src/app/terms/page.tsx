import SectionHeader from "@/components/SectionHeader";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-8 max-w-3xl">
      <SectionHeader title="Syarat & Ketentuan" icon={FileText} />

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-4 text-gray-300 text-sm leading-relaxed">
        <p>
          Dengan mengakses ZENKOMIK, kamu setuju untuk menggunakan layanan ini secara wajar dan tidak
          menyalahgunakan fitur (spam, scraping agresif, atau tindakan yang merugikan).
        </p>
        <p className="text-gray-400">
          Konten dapat berubah sewaktu-waktu. Kami tidak menjamin ketersediaan konten tertentu, dan
          dapat melakukan penyesuaian demi menjaga performa dan kualitas layanan.
        </p>
      </div>
    </main>
  );
}

