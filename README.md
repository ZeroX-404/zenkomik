# my-komik-debe

Next.js (App Router) web komik yang langsung konsumsi API KomikDebe, lengkap dengan:

- Home (Recommended / Popular / Latest)
- Detail series + list chapter
- Reader (Auto-Scroll + Prev/Next) + History saver
- Search
- Bookmarks
- Image Proxy (`/api/proxy`)

## Jalankan

```bash
cd my-komik-debe
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Node.js version

Project ini dipin ke `next@14` supaya bisa jalan di Node.js 18.x.

- Kalau kamu mau pakai Next.js terbaru (mis. `next@16`), upgrade Node.js ke `>=20.9.0`, lalu update dependency.

## Konfigurasi (opsional)

Copy `.env.example` jadi `.env.local`, lalu sesuaikan:

- `NEXT_PUBLIC_KOMIKDEBE_BASE_URL` / `KOMIKDEBE_BASE_URL`
- `NEXT_PUBLIC_SITE_URL` (buat OG/Twitter image absolut)
- `KOMIK_PROXY_ALLOWED_HOSTS` (optional, biar `/api/proxy` nggak jadi open-proxy)

## Dev tanpa API publik (opsional)

Kalau mau pakai API dummy lokal yang sudah ada di repo ini:

```bash
cd komik-api
npm run dev
```

Lalu di `my-komik-debe/.env.local` set:

```bash
NEXT_PUBLIC_KOMIKDEBE_BASE_URL=http://127.0.0.1:3000
KOMIKDEBE_BASE_URL=http://127.0.0.1:3000
```
