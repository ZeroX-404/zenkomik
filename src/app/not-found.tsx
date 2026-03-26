import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-black text-white">404 — Tidak ditemukan</h1>
        <p className="text-gray-400">
          Halaman yang kamu cari nggak ada, atau datanya belum tersedia.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}

