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

## Data form (lead)

Form simulasi KPR dan jadwal kunjungan membuka WhatsApp sales dengan pesan terisi, sekaligus mengirim data ke `submitLead`. Tanpa `LEAD_WEBHOOK_URL`, data hanya tercatat di log Vercel (menu **Logs**, cari `[lead]`). Dengan webhook, data dikirim sebagai JSON `{ source, name, phone, detail, createdAt }`, sehingga bisa disambungkan ke Google Sheets (Apps Script), Make, Zapier, n8n, Slack, atau Discord.
