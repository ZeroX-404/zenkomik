export const mirrorFallbackRows: unknown = [
  // Paste data feed mirror kamu di sini (pastikan kamu punya izin untuk menggunakan datanya).
  // Bisa berupa:
  // - Array row custom (contoh di bawah), atau
  // - `data` dari endpoint JSON yang kamu pakai (mis. `.../api/contents?page=1`), atau
  // - Seluruh response object selama ada key `data: [...]`.
  // Contoh format (opsional):
  // {
  //   "Judul Komik": "Contoh Judul",
  //   "URL Komik": "https://example.com/series/contoh-judul",
  //   "Gambar Sampul Komik": "https://example.com/cover.jpg",
  //   "Chapter Terbaru": "Chapter 40",
  //   "Waktu Update Chapter Terbaru": "6 jam",
  //   "URL Chapter Terbaru": "https://example.com/chapter/contoh-judul-chapter-40"
  // }
];
