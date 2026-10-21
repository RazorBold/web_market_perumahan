# Hyarta Ecovillage

Website marketing perumahan Hyarta Ecovillage, Yogyakarta. Dibangun dengan Next.js (App Router), Tailwind CSS v4, dan Three.js untuk model 3D interaktif.

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # lalu isi nomor WhatsApp sales
npm run dev                  # http://localhost:3000
```

| Perintah        | Fungsi                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Server development                      |
| `npm run build` | Build production (termasuk cek tipe)    |
| `npm start`     | Menjalankan hasil build                 |
| `npm test`      | Unit test kalkulasi KPR & data unit     |
| `npm run lint`  | Cek tipe TypeScript                     |

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di [vercel.com/new](https://vercel.com/new), import repo. Framework terdeteksi otomatis sebagai Next.js; jika repo berisi folder lain, set **Root Directory** ke folder project ini.
3. Isi **Environment Variables** (lihat `.env.example`):
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: nomor WhatsApp sales, format `628…`
   - `NEXT_PUBLIC_SITE_URL`: domain final, mis. `https://hyarta-ecovillage.com`
   - `LEAD_WEBHOOK_URL` (opsional): URL webhook penerima data form
4. Deploy. Setiap push ke branch lain otomatis mendapat preview URL.

## Struktur

```
src/
  app/
    page.tsx              Beranda (semua section)
    tipe/[slug]/          Halaman detail tipe rumah + model 3D
    artikel/[slug]/       Halaman artikel
    actions/lead.ts       Server Action penerima data form KPR & kunjungan
    sitemap.ts, robots.ts SEO
  components/             Section & komponen UI
  data/propertyData.ts    Data tipe rumah, kavling, fasilitas, artikel
  utils/propertyLogic.ts  Kalkulasi KPR, filter unit, format Rupiah
  config/                 Kontak WhatsApp & URL situs
```

Menambah artikel atau tipe rumah cukup lewat `src/data/propertyData.ts`; halaman, sitemap, dan metadata ikut dibuat otomatis.

## Model 3D & video

File asli (belum dikompres) disimpan di `source-assets/`; yang dipakai website ada di `public/`.

**Model 3D per tipe rumah.** Townhouse 115 memakai `public/models/townhouse-115.glb`; tipe tanpa file `.glb` otomatis memakai model sederhana. Untuk menambah tipe lain:

```bash
npm run optimize:model -- source-assets/townhouse-125.glb   # → public/models/townhouse-125.glb
```

lalu isi `modelUrl: '/models/townhouse-125.glb'` pada tipe tersebut di `src/data/propertyData.ts`. Skrip ini mengecilkan file (tekstur WebP + kompresi geometri meshopt) tanpa membuang efek tekstur timbul. Fitur pisah lantai dan titik ruang membaca nama node di model (`upper_floor`, `furniture_upper`, `furniture_ground_sofa`, dst.), jadi model baru sebaiknya diekspor dengan penamaan yang sama.

**Video tur.** `public/videos/hyarta-tour.mp4` (H.264 + faststart) beserta poster dan thumbnail tiap bab. Waktu mulai tiap bab diatur di `TOUR_VIDEO.chapters` dalam `src/data/propertyData.ts`.

## Data form (lead)

Form simulasi KPR dan jadwal kunjungan membuka WhatsApp sales dengan pesan terisi, sekaligus mengirim data ke `submitLead`. Tanpa `LEAD_WEBHOOK_URL`, data hanya tercatat di log Vercel (menu **Logs**, cari `[lead]`). Dengan webhook, data dikirim sebagai JSON `{ source, name, phone, detail, createdAt }`, sehingga bisa disambungkan ke Google Sheets (Apps Script), Make, Zapier, n8n, Slack, atau Discord.
